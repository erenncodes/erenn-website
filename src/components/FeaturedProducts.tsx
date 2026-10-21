import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { discountConfig } from "@/data/siteConfig";
import PriceDisplay from "@/components/PriceDisplay";
import { fetchUnifiedProducts, Product } from "@/lib/productService";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const unified = await fetchUnifiedProducts(false);
        setProducts(unified.slice(0, 4));
      } catch (e) {
        console.error("Error fetching featured products:", e);
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
        <div className="container mx-auto px-4 flex justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4">
            🔥 SPECIAL OFFER
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Beautiful templates for birthdays, proposals, anniversaries & special occasions! ✨
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/products/${product.id}`}
                className="group block bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 relative"
              >
                {/* Valentine Sale Badge */}
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  🔥 {discountConfig.discountPercent}% OFF
                </div>
                
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={product.image_url || '/images/default-thumbnail.png'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
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
                          }}
                        />
                        <span className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground px-2 py-1 rounded font-bold">🔥 SAVE {discountConfig.discountPercent}%</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button asChild size="lg">
            <Link to="/products" className="flex items-center gap-2">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
