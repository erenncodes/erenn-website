import { useState } from "react";
import { X, MessageCircle, Sparkles, Package, ChevronRight, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/data/siteConfig";
import { useCurrency } from "@/hooks/useCurrency";
import { supabase } from "@/integrations/supabase/client";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  productTitle: string;
  product?: any;
}

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "images";
  enabled: boolean;
  value: string;
}

const OrderModal = ({ open, onClose, productTitle, product }: OrderModalProps) => {
  const { currentRule, formatProduct } = useCurrency();
  const pricing = product ? formatProduct(product) : null;
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [imageCount, setImageCount] = useState(3);

  const [fields, setFields] = useState<FormField[]>([
    { key: "yourName", label: "Your Name", placeholder: "Enter your name", type: "text", enabled: true, value: "" },
    { key: "partnerName", label: "Partner's Name", placeholder: "Enter partner's name", type: "text", enabled: true, value: "" },
    { key: "song", label: "Song for Background", placeholder: "Song name or YouTube link", type: "text", enabled: true, value: "" },
    { key: "images", label: "Images", placeholder: "", type: "images", enabled: true, value: "" },
    { key: "letter", label: "Letter / Message", placeholder: "Write your heartfelt message here...", type: "textarea", enabled: true, value: "" },
    { key: "colorTheme", label: "Colour Theme", placeholder: "e.g. Pink & Gold, Dark theme, Pastel blue...", type: "text", enabled: true, value: "" },
    { key: "specialRequest", label: "Special Request", placeholder: "Any other requests or ideas...", type: "textarea", enabled: true, value: "" },
  ]);

  const toggleField = (key: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  const updateFieldValue = (key: string, value: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, value } : f));
  };

  const buildWhatsAppMessage = (orderNumber?: string) => {
    const enabledFields = fields.filter(f => f.enabled);
    let message = `🛒 *Custom Order Request*`;
    if (orderNumber) {
      const cleanNum = orderNumber.replace(/^#+/, "");
      message += ` (#${cleanNum})`;
    }
    message += `\n📦 *Template:* ${productTitle}\n`;
    if (currentRule) {
      message += `📍 *Region:* ${currentRule.flag} ${currentRule.countryName}\n`;
    }
    message += `\n`;

    enabledFields.forEach(f => {
      if (f.key === "images") {
        message += `📸 *${f.label}:* ${imageCount} image(s) — I'll send them here\n`;
      } else if (f.value.trim()) {
        const emoji = f.key === "yourName" ? "👤" : f.key === "partnerName" ? "💕" : f.key === "song" ? "🎵" : f.key === "letter" ? "💌" : f.key === "colorTheme" ? "🎨" : "✨";
        message += `${emoji} *${f.label}:* ${f.value.trim()}\n`;
      }
    });

    const disabledFields = fields.filter(f => !f.enabled);
    if (disabledFields.length > 0) {
      message += `\n❌ *Not needed:* ${disabledFields.map(f => f.label).join(", ")}`;
    }

    return message;
  };

  const createOrderRecord = async (customMessage: string) => {
    const customerName = fields.find((f) => f.key === "yourName")?.value.trim() || "WhatsApp Customer";
    const partnerName = fields.find((f) => f.key === "partnerName")?.value.trim();
    const song = fields.find((f) => f.key === "song")?.value.trim();
    const letter = fields.find((f) => f.key === "letter")?.value.trim();

    const existing: any[] = JSON.parse(localStorage.getItem("erenn_customer_orders") || "[]");
    
    // Find highest order number, handling legacy 1000+ series (e.g. 1004 -> 4) so next is #5
    let maxNum = 4;
    existing.forEach((o) => {
      const str = String(o.order_number || o.id || "");
      const match = str.match(/\d+/);
      if (match) {
        let val = parseInt(match[0], 10);
        if (val >= 1000) val = val - 1000;
        if (val > maxNum) maxNum = val;
      }
    });

    const nextNum = Math.max(maxNum + 1, existing.length + 1);
    const orderNumber = `#${nextNum}`;

    const orderData = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      order_number: orderNumber,
      product_id: product?.id && typeof product.id === "string" && product.id.length > 20 ? product.id : null,
      customer_name: customerName,
      customer_email: "whatsapp-order@erenncodes.com",
      customer_phone: null,
      payment_method: "WhatsApp Order",
      payment_reference: `WA-${Date.now().toString().slice(-6)}`,
      amount: pricing?.salePrice || product?.price || 0,
      currency: pricing?.currency || "INR",
      status: "pending",
      notes: [
        `Template: ${productTitle}`,
        `Region: ${currentRule.flag} ${currentRule.countryName} (${currentRule.currency})`,
        partnerName ? `Partner: ${partnerName}` : "",
        song ? `Song: ${song}` : "",
        letter ? `Message: ${letter.slice(0, 50)}...` : "",
        `Images: ${imageCount}`,
      ].filter(Boolean).join(" • "),
      created_at: new Date().toISOString(),
      products: { title: productTitle },
    };

    // 1. Save to localStorage for instant Admin Panel visibility
    try {
      localStorage.setItem("erenn_customer_orders", JSON.stringify([orderData, ...existing]));
      window.dispatchEvent(new Event("erenn_orders_updated"));
    } catch (e) {}

    // 2. Save to Supabase database
    try {
      const { products: _, ...dbPayload } = orderData;
      await supabase.from("orders").insert(dbPayload);
    } catch (e) {}

    return orderNumber;
  };

  const handleCustomOrder = async () => {
    const orderNumber = await createOrderRecord("");
    const message = buildWhatsAppMessage(orderNumber);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/91${siteConfig.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleDirectChat = () => {
    const message = encodeURIComponent(`Hi! I'm interested in "${productTitle}" but I have some questions before ordering. Can you help me out?`);
    const url = `https://wa.me/91${siteConfig.whatsappNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  const handleNoCustomization = async () => {
    const orderNumber = await createOrderRecord("");
    const message = `Hi! I want to order "${productTitle}" (Order #${orderNumber}) — No customization needed (as shown in preview).`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/91${siteConfig.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleClose = () => {
    setStep("choose");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  {step === "choose" ? "Order Now" : "Customization Details"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[250px]">{productTitle}</p>
                {pricing && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <span className="font-bold text-primary">{pricing.formattedSale}</span>
                    <span className="text-muted-foreground font-normal">({currentRule.flag} {currentRule.countryName})</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {step === "choose" ? (
                <motion.div
                  key="choose"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-5 space-y-3"
                >
                 <p className="text-sm text-muted-foreground mb-4">How would you like your website?</p>

                  {/* No Customization */}
                  <button
                    onClick={handleNoCustomization}
                    className="w-full group bg-muted/30 hover:bg-muted/50 border border-border hover:border-primary/30 rounded-xl p-5 text-left transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                          As Shown in Preview
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Get the exact website as displayed — same design, colors, images, music & layout. No changes needed.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* With Customization */}
                  <button
                    onClick={() => setStep("form")}
                    className="w-full group bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-xl p-5 text-left transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                          Personalize It for Me
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Make it yours — custom names, photos, music, colors & messages. Additional charges may apply.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Confused / Direct Chat */}
                  <button
                    onClick={handleDirectChat}
                    className="w-full group hover:bg-muted/30 rounded-xl p-4 text-center transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Not sure? Let's discuss on WhatsApp
                      </span>
                    </div>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-5 space-y-4"
                >
                  {/* Back button */}
                  <button
                    onClick={() => setStep("choose")}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    ← Back
                  </button>

                  <p className="text-xs text-muted-foreground">
                    Toggle off (✕) any field you don't need. Fill in the rest and we'll handle everything!
                  </p>

                  {/* Form Fields */}
                  <div className="space-y-3">
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        className={`rounded-xl border transition-all ${
                          field.enabled
                            ? "border-border bg-card"
                            : "border-border/50 bg-muted/20 opacity-60"
                        }`}
                      >
                        {/* Field Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
                          <span className={`text-sm font-medium ${field.enabled ? "text-foreground" : "text-muted-foreground line-through"}`}>
                            {field.label}
                          </span>
                          <button
                            onClick={() => toggleField(field.key)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-xs font-bold ${
                              field.enabled
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            }`}
                          >
                            {field.enabled ? "✓" : "✕"}
                          </button>
                        </div>

                        {/* Field Input */}
                        {field.enabled && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 py-3"
                          >
                            {field.type === "text" && (
                              <Input
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={(e) => updateFieldValue(field.key, e.target.value)}
                                className="bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
                              />
                            )}
                            {field.type === "textarea" && (
                              <Textarea
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={(e) => updateFieldValue(field.key, e.target.value)}
                                rows={3}
                                className="bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/30 resize-none"
                              />
                            )}
                            {field.type === "images" && (
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  How many images do you want to add? (max 8)
                                </p>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => setImageCount(Math.max(1, imageCount - 1))}
                                    className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-lg font-bold text-foreground w-8 text-center">{imageCount}</span>
                                  <button
                                    onClick={() => setImageCount(Math.min(8, imageCount + 1))}
                                    className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <span className="text-xs text-muted-foreground">image(s)</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                  📸 You'll send the actual images on WhatsApp after placing the order.
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <Button
                    size="lg"
                    className="w-full py-6 text-base font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg"
                    onClick={handleCustomOrder}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Order Now via WhatsApp
                  </Button>

                  <p className="text-[11px] text-center text-muted-foreground">
                    This will open WhatsApp with your order details pre-filled.
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <button
                    onClick={handleDirectChat}
                    className="w-full group hover:bg-muted/30 rounded-xl p-3 text-center transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MessageCircle className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        Need help deciding? Chat with us directly
                      </span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderModal;
