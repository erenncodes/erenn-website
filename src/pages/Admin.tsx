import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  ShoppingCart,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Home,
  Check,
  X,
  Eye,
  Youtube,
  Settings,
  Shield,
  Lock,
  ExternalLink,
  Sparkles,
  Share2,
  Globe,
  Sliders,
  DollarSign,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  getPromoBannerConfig,
  savePromoBannerConfig,
  getSocialConfig,
  saveSocialConfig,
  siteConfig,
} from "@/data/siteConfig";
import { extractYouTubeVideoId } from "@/lib/productThumbnails";
import {
  PricingRule,
  GlobalPricingSettings,
  defaultPricingRules,
  defaultGlobalSettings,
  getPricingRules,
  savePricingRules,
  getGlobalPricingSettings,
  saveGlobalPricingSettings,
  calculateProductPrice,
  SAME_AS_INDIA_COUNTRIES,
} from "@/lib/countryPricing";
import { generateWorldPricingRules } from "@/data/countryList";
import { fetchUnifiedProducts, saveUnifiedProduct, deleteUnifiedProduct } from "@/lib/productService";
import {
  getBaseCustomerCount,
  setBaseCustomerCount,
  notifyCustomerCountChanged,
  useLiveCustomerCount,
  getLocalOrdersWithSeed,
  getLocalCompletedOrdersCount,
} from "@/lib/customerStats";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  demo_url: string;
  youtube_url?: string | null;
  country_prices?: Record<string, number> | null;
  is_active: boolean;
}

