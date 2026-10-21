import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { discountConfig } from "@/data/siteConfig";
import PriceDisplay from "@/components/PriceDisplay";
import { fetchUnifiedProducts, Product } from "@/lib/productService";

interface RelatedProductsProps {
  currentProductId: string;
  currentCategory?: string;
}

const RelatedProducts = ({ currentProductId, currentCategory }: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const all = await fetchUnifiedProducts(false);
        const candidates = all.filter((p) => p.id !== currentProductId);
        // Prioritize same category
        const sorted = candidates.sort((a, b) => {
          if (a.category === currentCategory && b.category !== currentCategory) return -1;
          if (b.category === currentCategory && a.category !== currentCategory) return 1;
          return 0;
        });
        setProducts(sorted.slice(0, 3));
      } catch (e) {
        console.error("Error fetching related products:", e);
      }
    };
    fetchRelated();
  }, [currentProductId, currentCategory]);

  if (products.length === 0) return null;

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            You Might Also Love 💕
          </h2>
          <p className="text-muted-foreground">
            Don't miss out on these beautiful templates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 relative"
            >
              {/* Sale Badge - only for paid products */}
              {product.price > 0 && (
              <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-destructive to-pink-500 text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                {discountConfig.discountPercent}% OFF
              </div>
              )}
              {product.price === 0 && (
              <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                🎉 FREE
              </div>
              )}
              
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
                      <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded">
                        SAVE {discountConfig.discountPercent}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
