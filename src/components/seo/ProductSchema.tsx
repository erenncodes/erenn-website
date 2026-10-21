import { siteConfig } from "@/data/siteConfig";

interface ProductSchemaProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency?: string;
    category?: string;
    image_url?: string;
  };
}

const ProductSchema = ({ product }: ProductSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.image_url || "https://www.erenncodes.site/favicon.png",
    "url": `https://www.erenncodes.site/products/${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": siteConfig.businessName
    },
    "category": product.category || "Website Template",
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "PKR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": siteConfig.businessName
      },
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "50"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ProductSchema;