interface Order {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  payment_method: string;
  payment_reference: string | null;
  payment_screenshot_url?: string | null;
  amount: number;
  currency?: string;
  status: string;
  created_at: string;
  notes: string | null;
  products?: { title: string } | null;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"products" | "orders" | "messages" | "settings" | "pricing">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverridesInForm, setShowOverridesInForm] = useState(false);

  // Manual Order State
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [manualOrderData, setManualOrderData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    product_title: "",
    amount: "124",
    currency: "INR",
    payment_method: "GPay / UPI",
    payment_reference: "",
    status: "completed",
    notes: "",
  });

  // Dedicated Admin Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Product Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    demo_url: "",
    youtube_url: "",
    country_prices: {
      US: "",
      GB: "",
      EU: "",
      PK: "",
      AE: "",
      CA: "",
      AU: "",
      CN: "",
      BD: "",
      LK: "",
    },
  });

  // Settings State
  const [promoSettings, setPromoSettings] = useState(getPromoBannerConfig());
  const [socialSettings, setSocialSettings] = useState(getSocialConfig());
  const { count: liveCustomerCount } = useLiveCustomerCount();
  const [baseCustomers, setBaseCustomers] = useState(getBaseCustomerCount());

  // Country Pricing State
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(getPricingRules());
  const [globalSettings, setGlobalSettings] = useState<GlobalPricingSettings>(getGlobalPricingSettings());
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [ruleSearch, setRuleSearch] = useState("");
  const [newRuleData, setNewRuleData] = useState<Partial<PricingRule>>({
    countryCode: "",
    countryName: "",
    flag: "🌍",
    currency: "USD",
    currencySymbol: "$",
    minPrice: 5.0,
    fixedRateFromINR: 0.045,
    isInternational: true,
    isEnabled: true,
  });

  // Filtered 170+ Pricing Rules based on search
  const filteredPricingRules = useMemo(() => {
    if (!ruleSearch.trim()) return pricingRules;
    const q = ruleSearch.toLowerCase().trim();
    return pricingRules.filter(
      (r) =>
        r.countryName.toLowerCase().includes(q) ||
        r.countryCode.toLowerCase().includes(q) ||
        r.currency.toLowerCase().includes(q)
    );
  }, [pricingRules, ruleSearch]);

  // Simulator State
  const [simCountry, setSimCountry] = useState("IN");
  const [simProductId, setSimProductId] = useState<string>("");

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
      fetchMessages();
    }

    const handleDataUpdate = () => {
      fetchOrders();
      fetchMessages();
    };

    window.addEventListener("erenn_orders_updated", handleDataUpdate);
    window.addEventListener("erenn_messages_updated", handleDataUpdate);
    window.addEventListener("erenn_products_updated", handleDataUpdate);
    return () => {
      window.removeEventListener("erenn_orders_updated", handleDataUpdate);
      window.removeEventListener("erenn_messages_updated", handleDataUpdate);
      window.removeEventListener("erenn_products_updated", handleDataUpdate);
    };
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const data = await fetchUnifiedProducts(true);
      setProducts(data as Product[]);
      if (data.length > 0 && !simProductId) {
        setSimProductId(data[0].id);
      }
    } catch (e) {
      console.error("Admin fetchProducts failed:", e);
    }
  };

  const fetchOrders = async () => {
    const localOrders: Order[] = getLocalOrdersWithSeed();
    try {
      const { data } = await supabase
        .from("orders")
        .select("*, products(title)")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const dbIds = new Set(data.map((d: any) => d.id));
        const combined = [...data, ...localOrders.filter((o) => !dbIds.has(o.id))];
        setOrders(combined as Order[]);
        await generateSignedUrls(combined as Order[]);
        return;
      }
    } catch (e) {}
    setOrders(localOrders);
  };

  const generateSignedUrls = async (ordersList: Order[]) => {
    const urlMap: Record<string, string> = {};
    for (const order of ordersList) {
      const filePath = order.payment_screenshot_url;
      if (filePath && !filePath.startsWith("http")) {
        const { data, error } = await supabase.storage
          .from("payment-screenshots")
          .createSignedUrl(filePath, 3600);
        if (data?.signedUrl && !error) {
          urlMap[order.id] = data.signedUrl;
        }
      } else if (filePath?.startsWith("http")) {
        urlMap[order.id] = filePath;
      }
    }
    setSignedUrls(urlMap);
  };

  const fetchMessages = async () => {
    const localMsgs: ContactMessage[] = JSON.parse(localStorage.getItem("erenn_contact_messages") || "[]");
    try {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const dbIds = new Set(data.map((d: any) => d.id));
        setMessages([...data, ...localMsgs.filter((m) => !dbIds.has(m.id))]);
        return;
      }
    } catch (e) {}
    setMessages(localMsgs);
  };

  // Dedicated Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = typeof signIn === "function" 
        ? await signIn(loginEmail.trim(), loginPassword)
        : await supabase.auth.signInWithPassword({
            email: loginEmail.trim(),
            password: loginPassword,
          });

      if (res?.error) {
        toast({ title: "Login failed", description: res.error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back, Admin!" });
      }
    } catch (err: any) {
      toast({ title: "Error during sign in", description: err.message, variant: "destructive" });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    const overrides = product.country_prices || {};
    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price !== undefined ? product.price.toString() : "",
      category: product.category || "",
      image_url: product.image_url || "",
      demo_url: product.demo_url || "",
      youtube_url: product.youtube_url || "",
      country_prices: {
        US: overrides.US ? overrides.US.toString() : "",
        GB: overrides.GB ? overrides.GB.toString() : "",
        EU: overrides.EU ? overrides.EU.toString() : "",
        PK: overrides.PK ? overrides.PK.toString() : "",
        AE: overrides.AE ? overrides.AE.toString() : "",
        CA: overrides.CA ? overrides.CA.toString() : "",
        AU: overrides.AU ? overrides.AU.toString() : "",
        CN: overrides.CN ? overrides.CN.toString() : "",
        BD: overrides.BD ? overrides.BD.toString() : "",
        LK: overrides.LK ? overrides.LK.toString() : "",
      },
    });
    setShowOverridesInForm(Object.keys(overrides).length > 0);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setShowOverridesInForm(false);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      demo_url: "",
      youtube_url: "",
      country_prices: {
        US: "",
        GB: "",
        EU: "",
        PK: "",
        AE: "",
        CA: "",
        AU: "",
        CN: "",
        BD: "",
        LK: "",
      },
    });
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price) {
      toast({ title: "Title and price are required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const parsedPrice = parseFloat(formData.price);
    const cleanYoutube = formData.youtube_url?.trim() || null;

    // Build cleaned country overrides
    const cleanedOverrides: Record<string, number> = {};
    Object.entries(formData.country_prices).forEach(([cCode, val]) => {
      if (val && !isNaN(parseFloat(val))) {
        cleanedOverrides[cCode] = parseFloat(val);
      }
    });

    const productPayload: Record<string, any> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      currency: "INR",
      category: formData.category.trim(),
      image_url: formData.image_url.trim(),
      demo_url: formData.demo_url.trim(),
      youtube_url: cleanYoutube,
      country_prices: cleanedOverrides,
      is_active: true,
    };

    try {
      const existingId = editingProduct ? editingProduct.id : null;
      const res = await saveUnifiedProduct(productPayload, existingId);
      if (res.success) {
        toast({ title: editingProduct ? "Product updated successfully!" : "Product added successfully!" });
        handleCloseForm();
        fetchProducts();
      } else {
        toast({ title: "Failed to save product", description: res.error, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error saving product", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteUnifiedProduct(id);
      toast({ title: "Product deleted" });
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await supabase.from("orders").update({ status }).eq("id", id);
    } catch (e) {}

    try {
      const localOrders: Order[] = JSON.parse(localStorage.getItem("erenn_customer_orders") || "[]");
      const updated = localOrders.map((o) => (o.id === id ? { ...o, status } : o));
      localStorage.setItem("erenn_customer_orders", JSON.stringify(updated));
    } catch (e) {}

    notifyCustomerCountChanged();
    toast({ title: `Order marked as ${status}` });
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await supabase.from("orders").delete().eq("id", id);
    } catch (e) {}
    try {
      const localOrders: Order[] = JSON.parse(localStorage.getItem("erenn_customer_orders") || "[]");
      const updated = localOrders.filter((o) => o.id !== id);
      localStorage.setItem("erenn_customer_orders", JSON.stringify(updated));
    } catch (e) {}
    notifyCustomerCountChanged();
    toast({ title: "Order deleted" });
    fetchOrders();
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrderData.customer_name.trim()) {
      toast({ title: "Customer name is required", variant: "destructive" });
      return;
    }

    // Find highest order number, handling legacy 1000+ series (e.g. 1004 -> 4) so next is #5
    let maxNum = 4;
    orders.forEach((o) => {
      const str = String(o.order_number || o.id || "");
      const match = str.match(/\d+/);
      if (match) {
        let val = parseInt(match[0], 10);
        if (val >= 1000) val = val - 1000;
        if (val > maxNum) maxNum = val;
      }
    });

    const nextSerialNum = Math.max(maxNum + 1, orders.length + 1);
    const orderNumber = `#${nextSerialNum}`;

    const newOrder: Order = {
      id: `ord-man-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      order_number: orderNumber,
      customer_name: manualOrderData.customer_name.trim(),
      customer_email: manualOrderData.customer_email.trim() || "manual-entry@erenncodes.com",
      customer_phone: manualOrderData.customer_phone.trim() || null,
      payment_method: manualOrderData.payment_method || "GPay / UPI",
      payment_reference: manualOrderData.payment_reference.trim() || `MAN-${Date.now().toString().slice(-6)}`,
      amount: Number(manualOrderData.amount) || 0,
      currency: manualOrderData.currency || "INR",
      status: manualOrderData.status || "completed",
      notes: manualOrderData.notes.trim() || `Template: ${manualOrderData.product_title || "Custom Template"} • Manual Admin Order`,
      created_at: new Date().toISOString(),
      products: { title: manualOrderData.product_title || "Custom Template" },
    };

    // Save to localStorage
    try {
      const localOrders: Order[] = JSON.parse(localStorage.getItem("erenn_customer_orders") || "[]");
      localStorage.setItem("erenn_customer_orders", JSON.stringify([newOrder, ...localOrders]));
      notifyCustomerCountChanged();
    } catch (e) {}

    // Save to Supabase
    try {
      const { products: _, ...dbPayload } = newOrder;
      await supabase.from("orders").insert(dbPayload);
    } catch (e) {}

    toast({ title: `Order #${orderNumber} created successfully!` });
    setShowAddOrderModal(false);
    setManualOrderData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      product_title: products[0]?.title || "",
      amount: "124",
      currency: "INR",
      payment_method: "GPay / UPI",
      payment_reference: "",
      status: "completed",
      notes: "",
    });
    fetchOrders();
  };

  const markMessageRead = async (id: string) => {
    try {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    } catch (e) {}

    try {
      const localMsgs: ContactMessage[] = JSON.parse(localStorage.getItem("erenn_contact_messages") || "[]");
      const updated = localMsgs.map((m) => (m.id === id ? { ...m, is_read: true } : m));
      localStorage.setItem("erenn_contact_messages", JSON.stringify(updated));
    } catch (e) {}

    fetchMessages();
  };

  // Save Promo Banner Settings
  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    savePromoBannerConfig(promoSettings);
    toast({ title: "Promotional Banner settings saved!" });
  };

  // Save Social Media Settings
  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    saveSocialConfig(socialSettings);
    toast({ title: "Social media settings saved!" });
  };

  // Save Base Customer Count
  const handleSaveBaseCustomers = (e: React.FormEvent) => {
    e.preventDefault();
    setBaseCustomerCount(baseCustomers);
    toast({ title: "Customer count baseline updated and synced to website!" });
  };

  // Save Global Country Pricing Settings
  const handleSaveGlobalPricing = (e: React.FormEvent) => {
    e.preventDefault();
    saveGlobalPricingSettings(globalSettings);
    toast({ title: "Country Pricing policies updated successfully!" });
  };

  // Toggle Rule Status
  const handleToggleRule = (ruleId: string) => {
    const updated = pricingRules.map((r) =>
      r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r
    );
    setPricingRules(updated);
    savePricingRules(updated);
    toast({ title: "Pricing rule status toggled" });
  };

  // Save Edited Rule
  const handleSaveRuleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    const updated = pricingRules.map((r) => (r.id === editingRule.id ? editingRule : r));
    setPricingRules(updated);
    savePricingRules(updated);
    setEditingRule(null);
    toast({ title: `Updated rule for ${editingRule.countryName}` });
  };

  // Add New Regional Rule
  const handleAddNewRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleData.countryCode || !newRuleData.countryName || !newRuleData.currency) {
      toast({ title: "Country code, name, and currency are required", variant: "destructive" });
      return;
    }

    const code = newRuleData.countryCode.trim().toUpperCase();
    const newRule: PricingRule = {
      id: `rule-${code.toLowerCase()}-${Date.now()}`,
      countryCode: code,
      countryName: newRuleData.countryName.trim(),
      flag: newRuleData.flag || "🌍",
      currency: newRuleData.currency.trim().toUpperCase(),
      currencySymbol: newRuleData.currencySymbol || "$",
      minPrice: Number(newRuleData.minPrice) || 0,
      fixedRateFromINR: Number(newRuleData.fixedRateFromINR) || 0.045,
      isInternational: newRuleData.isInternational ?? true,
      isEnabled: true,
    };

    const updated = [...pricingRules, newRule];
    setPricingRules(updated);
    savePricingRules(updated);
    setShowAddRuleModal(false);
    setNewRuleData({
      countryCode: "",
      countryName: "",
      flag: "🌍",
      currency: "USD",
      currencySymbol: "$",
      minPrice: 5.0,
      fixedRateFromINR: 0.045,
      isInternational: true,
      isEnabled: true,
    });
    toast({ title: `Added regional pricing for ${newRule.countryName}` });
  };

  // Delete Rule
  const handleDeleteRule = (ruleId: string) => {
    if (!confirm("Are you sure you want to remove this pricing rule?")) return;
    const updated = pricingRules.filter((r) => r.id !== ruleId);
    setPricingRules(updated);
    savePricingRules(updated);
    toast({ title: "Pricing rule deleted" });
  };

  // Reset Pricing Rules to Default Presets
  const handleResetRules = () => {
    if (!confirm("Reset all country rules and minimum pricing to default settings?")) return;
    setPricingRules(defaultPricingRules);
    savePricingRules(defaultPricingRules);
    setGlobalSettings(defaultGlobalSettings);
    saveGlobalPricingSettings(defaultGlobalSettings);
    toast({ title: "Pricing rules reset to default presets" });
  };

  // Calculate live preview for simulator
  const simProduct = products.find((p) => p.id === simProductId) || products[0] || {
    id: "sample",
    title: "Sample Template",
    price: 124,
    category: "Ramadan",
    image_url: "",
    demo_url: "",
    is_active: true,
  };
  const simCalculated = calculateProductPrice(simProduct, simCountry);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Not Logged In: Render Dedicated Admin Login Card
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground text-sm">
              Sign in with your administrator credentials to manage products, orders, and site settings.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-muted-foreground">Admin Email</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" variant="red" disabled={isLoggingIn}>
              {isLoggingIn ? "Authenticating..." : "Sign In to Admin Panel"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-xs text-muted-foreground">
              ← Return to Public Website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not an authorized administrator
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-destructive/20 text-destructive rounded-xl flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display">Access Denied (403)</h2>
          <p className="text-muted-foreground text-sm">
            Signed in as <span className="font-semibold text-foreground">{user.email}</span>, but this account is not registered with administrator privileges.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => navigate("/")} className="flex-1">
              Go Home
            </Button>
            <Button variant="destructive" onClick={signOut} className="flex-1">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Validated Admin Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              👑
            </div>
            <div>
              <h1 className="font-display text-xl font-bold leading-none">Admin Panel</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button variant="destructive" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeTab === "products" ? "red" : "outline"}
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-4 h-4 mr-2" />
            Products ({products.length})
          </Button>
          <Button
            variant={activeTab === "pricing" ? "red" : "outline"}
            onClick={() => setActiveTab("pricing")}
          >
            <Globe className="w-4 h-4 mr-2 text-primary" />
            Country Pricing (🌍)
          </Button>
          <Button
            variant={activeTab === "orders" ? "red" : "outline"}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Orders ({orders.length})
          </Button>
          <Button
            variant={activeTab === "messages" ? "red" : "outline"}
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages ({messages.filter((m) => !m.is_read).length})
          </Button>
          <Button
            variant={activeTab === "settings" ? "red" : "outline"}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Promo & Settings
          </Button>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display text-xl font-semibold">Product Catalog</h2>
                <p className="text-xs text-muted-foreground">Manage templates, base prices (INR), YouTube video embeds, and regional overrides</p>
              </div>
              <Button variant="red" onClick={() => { handleCloseForm(); setShowProductForm(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Product Add / Edit Modal Form */}
            {showProductForm && (
              <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                  <h3 className="font-display font-semibold text-lg">
                    {editingProduct ? `Edit Product: ${editingProduct.title}` : "Add New Product"}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={handleCloseForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Product Title *</label>
                    <Input
                      placeholder="e.g. Birthday Celebration Template"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Domestic India Base Price (INR ₹) *</label>
                    <Input
                      placeholder="e.g. 124 or 0 for free"
                      type="number"
                      step="any"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">Base price for India (exempt from US$5 international minimum).</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <Input
                      placeholder="e.g. Birthday, Proposal, Ramadan, Holi"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Image Thumbnail URL</label>
                    <Input
                      placeholder="e.g. /images/happy-holi-thumbnail.png or https://..."
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Demo Live Preview URL</label>
                    <Input
                      placeholder="e.g. https://your-demo-link.netlify.app"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    />
                  </div>

                  {/* YouTube Video URL Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Youtube className="w-4 h-4 text-red-500" />
                      YouTube Video URL
                    </label>
                    <Input
                      placeholder="https://youtu.be/ID or https://www.youtube.com/watch?v=ID"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Paste any YouTube link (watch, youtu.be, shorts, embed).
                      {formData.youtube_url && extractYouTubeVideoId(formData.youtube_url) && (
                        <span className="text-green-500 font-medium ml-1">
                          ✓ Valid Video ID ({extractYouTubeVideoId(formData.youtube_url)})
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Description</label>
                    <Textarea
                      placeholder="Describe the template features, customization options, and highlights..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Regional & Country Price Overrides Accordion */}
                  <div className="md:col-span-2 border border-border/80 rounded-xl p-4 bg-secondary/20">
                    <button
                      type="button"
                      onClick={() => setShowOverridesInForm(!showOverridesInForm)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          Country & Regional Fixed Price Overrides (Optional)
                        </span>
                      </div>
                      {showOverridesInForm ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>

                    {showOverridesInForm && (
                      <div className="mt-4 pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in-0 duration-200">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇺🇸 United States (USD $)</label>
                          <Input
                            placeholder="e.g. 9.99 (min $5)"
                            type="number"
                            step="0.01"
                            value={formData.country_prices.US}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, US: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇬🇧 United Kingdom (GBP £)</label>
                          <Input
                            placeholder="e.g. 7.99"
                            type="number"
                            step="0.01"
                            value={formData.country_prices.GB}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, GB: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇪🇺 Europe (EUR €)</label>
                          <Input
                            placeholder="e.g. 8.99"
                            type="number"
                            step="0.01"
                            value={formData.country_prices.EU}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, EU: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇵🇰 Pakistan (PKR Rs.)</label>
                          <Input
                            placeholder="e.g. 750"
                            type="number"
                            step="10"
                            value={formData.country_prices.PK}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, PK: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇦🇪 UAE & Middle East (AED)</label>
                          <Input
                            placeholder="e.g. 29.00"
                            type="number"
                            step="0.01"
                            value={formData.country_prices.AE}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, AE: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇨🇦 Canada (CAD CA$)</label>
                          <Input
                            placeholder="e.g. 12.50"
                            type="number"
                            step="0.01"
                            value={formData.country_prices.CA}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, CA: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇨🇳 China (CNY ¥)</label>
                          <Input
                            placeholder="e.g. 10.99 (Same as India tier)"
                            type="number"
                            step="0.01"
                            value={formData.country_prices.CN}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, CN: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇧🇩 Bangladesh (BDT ৳)</label>
                          <Input
                            placeholder="e.g. 175 (Same as India tier)"
                            type="number"
                            step="1"
                            value={formData.country_prices.BD}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, BD: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">🇱🇰 Sri Lanka (LKR Rs.)</label>
                          <Input
                            placeholder="e.g. 440 (Same as India tier)"
                            type="number"
                            step="1"
                            value={formData.country_prices.LK}
                            onChange={(e) => setFormData({
                              ...formData,
                              country_prices: { ...formData.country_prices, LK: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={handleCloseForm}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="red" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Publish Product"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="grid gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-16 h-16 rounded-xl object-cover bg-muted border border-border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{product.title}</h3>
                        {product.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                            {product.category}
                          </span>
                        )}
                        {product.youtube_url && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium inline-flex items-center gap-1">
                            <Youtube className="w-3 h-3" /> Video linked
                          </span>
                        )}
                        {product.country_prices && Object.keys(product.country_prices).length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium inline-flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {Object.keys(product.country_prices).length} Regional Overrides
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap text-sm">
                        <span className="text-primary font-bold">
                          🇮🇳 {product.price === 0 ? "FREE" : `₹ ${product.price.toLocaleString()}`}
                        </span>
                        {product.price > 0 && (
                          <span className="text-xs text-muted-foreground">
                            • 🇺🇸 {calculateProductPrice(product, "US").formattedSale} (Intl)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {product.demo_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={product.demo_url} target="_blank" rel="noopener noreferrer" title="View Demo">
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {product.youtube_url && (
                      <Button variant="outline" size="sm" asChild className="text-red-500 hover:text-red-600">
                        <a href={product.youtube_url} target="_blank" rel="noopener noreferrer" title="Open YouTube Video">
                          <Youtube className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(product)} title="Edit Product">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)} title="Delete Product">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="text-center py-16 bg-card border border-border rounded-2xl">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No products found. Click "Add Product" to create your first template.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COUNTRY & REGIONAL PRICING TAB */}
        {activeTab === "pricing" && (
          <div className="space-y-8">
            {/* Top Bar / Global Policy Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Policies Card */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-display font-semibold text-lg">Country & Regional Pricing Policies</h3>
                      <p className="text-xs text-muted-foreground">Configure global international minimums and currency policies</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleResetRules} title="Reset to Presets">
                    <RotateCcw className="w-4 h-4 mr-1 text-muted-foreground" /> Reset Presets
                  </Button>
                </div>

                <form onSubmit={handleSaveGlobalPricing} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Enable Country-Based Dynamic Pricing
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={globalSettings.isCountryPricingEnabled ? "true" : "false"}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, isCountryPricingEnabled: e.target.value === "true" })}
                    >
                      <option value="true">Enabled (Detect Country & Apply Regional Rules)</option>
                      <option value="false">Disabled (Show Domestic INR Everywhere)</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">When enabled, visitors automatically see prices tailored to their location.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Minimum International Price (USD $) *
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      value={globalSettings.minInternationalPriceUSD}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, minInternationalPriceUSD: parseFloat(e.target.value) || 0 })}
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">Default is $5.00. Clamps international prices so templates are never underpriced overseas.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Default Fallback International Currency
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={globalSettings.defaultInternationalCurrency}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, defaultInternationalCurrency: e.target.value })}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Strict Geo-Lock (Domestic Regional Protection)
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                      value={globalSettings.strictGeoLockDomestic ? "true" : "false"}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, strictGeoLockDomestic: e.target.value === "true" })}
                    >
                      <option value="true">🔒 Option A: Strict Geo-Lock (Hide & Lock Domestic Rates for Intl Visitors)</option>
                      <option value="false">🔓 Option B: Allow Manual Switch to Domestic Rates</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      Prevents USA/Europe/Intl visitors from selecting India, China, Bangladesh, or Sri Lanka domestic rates to bypass the $5 minimum.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Lock Visitors to Auto-Detected Country
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                      value={globalSettings.lockVisitorToDetectedCountry ? "true" : "false"}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, lockVisitorToDetectedCountry: e.target.value === "true" })}
                    >
                      <option value="true">🔒 Enabled (Visitors are strictly locked to their detected location)</option>
                      <option value="false">🔓 Disabled (Allow visitors to manually change country)</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      When enabled, visitors cannot click the currency switcher to pick another country and bypass regional pricing.
                    </p>
                  </div>

                  <div className="sm:col-span-2 space-y-1 flex flex-col justify-end pt-2">
                    <Button type="submit" variant="red" className="w-full sm:w-auto self-end">
                      Save Global Policies
                    </Button>
                  </div>
                </form>

                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Regional Parity Exemption:</strong> India (`IN`), China (`CN`), Bangladesh (`BD`), Sri Lanka (`LK`), Nepal (`NP`), and Bhutan (`BT`) receive domestic base pricing without the US$5 international floor.
                  </span>
                </div>
              </div>

              {/* Live Geolocation Simulator */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                    <Sliders className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-display font-semibold text-base">Geo-Pricing Simulator</h3>
                      <p className="text-xs text-muted-foreground">Test how 170+ countries calculate prices in real-time</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Select Product to Test</label>
                      <select
                        className="w-full h-9 px-2 text-xs rounded-md border border-input bg-background"
                        value={simProductId}
                        onChange={(e) => setSimProductId(e.target.value)}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} (INR ₹{p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Simulate Country of Origin</label>
                      <select
                        className="w-full h-9 px-2 text-xs rounded-md border border-input bg-background"
                        value={simCountry}
                        onChange={(e) => setSimCountry(e.target.value)}
                      >
                        <optgroup label="Domestic & South Asia (Same as India Tier - No $5 Clamp)">
                          <option value="IN">🇮🇳 India (INR ₹)</option>
                          <option value="CN">🇨🇳 China (CNY ¥ - Same as India tier)</option>
                          <option value="BD">🇧🇩 Bangladesh (BDT ৳ - Same as India tier)</option>
                          <option value="LK">🇱🇰 Sri Lanka (LKR Rs. - Same as India tier)</option>
                          <option value="NP">🇳🇵 Nepal (NPR Rs. - Same as India tier)</option>
                          <option value="BT">🇧🇹 Bhutan (BTN Nu. - Same as India tier)</option>
                          <option value="PK">🇵🇰 Pakistan (PKR Rs.)</option>
                        </optgroup>
                        <optgroup label="Popular International Markets (Min $5 USD Floor)">
                          <option value="US">🇺🇸 United States (USD $)</option>
                          <option value="GB">🇬🇧 United Kingdom (GBP £)</option>
                          <option value="DE">🇩🇪 Germany (EUR €)</option>
                          <option value="FR">🇫🇷 France (EUR €)</option>
                          <option value="AE">🇦🇪 UAE / Dubai (AED)</option>
                          <option value="SA">🇸🇦 Saudi Arabia (SAR)</option>
                          <option value="CA">🇨🇦 Canada (CAD CA$)</option>
                          <option value="AU">🇦🇺 Australia (AUD A$)</option>
                          <option value="SG">🇸🇬 Singapore (SGD S$)</option>
                          <option value="MY">🇲🇾 Malaysia (MYR RM)</option>
                          <option value="DEFAULT_INTL">🌍 Rest of the World (USD $)</option>
                        </optgroup>
                        <optgroup label="All Other World Countries (170+ Supported)">
                          {pricingRules
                            .filter((r) => !["IN", "CN", "BD", "LK", "NP", "BT", "PK", "US", "GB", "DE", "FR", "AE", "SA", "CA", "AU", "SG", "MY", "DEFAULT_INTL"].includes(r.countryCode))
                            .map((r) => (
                              <option key={r.id} value={r.countryCode}>
                                {r.flag} {r.countryName} ({r.currencySymbol} {r.currency})
                              </option>
                            ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="mt-4 p-4 rounded-xl bg-secondary/40 border border-border">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                    <span>Customer Sees:</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <span>{simCalculated.countryName}</span>
                      {SAME_AS_INDIA_COUNTRIES.includes(simCalculated.countryCode) && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                          Same as India
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{simCalculated.formattedSale}</span>
                    {simCalculated.originalPrice > simCalculated.salePrice && (
                      <span className="text-xs line-through text-muted-foreground">
                        {simCalculated.formattedOriginal}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
                    <span>Currency: {simCalculated.currency}</span>
                    {simCalculated.minPriceEnforced ? (
                      <span className="text-primary font-medium">✓ Minimum $5 enforced</span>
                    ) : SAME_AS_INDIA_COUNTRIES.includes(simCalculated.countryCode) ? (
                      <span className="text-emerald-500 font-medium">✓ Domestic base rate</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Rules Table & Manager */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                    Configured Country & Regional Pricing Rules
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono">
                      {pricingRules.length} Countries
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Independent prices, minimum bounds, and currencies for each market worldwide
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Search countries (e.g. China, BD, US)..."
                      value={ruleSearch}
                      onChange={(e) => setRuleSearch(e.target.value)}
                      className="h-8 pl-8 text-xs w-full"
                    />
                  </div>
                  <Button variant="red" size="sm" onClick={() => setShowAddRuleModal(true)}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Rule
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="py-3 px-2">Region / Country</th>
                      <th className="py-3 px-2">ISO Code</th>
                      <th className="py-3 px-2">Currency</th>
                      <th className="py-3 px-2">Min Price</th>
                      <th className="py-3 px-2">Rate Multiplier</th>
                      <th className="py-3 px-2">Market Type</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredPricingRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2 font-medium flex items-center gap-2">
                          <span className="text-xl">{rule.flag}</span>
                          <span>{rule.countryName}</span>
                        </td>
                        <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{rule.countryCode}</td>
                        <td className="py-3 px-2 font-semibold">
                          {rule.currencySymbol} {rule.currency}
                        </td>
                        <td className="py-3 px-2">
                          {rule.minPrice > 0 ? `${rule.currencySymbol}${rule.minPrice}` : "None"}
                        </td>
                        <td className="py-3 px-2 font-mono text-xs">{rule.fixedRateFromINR}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              SAME_AS_INDIA_COUNTRIES.includes(rule.countryCode)
                                ? "bg-emerald-500/10 text-emerald-500"
                                : rule.isInternational
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {SAME_AS_INDIA_COUNTRIES.includes(rule.countryCode)
                              ? "Domestic / Same as India"
                              : rule.isInternational
                              ? "International (US$5 floor)"
                              : "Regional"}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <button
                            type="button"
                            onClick={() => handleToggleRule(rule.id)}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                              rule.isEnabled
                                ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {rule.isEnabled ? "Active" : "Disabled"}
                          </button>
                        </td>
                        <td className="py-3 px-2 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditingRule(rule)} title="Edit Rule">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {rule.countryCode !== "IN" && rule.countryCode !== "DEFAULT_INTL" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteRule(rule.id)}
                              title="Delete Rule"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SQL Migration Reference */}
            <div className="bg-secondary/30 border border-border rounded-2xl p-6">
              <h4 className="font-semibold text-sm mb-1 text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Database Persistence Migration
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rules and overrides are persistently stored in the browser and ready for database sync. To persist custom country rules directly in PostgreSQL on your Supabase instance, run the migration in <code className="text-primary font-mono">supabase/country_pricing_setup.sql</code>.
              </p>
            </div>

            {/* Edit Rule Dialog */}
            {editingRule && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <div className="max-w-md w-full bg-card border border-border p-6 rounded-2xl shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                      <span>{editingRule.flag}</span> Edit Pricing Rule for {editingRule.countryName}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setEditingRule(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleSaveRuleEdit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Display Currency</label>
                      <Input
                        value={editingRule.currency}
                        onChange={(e) => setEditingRule({ ...editingRule, currency: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Currency Symbol</label>
                      <Input
                        value={editingRule.currencySymbol}
                        onChange={(e) => setEditingRule({ ...editingRule, currencySymbol: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Minimum Allowed Price</label>
                      <Input
                        type="number"
                        step="any"
                        value={editingRule.minPrice}
                        onChange={(e) => setEditingRule({ ...editingRule, minPrice: parseFloat(e.target.value) || 0 })}
                        required
                      />
                      <p className="text-[11px] text-muted-foreground">Ensures templates are not sold below this value in this region.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">INR Rate Multiplier</label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={editingRule.fixedRateFromINR}
                        onChange={(e) => setEditingRule({ ...editingRule, fixedRateFromINR: parseFloat(e.target.value) || 1 })}
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-border">
                      <Button type="button" variant="outline" onClick={() => setEditingRule(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="red">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Rule Dialog */}
            {showAddRuleModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <div className="max-w-md w-full bg-card border border-border p-6 rounded-2xl shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" /> Add New Country / Regional Pricing
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddRuleModal(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleAddNewRule} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Country Code (ISO 2-letter) *</label>
                        <Input
                          placeholder="e.g. BD, NP, SG"
                          maxLength={10}
                          value={newRuleData.countryCode}
                          onChange={(e) => setNewRuleData({ ...newRuleData, countryCode: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Flag Emoji</label>
                        <Input
                          placeholder="e.g. 🇧🇩 or 🌍"
                          value={newRuleData.flag}
                          onChange={(e) => setNewRuleData({ ...newRuleData, flag: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Region / Country Name *</label>
                      <Input
                        placeholder="e.g. Bangladesh or South Asia"
                        value={newRuleData.countryName}
                        onChange={(e) => setNewRuleData({ ...newRuleData, countryName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Currency Code *</label>
                        <Input
                          placeholder="BDT"
                          value={newRuleData.currency}
                          onChange={(e) => setNewRuleData({ ...newRuleData, currency: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Symbol</label>
                        <Input
                          placeholder="৳"
                          value={newRuleData.currencySymbol}
                          onChange={(e) => setNewRuleData({ ...newRuleData, currencySymbol: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Min Price</label>
                        <Input
                          type="number"
                          step="any"
                          value={newRuleData.minPrice}
                          onChange={(e) => setNewRuleData({ ...newRuleData, minPrice: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Rate Multiplier</label>
                        <Input
                          type="number"
                          step="0.001"
                          value={newRuleData.fixedRateFromINR}
                          onChange={(e) => setNewRuleData({ ...newRuleData, fixedRateFromINR: parseFloat(e.target.value) || 0.045 })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-border">
                      <Button type="button" variant="outline" onClick={() => setShowAddRuleModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="red">
                        Create Rule
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Promotional Banner Configuration */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-display font-semibold text-lg">Promotional Banner Settings</h3>
                  <p className="text-xs text-muted-foreground">Controls homepage & catalog promotional offers</p>
                </div>
              </div>

              <form onSubmit={handleSavePromo} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Starting Price (INR ₹)</label>
                  <Input
                    type="number"
                    value={promoSettings.startingPrice}
                    onChange={(e) => setPromoSettings({ ...promoSettings, startingPrice: Number(e.target.value) })}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Current lowest template price is ₹124.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Discount Percentage (%)</label>
                  <Input
                    type="number"
                    value={promoSettings.discountPercent}
                    onChange={(e) => setPromoSettings({ ...promoSettings, discountPercent: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Hero Badge Text</label>
                  <Input
                    value={promoSettings.badgeText}
                    onChange={(e) => setPromoSettings({ ...promoSettings, badgeText: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Banner Headline</label>
                  <Input
                    value={promoSettings.headline}
                    onChange={(e) => setPromoSettings({ ...promoSettings, headline: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" variant="red" className="w-full">
                  Save Promotional Settings
                </Button>
              </form>
            </div>

            {/* Social Media Links Configuration */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Share2 className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-display font-semibold text-lg">Social Media Links</h3>
                  <p className="text-xs text-muted-foreground">Controls links in the 5-button floating dock and footer</p>
                </div>
              </div>

              <form onSubmit={handleSaveSocials} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Instagram Profile URL</label>
                  <Input
                    value={socialSettings.instagram || ""}
                    onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">YouTube Channel URL</label>
                  <Input
                    value={socialSettings.youtube || ""}
                    onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                    placeholder="https://youtube.com/@..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Facebook Page URL</label>
                  <Input
                    value={socialSettings.facebook || ""}
                    onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Pinterest Profile URL</label>
                  <Input
                    value={socialSettings.pinterest || ""}
                    onChange={(e) => setSocialSettings({ ...socialSettings, pinterest: e.target.value })}
                    placeholder="https://pinterest.com/..."
                  />
                </div>

                <Button type="submit" variant="red" className="w-full mt-4">
                  Save Social Links
                </Button>
              </form>
            </div>

            {/* Live Customer Counter & Social Proof */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-display font-semibold text-lg">Live Client & Customer Count Synchronization</h3>
                    <p className="text-xs text-muted-foreground">
                      Controls the top banner ("Trusted by X happy customers worldwide") and homepage trust badges in real time
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary">
                  Live on Website: {liveCustomerCount} Customers
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary/40 border border-border rounded-xl p-4">
                  <span className="text-xs text-muted-foreground block mb-1">Base Baseline Offset</span>
                  <span className="text-2xl font-bold font-display text-foreground">{baseCustomers}</span>
                  <p className="text-[11px] text-muted-foreground mt-1">Manual base added to orders (default 0)</p>
                </div>
                <div className="bg-secondary/40 border border-border rounded-xl p-4">
                  <span className="text-xs text-muted-foreground block mb-1">Approved Completed Orders</span>
                  <span className="text-2xl font-bold font-display text-emerald-500">
                    +{orders.filter((o) => o.status === "completed" || o.status === "success").length}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-1">Live approved customer orders</p>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                  <span className="text-xs text-primary font-medium block mb-1">Total Displayed to Clients</span>
                  <span className="text-2xl font-bold font-display text-primary">{liveCustomerCount}</span>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {baseCustomers} base + {orders.filter((o) => o.status === "completed" || o.status === "success").length} orders = {liveCustomerCount} total
                  </p>
                </div>
              </div>

              {/* Website Preview */}
              <div className="border border-border/70 rounded-xl p-3 bg-secondary/20">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Live Top Bar Preview
                </span>
                <div className="bg-secondary/80 border border-border py-2 px-4 rounded-lg text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-amber-400">★★★★★</span>
                  <span className="font-semibold text-foreground">4.9/5</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="text-muted-foreground">
                    Trusted by <strong className="text-primary font-bold">{liveCustomerCount}</strong> happy customers worldwide
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveBaseCustomers} className="flex items-end gap-3 pt-2">
                <div className="space-y-1 flex-1 max-w-xs">
                  <label className="text-xs font-medium text-muted-foreground">Edit Base Baseline Offset</label>
                  <Input
                    type="number"
                    min="0"
                    value={baseCustomers}
                    onChange={(e) => setBaseCustomers(Number(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Set to 0 if your orders list already contains all your live clients.</p>
                </div>
                <Button type="submit" variant="red">
                  Update Baseline
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border pb-4">
              <div>
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  Customer Orders
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono">
                    {orders.length} Total
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  {orders.filter((o) => o.status === "pending").length} pending orders requiring review
                </p>
              </div>

              <Button variant="red" size="sm" onClick={() => setShowAddOrderModal(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Add Order Manually
              </Button>
            </div>

            {orders.map((order, idx) => {
              const serialNo = order.order_number || `ORD-${1000 + (orders.length - idx)}`;
              return (
                <div key={order.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-4 gap-2 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/25">
                        #{serialNo}
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground">{order.customer_name}</h3>
                        <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                        {order.customer_phone && <p className="text-xs text-muted-foreground">{order.customer_phone}</p>}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-500/20 text-green-500"
                          : order.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="text-sm space-y-1">
                      <p><strong>Serial Number:</strong> #{serialNo}</p>
                      <p><strong>Product:</strong> {order.products?.title || order.notes?.split(" • ")[0]?.replace("Template: ", "") || "Website Template"}</p>
                      <p><strong>Amount:</strong> {(order as any).currency || "₹"} {order.amount.toLocaleString()}</p>
                      <p><strong>Payment:</strong> {order.payment_method}</p>
                      {order.payment_reference && <p><strong>Reference:</strong> {order.payment_reference}</p>}
                      <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                      {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                    </div>

                    {/* Payment Screenshot Preview */}
                    {(signedUrls[order.id] || order.payment_screenshot_url) && (
                      <div className="flex flex-col items-start">
                        <p className="text-sm font-medium mb-2">Payment Screenshot:</p>
                        <a
                          href={signedUrls[order.id] || order.payment_screenshot_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative"
                        >
                          <img
                            src={signedUrls[order.id] || order.payment_screenshot_url || ""}
                            alt="Payment screenshot"
                            className="w-32 h-32 object-cover rounded-lg border border-border hover:border-primary transition-colors"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-border flex-wrap">
                    <div className="flex items-center gap-2">
                      {order.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm" className="text-green-500 hover:text-green-600 hover:border-green-500/50" onClick={() => updateOrderStatus(order.id, "completed")}>
                            <Check className="w-4 h-4 mr-1" /> Approve (+1 Live Client)
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:border-red-500/50" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {order.status === "completed" && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-500 flex items-center font-medium">
                            <Check className="w-4 h-4 mr-1" /> Approved (Syncs to Live Clients)
                          </span>
                          <Button variant="ghost" size="sm" className="h-6 text-[11px] text-muted-foreground hover:text-foreground" onClick={() => updateOrderStatus(order.id, "pending")}>
                            Revert to Pending
                          </Button>
                        </div>
                      )}
                      {order.status === "cancelled" && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-500 flex items-center font-medium">
                            <X className="w-4 h-4 mr-1" /> Rejected
                          </span>
                          <Button variant="outline" size="sm" className="h-6 text-[11px] text-green-500 hover:text-green-600" onClick={() => updateOrderStatus(order.id, "completed")}>
                            <Check className="w-3.5 h-3.5 mr-1" /> Re-Approve
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteOrder(order.id)}
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <ShoppingCart className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm">No orders yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Orders placed on WhatsApp or added manually will appear here.</p>
              </div>
            )}

            {/* Add Manual Order Modal */}
            {showAddOrderModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <div className="max-w-lg w-full bg-card border border-border p-6 rounded-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" /> Record Manual Order
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddOrderModal(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleCreateManualOrder} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Customer Name *</label>
                        <Input
                          placeholder="e.g. John Doe"
                          value={manualOrderData.customer_name}
                          onChange={(e) => setManualOrderData({ ...manualOrderData, customer_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Customer Email</label>
                        <Input
                          placeholder="john@example.com"
                          value={manualOrderData.customer_email}
                          onChange={(e) => setManualOrderData({ ...manualOrderData, customer_email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Phone / WhatsApp</label>
                        <Input
                          placeholder="+91 9876543210"
                          value={manualOrderData.customer_phone}
                          onChange={(e) => setManualOrderData({ ...manualOrderData, customer_phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Select Template / Product</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={manualOrderData.product_title}
                          onChange={(e) => {
                            const p = products.find((prod) => prod.title === e.target.value);
                            setManualOrderData({
                              ...manualOrderData,
                              product_title: e.target.value,
                              amount: p ? String(p.price) : manualOrderData.amount,
                            });
                          }}
                        >
                          <option value="">-- Choose or enter custom title below --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.title}>
                              {p.title} (₹{p.price})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Order Amount *</label>
                        <Input
                          type="number"
                          step="any"
                          value={manualOrderData.amount}
                          onChange={(e) => setManualOrderData({ ...manualOrderData, amount: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Currency</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={manualOrderData.currency}
                          onChange={(e) => setManualOrderData({ ...manualOrderData, currency: e.target.value })}
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="PKR">PKR (Rs.)</option>
                          <option value="BDT">BDT (৳)</option>
                          <option value="LKR">LKR (Rs.)</option>
                          <option value="CNY">CNY (¥)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="AED">AED</option>
                          <option value="SAR">SAR</option>
                          <option value="CAD">CAD (CA$)</option>
                          <option value="AUD">AUD (A$)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Initial Status</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={manualOrderData.status}
                          onChange={(e) => setManualOrderData({ ...manualOrderData, status: e.target.value })}
                        >
                          <option value="completed">Completed / Paid</option>
                          <option value="pending">Pending Payment</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Payment Method</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={manualOrderData.payment_method}
                          onChange={(e) => setManualOrderData({ ...manualOrderData, payment_method: e.target.value })}
                        >
                          <option value="GPay / UPI">GPay / UPI</option>
                          <option value="PhonePe">PhonePe</option>
                          <option value="Paytm">Paytm</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="EasyPaisa">EasyPaisa</option>
                          <option value="JazzCash">JazzCash</option>
                          <option value="Binance Crypto">Binance Crypto</option>
                          <option value="WhatsApp Direct">WhatsApp Direct</option>
                          <option value="Cash">Cash / In-person</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Transaction ID / Reference</label>
                        <Input
                          placeholder="e.g. UPI-9876543210"
                          value={manualOrderData.payment_reference}
                          onChange={(e) => setManualOrderData({ ...manualOrderData, payment_reference: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Custom Notes / Order Details</label>
                      <Textarea
                        placeholder="e.g. Birthday template with custom music and 4 images requested via WhatsApp..."
                        rows={2}
                        value={manualOrderData.notes}
                        onChange={(e) => setManualOrderData({ ...manualOrderData, notes: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-border">
                      <Button type="button" variant="outline" onClick={() => setShowAddOrderModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="red">
                        Save Order
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-card border rounded-xl p-4 ${msg.is_read ? "border-border" : "border-primary"}`}
                onClick={() => markMessageRead(msg.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{msg.name}</h3>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                {msg.subject && <p className="font-medium mb-2">{msg.subject}</p>}
                <p className="text-sm text-muted-foreground">{msg.message}</p>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No messages yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;