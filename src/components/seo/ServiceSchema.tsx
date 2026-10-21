import { siteConfig } from "@/data/siteConfig";

const ServiceSchema = () => {
  const services = [
    {
      "@type": "Service",
      "name": "Celebration Website Design",
      "description": "Get a fully custom website for any special occasion — birthdays, anniversaries, proposals, festivals. Each design is handcrafted with animations, personal photos, and music.",
      "provider": {
        "@type": "Organization",
        "name": siteConfig.businessName
      },
      "serviceType": "Web Design",
      "areaServed": {
        "@type": "Place",
        "name": "Worldwide"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Website Categories",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Birthday Surprise Websites"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Anniversary Celebration Pages"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Romantic Proposal Websites"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Festival & Holiday Greetings"
            }
          }
        ]
      }
    },
    {
      "@type": "Service",
      "name": "Custom Web Development",
      "description": "Bespoke websites built with React, featuring responsive layouts, cinematic animations, and mobile-first design. Perfect for turning your ideas into a stunning digital experience.",
      "provider": {
        "@type": "Organization",
        "name": siteConfig.businessName
      },
      "serviceType": "Web Development",
      "areaServed": {
        "@type": "Place",
        "name": "Worldwide"
      }
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": services
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ServiceSchema;
