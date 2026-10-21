import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Globe, Check, Clock, Sparkles, Heart, Zap, Shield, MessageCircle, Star, Eye, Package, Instagram, ChevronDown, ChevronUp } from "lucide-react";
import OrderModal from "@/components/OrderModal";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import CountdownTimer from "@/components/CountdownTimer";
import ProductSchema from "@/components/seo/ProductSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import RelatedProducts from "@/components/RelatedProducts";
import PriceDisplay from "@/components/PriceDisplay";
import PaymentInfo from "@/components/PaymentInfo";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig, formatPriceWithDiscount, discountConfig, getSalePrice, getOriginalPrice } from "@/data/siteConfig";
import { getProductYouTubeLink, extractYouTubeVideoId } from "@/lib/productThumbnails";
import ProductMediaCarousel from "@/components/ProductMediaCarousel";
import { useCurrency } from "@/hooks/useCurrency";
import { fetchUnifiedProductById, Product } from "@/lib/productService";
import { useLiveCustomerCount } from "@/lib/customerStats";

const ProductDetail = () => {
  const { id } = useParams();
  const { count } = useLiveCustomerCount();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "order">("overview");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(true);
  const { currency } = useCurrency();
  const salePrice = getSalePrice(currency);
  const originalPrice = getOriginalPrice(currency);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    try {
      const data = await fetchUnifiedProductById(id);
      setProduct(data);
    } catch (e) {
      console.error("Error fetching product:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
        <p className="text-muted-foreground">This product may have been removed or doesn't exist.</p>
        <Button asChild>
          <Link to="/products">Browse All Templates</Link>
        </Button>
      </div>
    );
  }

  const whatsappOrder = siteConfig.whatsappNumber
    ? `https://wa.me/91${siteConfig.whatsappNumber}?text=Hi! I want to order "${product.title}"`
    : "#";
  const whatsappCustom = siteConfig.whatsappNumber
    ? `https://wa.me/91${siteConfig.whatsappNumber}?text=Hi! I want a custom order for "${product.title}"`
    : "#";

  const features = [
    { icon: Sparkles, label: "Smooth Animations", color: "text-purple-400" },
    { icon: Heart, label: "Personalized Content", color: "text-pink-400" },
    { icon: Shield, label: "Fully Responsive", color: "text-blue-400" },
    ...(product.category?.toLowerCase() !== "holi"
      ? [{ icon: Zap, label: "Background Music", color: "text-amber-400" }]
      : []),
  ];

  const deliverables = [
    "Personalized live website link",
    "Custom text & messages",
    "Mobile-friendly design",
    "Free hosting included",
    "24-hour delivery",
    "Post-purchase support",
  ];

  const isFree = product.price === 0;

  return (
    <div className="min-h-screen bg-background">
      <ProductSchema product={product} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Products", url: "/products" },
        { name: product.title, url: `/products/${product.id}` },
      ]} />
      <Navbar />

      {/* Breadcrumb Bar */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> All Templates
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 lg:py-14">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left Column - Media */}
            <div className="lg:col-span-7 space-y-6">
              {/* Media Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductMediaCarousel
                  imageUrl={product.image_url || '/images/default-thumbnail.png'}
                  youtubeUrl={product.youtube_url || getProductYouTubeLink(product.title, product.category)}
                  title={product.title}
                />
              </motion.div>

              {/* Tab Navigation */}
              <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
                {(["overview", "details", "order"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all capitalize ${
                      activeTab === tab
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "order" && !isFree ? "How to Order" : tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Description */}
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <h2 className="font-display text-lg font-bold text-foreground mb-3">About This Template</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
                      </div>

                      {/* Before you order — quick heads up */}
                      <div className="bg-card border border-blue-500/30 bg-blue-500/5 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                          <Shield className="w-5 h-5 text-blue-400" />
                          Before you order — quick heads up
                        </div>
                        <div className="p-3.5 bg-background/80 border border-blue-500/20 rounded-xl text-xs text-muted-foreground leading-relaxed">
                          <span className="font-semibold text-foreground">Customizations are added to the displayed default price.</span> The final add-on depends on the scope of work, and we'll confirm it before starting.
                        </div>
                        <ul className="space-y-2.5 text-xs text-muted-foreground">
                          <li className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-sm leading-none mt-0.5">•</span>
                            <span>The demo shows the standard template included in the displayed price.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-sm leading-none mt-0.5">•</span>
                            <span>Your live URL is delivered after details and payment are confirmed.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-sm leading-none mt-0.5">•</span>
                            <span>Send names, photos, messages, dates, colors, and other requests together before work begins.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-sm leading-none mt-0.5">•</span>
                            <span>Hosting is handled for you — no coding or setup needed.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {features.map((feat) => (
                          <motion.div
                            key={feat.label}
                            whileHover={{ y: -2 }}
                            className="bg-card border border-border rounded-xl p-4 text-center"
                          >
                            <feat.icon className={`w-6 h-6 ${feat.color} mx-auto mb-2`} />
                            <span className="text-xs font-medium text-foreground">{feat.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "details" && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                      <h2 className="font-display text-lg font-bold text-foreground">What's Included</h2>
                      <div className="grid gap-3">
                        {deliverables.map((item, i) => (
                          <div key={item} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>

                      {product.price > 0 && (
                        <>
                          <div className="border-t border-border pt-5">
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-primary" />
                              Important Notes
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                Default price = website as-shown (no changes)
                              </li>
                              <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                Customization available at extra cost
                              </li>
                              <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                No changes after deployment
                              </li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === "order" && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                      {isFree ? (
                        <div className="text-center py-6">
                          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Globe className="w-8 h-8 text-primary" />
                          </div>
                          <h2 className="font-display text-xl font-bold text-foreground mb-2">It's Free!</h2>
                          <p className="text-muted-foreground text-sm mb-4">
                            No payment needed. Get your website instantly.
                          </p>
                          {product.demo_url && (
                            <Button size="lg" asChild>
                              <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                                Get Free Website
                              </a>
                            </Button>
                          )}
                        </div>
                      ) : (
                        <>
                          <h2 className="font-display text-lg font-bold text-foreground">How to Order</h2>
                          <div className="space-y-4">
                            {[
                              { step: "1", text: "Choose your payment method below" },
                              { step: "2", text: "Send payment & take a screenshot" },
                              { step: "3", text: "Message us on WhatsApp with the screenshot" },
                              { step: "4", text: "Receive your live website within 24 hours!" },
                            ].map((s) => (
                              <div key={s.step} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                                  {s.step}
                                </div>
                                <p className="text-sm text-foreground pt-1.5">{s.text}</p>
                              </div>
                            ))}
                          </div>
                          <PaymentInfo />
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24 space-y-5">
                {/* Product Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  {/* Category Badge */}
                  <div className="px-6 pt-6 pb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                      <Eye className="w-3 h-3" />
                      {product.category}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="px-6 pb-4">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                      {product.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        5.0 ({
                          product.title?.toLowerCase().includes("supportive") || product.title?.toLowerCase().includes("sorry")
                            ? "1"
                            : product.title?.toLowerCase().includes("girlfriend") || product.title?.toLowerCase().includes("boyfriend") || product.title?.toLowerCase().includes("anniversary") || product.title?.toLowerCase().includes("bestie")
                            ? "12"
                            : "6"
                        })
                      </span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="px-6 py-4 bg-muted/30 border-y border-border">
                    {isFree ? (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">FREE</span>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                          🎉 No Cost
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                          <PriceDisplay
                            priceInPKR={product.price}
                            size="lg"
                            showOriginal={true}
                            regionPrices={{
                              PKR: (product as any).price_pkr,
                              INR: (product as any).price_inr,
                              GBP: (product as any).price_gbp,
                              USD: (product as any).price_usd,
                              ...((product as any).country_prices || {}),
                            }}
                            showMinBadge={true}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-bold rounded-full">
                            🔥 {discountConfig.discountPercent}% OFF
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> Limited offer
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA & Delivery Benefits */}
                  <div className="p-6 space-y-4">
                    {/* Delivery & Trust Banner */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Few hours delivery · {count > 10 ? `${count}+` : count} happy customers</span>
                    </div>

                    {/* Features Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Your personalized live website link</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Custom text & love messages</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Mobile-friendly responsive design</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Free hosting included</span>
                      </div>
                    </div>

                    {isFree && product.demo_url ? (
                      <Button
                        size="lg"
                        className="w-full py-6 text-base font-bold"
                        asChild
                      >
                        <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-5 h-5 mr-2" />
                          Get Free Website
                        </a>
                      </Button>
                    ) : (
                      <div className="space-y-2.5 pt-2">
                        {/* Primary WhatsApp Order Button */}
                        <Button
                          size="lg"
                          className="w-full py-6 text-base font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg shadow-emerald-500/20 transition-all"
                          onClick={() => setOrderModalOpen(true)}
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Order Now — {discountConfig.discountPercent}% OFF
                        </Button>

                        {/* Order on Instagram Button */}
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full py-5 text-sm font-semibold border-pink-500/30 hover:border-pink-500 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 text-foreground transition-all"
                          asChild
                        >
                          <a
                            href={siteConfig.socials.instagram || "https://instagram.com/erenncodes"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Instagram className="w-4 h-4 mr-2 text-pink-400" />
                            Order on Instagram
                          </a>
                        </Button>
                      </div>
                    )}

                    {/* Collapsible Payment Methods */}
                    <div className="pt-2 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => setShowPaymentMethods(!showPaymentMethods)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground py-1 cursor-pointer"
                      >
                        <span>Payment methods we accept</span>
                        {showPaymentMethods ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {showPaymentMethods && (
                        <div className="pt-3">
                          <PaymentInfo />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Countdown Timer */}
                {!isFree && <CountdownTimer />}

                {/* Social Proof */}
                {["romantic", "valentines", "anniversary", "proposal"].includes(product.category?.toLowerCase() || "") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card/50 border border-border rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent border-2 border-background flex items-center justify-center"
                        >
                          <Heart className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{count} couples</span> trusted our handcrafted sites
                    </p>
                  </motion.div>
                )}

                {/* Want a Custom Design? */}
                <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Want a Custom Design?
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get a completely unique website tailored to your vision.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full py-5 text-sm font-semibold border-primary/30 hover:border-primary hover:bg-primary/10 text-foreground transition-all"
                    asChild
                  >
                    <a
                      href={siteConfig.whatsappNumber ? `https://wa.me/91${siteConfig.whatsappNumber}?text=Hi! I want a custom unique website designed.` : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2 text-primary" />
                      Customize & Order
                    </a>
                  </Button>
                </div>

                {/* Support */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30">
                  <MessageCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Need help? Chat with us anytime for questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} currentCategory={product.category} />

      <Footer />
      <AIChatbot />
      {product && (
        <OrderModal
          open={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          productTitle={product.title}
          product={product}
        />
      )}
    </div>
  );
};

export default ProductDetail;
