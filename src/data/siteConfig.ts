// =====================================================
// SITE CONFIGURATION - EDIT THIS FILE TO UPDATE SITE INFO
// =====================================================

export const siteConfig = {
  // Business Information
  businessName: "Erenn",
  tagline: "Bespoke Celebration Websites, Handcrafted for the People You Love ✨",
  description: "Erenn designs one-of-a-kind celebration websites for birthdays, anniversaries, proposals, apologies and Eid — personalised for the person you love and delivered within 24–48 hours. Turn any occasion into a shareable digital keepsake.",
  
  // SEO Keywords
  keywords: [
    "personalised celebration website India",
    "birthday surprise website for girlfriend",
    "anniversary gift website online",
    "love proposal website maker",
    "digital gift website for boyfriend",
    "custom eid mubarak website",
    "romantic website with our photos",
    "sorry apology website for her",
    "shareable birthday link gift",
    "wedding announcement microsite",
    "long distance relationship website gift",
    "Erenn celebration websites"
  ],
  
  // Contact Information
  email: "",
  whatsappNumber: "9341736374",
  whatsappLink: "https://wa.me/919341736374?text=Hi! I'm interested in your templates",
  
  // Social Media Links
  socials: {
    instagram: "https://www.instagram.com/erenncodes?xtok=bzRmbXRkdGV6YzI2",
    youtube: "https://youtube.com/@erenncodes?si=zW-G4C7FmABs6mrr",
    facebook: "https://www.facebook.com/erenncodes",
    pinterest: "https://pin.it/44R9lHZXy",
    tiktok: "",
  },
  
  // Payment Information - Bank Transfer (PKR)
  paymentPK: {
    bankName: "Bank Alfalah",
    accountTitle: "Ahmar asim rasheed ch",
    accountNumber: "00381010348599",
    iban: "PK58ALFH0038001010348599",
    currency: "PKR",
  },
  
  // Payment Information - EasyPaisa
  paymentEasypaisa: {
    accountTitle: "Ahmar asim rasheed ch",
    accountNumber: "03116496245",
  },
  
  // Payment Information - JazzCash
  paymentJazzcash: {
    accountTitle: "Ahmar asim rasheed ch",
    accountNumber: "03263820112",
  },
  
  // Payment Information - International
  paymentInternational: {
    method: "Crypto (Binance), PhonePe, GPay, Paytm, Taptap Send, PayPal",
    note: "Contact us on WhatsApp for international payment details",
  },
  
  // Stats
  stats: {
    happyCustomers: "100+",
    templates: "Custom",
    support: "24/7",
  },
};

// Currency configuration - INR is the base currency
export type CurrencyCode = "INR" | "PKR" | "GBP" | "USD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number;
}

export const currencies: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 1 },
  PKR: { code: "PKR", symbol: "Rs.", name: "Pakistani Rupee", rate: 3.33 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0093 },
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 0.012 },
};

export const defaultCurrency: CurrencyCode = "INR";

export interface PromoBannerConfig {
  startingPrice: number;
  originalPrice: number;
  discountPercent: number;
  badgeText: string;
  headline: string;
}

export const promoBannerConfig: PromoBannerConfig = {
  startingPrice: 124,
  originalPrice: 310,
  discountPercent: 60,
  badgeText: "🔥 Limited Time — 60% OFF Every Template!",
  headline: "Beautiful Website Starting from ₹124 — Up to 60% Off",
};

export const discountConfig = {
  discountPercent: 60,
  originalPrice: 310,
  salePrice: 124,
};

// Local storage key for runtime settings managed via Admin
const PROMO_STORAGE_KEY = "erenn_promo_config";
const SOCIALS_STORAGE_KEY = "erenn_socials_config";

export const getPromoBannerConfig = (): PromoBannerConfig => {
  try {
    const stored = localStorage.getItem(PROMO_STORAGE_KEY);
    if (stored) {
      return { ...promoBannerConfig, ...JSON.parse(stored) };
    }
  } catch (e) {
    // fallback
  }
  return promoBannerConfig;
};

export const savePromoBannerConfig = (config: Partial<PromoBannerConfig>) => {
  try {
    const current = getPromoBannerConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("erenn_config_updated"));
    return updated;
  } catch (e) {
    return promoBannerConfig;
  }
};

export const getSocialConfig = () => {
  try {
    const stored = localStorage.getItem(SOCIALS_STORAGE_KEY);
    if (stored) {
      return { ...siteConfig.socials, ...JSON.parse(stored) };
    }
  } catch (e) {
    // fallback
  }
  return siteConfig.socials;
};

export const saveSocialConfig = (socials: Partial<typeof siteConfig.socials>) => {
  try {
    const current = getSocialConfig();
    const updated = { ...current, ...socials };
    localStorage.setItem(SOCIALS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("erenn_config_updated"));
    return updated;
  } catch (e) {
    return siteConfig.socials;
  }
};

export const convertPrice = (priceInBase: number, currency: CurrencyCode): number => {
  const converted = priceInBase * currencies[currency].rate;
  if (currency === "USD" || currency === "GBP") {
    return Math.round(converted * 100) / 100;
  }
  return Math.round(converted);
};

export const formatPriceWithCurrency = (priceInBase: number, currency: CurrencyCode): string => {
  const convertedPrice = convertPrice(priceInBase, currency);
  if (currency === "USD" || currency === "GBP") {
    return `${currencies[currency].symbol}${convertedPrice.toFixed(2)}`;
  }
  return `${currencies[currency].symbol} ${convertedPrice.toLocaleString()}`;
};

export const formatPrice = (price: number, currency: CurrencyCode = defaultCurrency): string => {
  return formatPriceWithCurrency(price, currency);
};

export const getOriginalPrice = (currency: CurrencyCode = defaultCurrency): number => {
  return convertPrice(discountConfig.originalPrice, currency);
};

export const formatPriceWithDiscount = (currency: CurrencyCode = defaultCurrency): { original: string; discounted: string; percent: number } => {
  return {
    original: formatPriceWithCurrency(discountConfig.originalPrice, currency),
    discounted: formatPriceWithCurrency(discountConfig.salePrice, currency),
    percent: discountConfig.discountPercent,
  };
};

export const getSalePrice = (currency: CurrencyCode = defaultCurrency): number => {
  return convertPrice(discountConfig.salePrice, currency);
};
