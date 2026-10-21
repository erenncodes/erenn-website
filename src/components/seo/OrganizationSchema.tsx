import { siteConfig } from "@/data/siteConfig";

const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.businessName,
    "description": siteConfig.description,
    "url": "https://www.erenncodes.site",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.erenncodes.site/logo.png",
      "width": 512,
      "height": 512
    },
    "image": "https://www.erenncodes.site/logo.png",
    "sameAs": [
      siteConfig.socials.instagram,
      siteConfig.socials.youtube,
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": siteConfig.whatsappLink,
      "availableLanguage": ["English", "Urdu"]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default OrganizationSchema;
