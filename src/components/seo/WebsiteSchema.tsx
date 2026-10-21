import { siteConfig } from "@/data/siteConfig";

const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ErenCodes - Handcrafted Websites for Every Celebration",
    "alternateName": ["ErenCodes", "Eren Codes"],
    "description": siteConfig.description,
    "url": "https://www.erenncodes.site",
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.businessName,
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.erenncodes.site/logo.png",
        "width": 512,
        "height": 512
      }
    },
    "inLanguage": "en-US",
    "copyrightYear": new Date().getFullYear(),
    "keywords": [
      "custom celebration websites",
      "birthday surprise website",
      "anniversary gift website",
      "love proposal site builder",
      "personalized occasion websites",
      "unique website gifts",
      "affordable web design",
      "made-to-order websites"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default WebsiteSchema;
