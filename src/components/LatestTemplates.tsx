import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteConfig, discountConfig } from "@/data/siteConfig";
import PriceDisplay from "@/components/PriceDisplay";
import { fetchUnifiedProducts, Product } from "@/lib/productService";

const LatestTemplates = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const unified = await fetchUnifiedProducts(false);
        setProducts(unified.slice(0, 6));
      } catch (e) {
        console.error("Error fetching latest templates:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const handleUpdate = () => fetchProducts();
    window.addEventListener("erenn_products_updated", handleUpdate);
    return () => window.removeEventListener("erenn_products_updated", handleUpdate);
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Sale Banner */}
        <motion.div 
          className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-accent to-primary p-1"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-background/95 rounded-xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <span className="text-4xl">🔥</span>
                  <span className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full font-bold animate-pulse">
                    LIMITED TIME SALE
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{discountConfig.discountPercent}% OFF</span> All Templates!
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Grab your favorite templates at unbeatable prices ✨
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-primary/10 rounded-lg border border-primary/30">
                  <span className="text-2xl md:text-3xl font-bold text-primary">{discountConfig.discountPercent}%</span>
                  <p className="text-xs text-muted-foreground">Discount</p>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground animate-pulse">
                  <Link to="/products">
                    Shop Now ✨ <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Header - SEO Optimized */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4 animate-pulse">
            🔥 SPECIAL OFFER: {discountConfig.discountPercent}% OFF ALL TEMPLATES
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Templates</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our beautiful templates for birthdays, proposals, anniversaries & special occasions! ✨
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/products/${product.id}`}
                className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 relative"
            >
              {/* Sale Ribbon */}
              <div className="absolute top-4 -right-8 z-10 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold py-1 px-10 rotate-45 shadow-lg">
                🔥 {discountConfig.discountPercent}% OFF
              </div>
              
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={product.image_url || '/images/default-thumbnail.png'}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
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
              </div>
            </Link>
            </motion.div>
          ))}
        </div>

        {/* Negative Hook CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-8 max-w-2xl">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
              ⏰ Don't Miss Out — Sale Ends Soon!
            </h3>
            <p className="text-muted-foreground mb-6">
              Make their day unforgettable with a personalized website. 
              Grab your template before this offer expires! ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground">
                <Link to="/products">
                  🔥 Browse Templates
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-green-500 text-green-500 hover:bg-green-500/10">
                <a 
                  href={`https://wa.me/91${siteConfig.whatsappNumber}?text=Hi! I want to order a custom template`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestTemplates;
