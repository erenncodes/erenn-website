import { siteConfig } from "@/data/siteConfig";

const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": siteConfig.businessName,
    "alternateName": "Erenn",
    "description": "Freelance web developer crafting unique celebration websites — birthdays, anniversaries, proposals, festivals & more. Each site is built from scratch with modern tech and delivered within 24–48 hours.",
    "url": "https://www.erenncodes.site",
    "logo": "https://www.erenncodes.site/favicon.png",
    "image": "https://www.erenncodes.site/og-image.png",
    "priceRange": "$$",
    "paymentAccepted": ["Bank Transfer", "EasyPaisa", "JazzCash", "Taptap Send", "PayPal"],
    "currenciesAccepted": "PKR, USD",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK"
    },
    "serviceArea": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "sameAs": [
      siteConfig.socials.instagram,
      siteConfig.socials.youtube
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": siteConfig.whatsappLink,
      "availableLanguage": ["English", "Urdu"]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Ahmed R." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "My girlfriend absolutely loved the birthday website — the animations and personal touches were perfect. Worth every penny!"
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Fatima K." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Ordered an anniversary page and the level of detail blew me away. Quick delivery too!"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Celebration Website Catalog",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Birthday Celebration Websites",
          "description": "Personalized birthday websites with animations, music & photo galleries"
        },
        {
          "@type": "OfferCatalog",
          "name": "Anniversary & Romance Websites",
          "description": "Heartfelt anniversary and love story pages"
        },
        {
          "@type": "OfferCatalog",
          "name": "Proposal & Surprise Websites",
          "description": "Interactive proposal and surprise reveal websites"
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default LocalBusinessSchema;
