import { useState, useEffect, useMemo } from "react";
import { Search, Star, Quote, CheckCircle2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { discountConfig, getPromoBannerConfig } from "@/data/siteConfig";
import PriceDisplay from "@/components/PriceDisplay";
import { toast } from "sonner";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { fetchUnifiedProducts, Product } from "@/lib/productService";
import { genuineReviews, ReviewItem } from "@/data/reviewsData";

interface Review {
  id: string;
  name: string;
  review_text: string;
  rating: number;
  created_at: string;
}

// Fallback reviews if no approved reviews exist yet
const fallbackReviews = [
  { name: "Zara M.", text: "The birthday website blew my mind! My partner was so surprised. Absolutely beautiful work! 🎂", rating: 5 },
  { name: "Ali H.", text: "Got a custom anniversary template and it was pixel-perfect. Delivered super fast too!", rating: 5 },
  { name: "Sophie L.", text: "Ordered from London — seamless process and stunning result. 10/10 recommend!", rating: 5 },
  { name: "Daniyal R.", text: "The love proposal site was magical. She said yes! Can't thank Eren enough 💍", rating: 5 },
  { name: "Maha K.", text: "Such creative designs! Made a Valentine's site for my husband and he was speechless.", rating: 5 },
  { name: "Ryan T.", text: "Fast turnaround, excellent communication, and the final product was top-notch.", rating: 5 },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [promoConfig, setPromoConfig] = useState(getPromoBannerConfig());

  useEffect(() => {
    fetchProducts();
    fetchReviews();

    const handleConfigUpdate = () => {
      setPromoConfig(getPromoBannerConfig());
    };
    const handleProductsUpdate = () => {
      fetchProducts();
    };

    window.addEventListener("erenn_config_updated", handleConfigUpdate);
    window.addEventListener("erenn_products_updated", handleProductsUpdate);
    return () => {
      window.removeEventListener("erenn_config_updated", handleConfigUpdate);
      window.removeEventListener("erenn_products_updated", handleProductsUpdate);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const unified = await fetchUnifiedProducts(false);
      setProducts(unified);
    } catch (e) {
      console.error("Error loading products:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(12);
    if (data) setReviews(data);
  };




  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return [
      { id: "all", name: "All Products", count: products.length },
      ...Array.from(cats).map((cat) => ({
        id: cat,
        name: cat,
        count: products.filter((p) => p.category === cat).length,
      })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.erenncodes.site/" },
        { name: "Products", url: "https://www.erenncodes.site/products" },
      ]} />
      <Navbar />


      {/* Sale Banner */}
      <section className="py-4 bg-gradient-to-r from-primary via-accent to-primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-primary-foreground">
            <span className="text-2xl">🔥</span>
            <span className="text-lg md:text-xl font-bold animate-pulse">
              SPECIAL OFFER: {discountConfig.discountPercent}% OFF ALL TEMPLATES
            </span>
            <span className="text-2xl">🔥</span>
          </div>
        </div>
      </section>

      {/* Hero Section - SEO Optimized */}
      <section className="py-16 border-b border-border relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary mb-4 animate-pulse">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">🔥 SPECIAL OFFER: {promoConfig.discountPercent}% OFF EVERYTHING!</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Beautiful <span className="gradient-text">Website Templates</span> for Every Moment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover our collection of stunning templates for birthdays, anniversaries, love proposals, 
            and special occasions. Create unforgettable memories with custom designs! ✨
          </p>
          
          {/* Price Highlight Box */}
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-card border-2 border-primary/50 rounded-2xl mb-6">
            <div className="text-left">
              <span className="block text-sm text-muted-foreground mb-1">Starting from</span>
              <PriceDisplay priceInPKR={promoConfig.startingPrice} showOriginal={false} size="lg" />
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-bold rounded-full">
              🔥 UP TO {promoConfig.discountPercent}% OFF
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-yellow-500" />
            ))}
            <span className="text-foreground ml-2 font-medium">4.9/5 from 200+ happy customers</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-card border-border"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:w-64 flex-shrink-0">
              <h3 className="font-display font-semibold text-lg mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-card hover:bg-secondary text-foreground"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        selectedCategory === category.id
                          ? "bg-accent-foreground/20"
                          : "bg-muted"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Sidebar Info */}
              <div className="mt-6 p-4 bg-card rounded-xl border border-border">
                <p className="text-sm font-medium text-foreground mb-2">💬 Need Help?</p>
                <p className="text-xs text-muted-foreground">Contact us on WhatsApp for custom orders or questions.</p>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <p className="text-muted-foreground mb-6">
                Showing {filteredProducts.length} products
              </p>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="bg-card rounded-2xl border border-border overflow-hidden card-hover group relative"
                    >
                      {/* Sale Ribbon - only for paid products */}
                      {product.price > 0 && (
                      <div className="absolute top-4 -right-8 z-10 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold py-1 px-10 rotate-45 shadow-lg">
                        🔥 {discountConfig.discountPercent}% OFF
                      </div>
                      )}
                      {product.price === 0 && (
                      <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                        🎉 100% Free
                      </div>
                      )}
                      
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={product.image_url || '/images/default-thumbnail.png'}
                          alt={product.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-display font-semibold text-lg">
                            {product.title}
                          </h3>
                          {product.category && (
                            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                              {product.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          {product.price === 0 ? (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">🎉 FREE</span>
                          ) : (
                            <>
                              <PriceDisplay
                                priceInPKR={product.price}
                                showOriginal={true}
                                size="sm"
                                regionPrices={{
                                  PKR: (product as any).price_pkr,
                                  INR: (product as any).price_inr,
                                  GBP: (product as any).price_gbp,
                                  USD: (product as any).price_usd,
                                  ...((product as any).country_prices || {}),
                                }}
                              />
                              <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                                🔥 SAVE {discountConfig.discountPercent}%
                              </span>
                            </>
                          )}
                        </div>
                        <Button asChild size="sm" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                          <Link to={`/products/${product.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-4">
                    {products.length === 0
                      ? "No products available yet. Check back soon!"
                      : "No products found matching your criteria."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say 💬
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real feedback from people who trusted us with their special moments.
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {(reviews.length > 0
              ? reviews.map((r) => ({
                  id: r.id,
                  name: r.name,
                  review: r.review_text,
                  rating: r.rating,
                  location: "Verified Buyer",
                  templateName: "Custom Celebration Site",
                  date: "Recent",
                  verified: true,
                  avatarInitials: r.name.slice(0, 2).toUpperCase(),
                  avatarColor: "from-pink-500 to-rose-500",
                }))
              : genuineReviews
            ).map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {review.templateName}
                    </span>
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <Quote className="w-6 h-6 text-primary/25 mb-2 -scale-x-100" />
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                    "{review.review}"
                  </p>
                </div>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-tr ${review.avatarColor} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-inner`}
                    >
                      {review.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm">{review.name}</span>
                        {review.verified && (
                          <span className="inline-flex items-center text-[10px] text-emerald-500 font-medium" title="Verified Customer">
                            <CheckCircle2 className="w-3 h-3 fill-emerald-500/20" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{review.location}</span>
                        <span>·</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>



        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Ready to Surprise Someone Special?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Browse our collection and find the perfect template for your special occasion.
          </p>
          <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Browse Templates
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;