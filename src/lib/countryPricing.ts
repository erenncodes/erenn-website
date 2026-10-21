/**
 * Country-Based Dynamic Pricing & Geo-Location Engine
 * 
 * Centralized, secure country detection and regional pricing rules.
 * Supports 170+ countries, country-specific pricing, regional groups,
 * same-as-India domestic parity tier (India, China, Bangladesh, Sri Lanka, Nepal, Bhutan),
 * minimum international prices ($5 USD), and strict geo-lock protection.
 */

import {
  SAME_AS_INDIA_COUNTRIES,
  WORLD_COUNTRIES,
  generateWorldPricingRules,
} from "@/data/countryList";

export { SAME_AS_INDIA_COUNTRIES, WORLD_COUNTRIES };

export interface PricingRule {
  id: string;
  countryCode: string; // ISO 2-letter code or group ID (e.g. 'IN', 'US', 'GB', 'CN', 'BD', 'LK', etc.)
  countryName: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  minPrice: number; // Minimum price in this currency (e.g. 5.00 USD, 0 for INR/CNY/BDT/LKR)
  fixedRateFromINR: number; // Multiplier from INR base price if no product-specific override exists
  isInternational: boolean; // True for international, false for same-as-India domestic tier
  isEnabled: boolean;
}

export interface GlobalPricingSettings {
  isCountryPricingEnabled: boolean;
  defaultInternationalCurrency: string;
  minInternationalPriceUSD: number; // Default $5.00
  defaultFallbackCountry: string; // 'US'
  strictGeoLockDomestic: boolean; // Option A: If true, clients outside India/domestic group cannot select domestic prices
  lockVisitorToDetectedCountry: boolean; // When true, visitors are strictly locked to their detected location
}

export const defaultGlobalSettings: GlobalPricingSettings = {
  isCountryPricingEnabled: true,
  defaultInternationalCurrency: "USD",
  minInternationalPriceUSD: 5.0,
  defaultFallbackCountry: "US",
  strictGeoLockDomestic: true, // Option A enabled
  lockVisitorToDetectedCountry: true, // Auto-lock enabled to prevent visitors from altering country
};

// Preset Regional & Country Rules (170+ countries generated from WORLD_COUNTRIES)
export const defaultPricingRules: PricingRule[] = generateWorldPricingRules();

// Eurozone country codes
export const EUROZONE_COUNTRIES = [
  "DE", "FR", "IT", "ES", "NL", "BE", "AT", "IE", "FI", "PT", "GR", "LU", "SK", "SI", "EE", "LV", "LT", "CY", "MT", "HR"
];

// Middle East country codes
export const MIDDLE_EAST_COUNTRIES = ["AE", "SA", "QA", "KW", "OM", "BH"];

const STORAGE_KEY_RULES = "erenn_country_pricing_rules";
const STORAGE_KEY_SETTINGS = "erenn_global_pricing_settings";
const STORAGE_KEY_COUNTRY = "erenn_selected_country";
const STORAGE_KEY_DETECTED = "erenn_detected_country";

/**
 * Get current pricing rules (with admin overrides and automatic 170+ country upgrade)
 */
export const getPricingRules = (): PricingRule[] => {
  const worldRules = generateWorldPricingRules();
  try {
    const stored = localStorage.getItem(STORAGE_KEY_RULES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= 100) {
        return parsed;
      }
      // If stored has older small list (< 100 rules), merge user overrides onto worldRules
      if (Array.isArray(parsed) && parsed.length > 0) {
        const overridesMap = new Map<string, PricingRule>();
        parsed.forEach((r: PricingRule) => overridesMap.set(r.countryCode, r));
        return worldRules.map((r) => overridesMap.get(r.countryCode) || r);
      }
    }
  } catch (e) {
    // fallback
  }
  return worldRules;
};

/**
 * Save pricing rules (managed from Admin)
 */
export const savePricingRules = (rules: PricingRule[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    window.dispatchEvent(new Event("erenn_pricing_updated"));
  } catch (e) {
    console.error("Failed to save pricing rules:", e);
  }
};

/**
 * Get global pricing settings
 */
export const getGlobalPricingSettings = (): GlobalPricingSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (stored) {
      return { ...defaultGlobalSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    // fallback
  }
  return defaultGlobalSettings;
};

/**
 * Save global pricing settings
 */
export const saveGlobalPricingSettings = (settings: Partial<GlobalPricingSettings>) => {
  try {
    const current = getGlobalPricingSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    window.dispatchEvent(new Event("erenn_pricing_updated"));
    return updated;
  } catch (e) {
    return defaultGlobalSettings;
  }
};

/**
 * Match a country code to its appropriate pricing rule.
 * Enforces strict geo-locking:
 * Visitors outside the Same-as-India group (India, China, Bangladesh, Sri Lanka, Nepal, Bhutan)
 * cannot select domestic rates to circumvent the international US$5.00 floor.
 */
export const findRuleForCountry = (
  countryCode: string | null | undefined,
  detectedCountry?: string | null
): PricingRule => {
  const settings = getGlobalPricingSettings();
  const rules = getPricingRules();
  const code = (countryCode || "").trim().toUpperCase();
  const detected = (detectedCountry || "").trim().toUpperCase();

  const isDomesticTarget = SAME_AS_INDIA_COUNTRIES.includes(code);
  const isDetectedDomestic = detected && SAME_AS_INDIA_COUNTRIES.includes(detected);

  // Option A enforcement: If visitor is detected outside same-as-India group, disallow selecting domestic pricing
  if (settings.strictGeoLockDomestic && isDomesticTarget && detected && !isDetectedDomestic) {
    const fallbackRule = rules.find((r) => r.countryCode === detected && r.isEnabled);
    return fallbackRule || rules.find((r) => r.countryCode === "DEFAULT_INTL") || rules.find((r) => r.countryCode === "US") || rules[0];
  }

  if (!code) {
    return rules.find((r) => r.countryCode === "DEFAULT_INTL") || rules[rules.length - 1];
  }

  // 1. Direct country match (e.g. IN, CN, BD, LK, PK, US, GB, etc.)
  const direct = rules.find((r) => r.countryCode === code && r.isEnabled);
  if (direct) return direct;

  // 2. Eurozone match
  if (EUROZONE_COUNTRIES.includes(code)) {
    const eu = rules.find((r) => r.countryCode === "EU" && r.isEnabled) || rules.find((r) => r.currency === "EUR" && r.isEnabled);
    if (eu) return eu;
  }

  // 3. Middle East match
  if (MIDDLE_EAST_COUNTRIES.includes(code)) {
    const me = rules.find((r) => r.countryCode === code && r.isEnabled) || rules.find((r) => r.countryCode === "AE" && r.isEnabled);
    if (me) return me;
  }

  // 4. Default fallback
  const fallback = rules.find((r) => r.countryCode === "DEFAULT_INTL" && r.isEnabled);
  return fallback || rules[rules.length - 1];
};

export interface CalculatedPrice {
  countryCode: string;
  countryName: string;
  currency: string;
  currencySymbol: string;
  salePrice: number;
  originalPrice: number;
  discountPercent: number;
  isFree: boolean;
  isInternational: boolean;
  minPriceEnforced: boolean;
  formattedSale: string;
  formattedOriginal: string;
  priceNote?: string;
}

/**
 * Authoritative price calculation engine for any product and country.
 * China, Bangladesh, Sri Lanka, Nepal, and Bhutan receive domestic parity tier
 * (same pricing category as India, exempt from US$5 international floor).
 */
export const calculateProductPrice = (
  product: {
    price: number; // base price in INR
    country_prices?: Record<string, number> | null;
    [key: string]: any;
  },
  countryCode: string,
  discountPercent: number = 60
): CalculatedPrice => {
  const basePriceINR = Number(product.price) || 0;
  const isFree = basePriceINR === 0;

  const rule = findRuleForCountry(countryCode);
  const settings = getGlobalPricingSettings();

  if (isFree) {
    return {
      countryCode: rule.countryCode,
      countryName: rule.countryName,
      currency: rule.currency,
      currencySymbol: rule.currencySymbol,
      salePrice: 0,
      originalPrice: 0,
      discountPercent: 0,
      isFree: true,
      isInternational: rule.isInternational,
      minPriceEnforced: false,
      formattedSale: "FREE",
      formattedOriginal: "",
    };
  }

  let finalSalePrice = 0;
  let minPriceEnforced = false;

  // Check if product has an explicit fixed country/currency price override
  const overrides = product.country_prices || {};
  const explicitCountryPrice = overrides[rule.countryCode] || overrides[countryCode.toUpperCase()];
  const explicitCurrencyPrice = overrides[rule.currency];

  if (explicitCountryPrice !== undefined && explicitCountryPrice !== null && Number(explicitCountryPrice) > 0) {
    finalSalePrice = Number(explicitCountryPrice);
  } else if (explicitCurrencyPrice !== undefined && explicitCurrencyPrice !== null && Number(explicitCurrencyPrice) > 0) {
    finalSalePrice = Number(explicitCurrencyPrice);
  } else if (rule.countryCode === "IN") {
    // Domestic India: direct base price
    finalSalePrice = basePriceINR;
  } else {
    // Calculate via rule fixedRate multiplier
    const rate = rule.fixedRateFromINR || 0.045;
    const rawCalculated = basePriceINR * rate;
    
    if (rule.currency === "PKR" || rule.currency === "BDT" || rule.currency === "LKR" || rule.currency === "NPR" || rule.currency === "JPY" || rule.currency === "KRW" || rule.currency === "VND" || rule.currency === "IDR") {
      finalSalePrice = Math.round(rawCalculated);
    } else {
      finalSalePrice = Math.round(rawCalculated * 100) / 100;
    }
  }

  // Same-as-India countries (India, China, Bangladesh, Sri Lanka, Nepal, Bhutan) are EXEMPT from US$5 international floor
  const isDomesticTier = !rule.isInternational || SAME_AS_INDIA_COUNTRIES.includes(rule.countryCode);

  if (!isDomesticTier && settings.isCountryPricingEnabled) {
    const applicableMin = Math.max(rule.minPrice || 0, rule.currency === "USD" ? settings.minInternationalPriceUSD : 0);
    if (applicableMin > 0 && finalSalePrice < applicableMin) {
      finalSalePrice = applicableMin;
      minPriceEnforced = true;
    }
  }

  // Calculate regular / original price for display (before discount)
  let calculatedOriginal = 0;
  if (discountPercent > 0 && discountPercent < 100) {
    const ratio = 1 - discountPercent / 100;
    calculatedOriginal = finalSalePrice / ratio;
  } else {
    calculatedOriginal = finalSalePrice;
  }

  // Format numbers cleanly
  let formattedSale = "";
  let formattedOriginal = "";

  const decimalCurrencies = ["USD", "GBP", "EUR", "CAD", "AUD", "NZD", "CHF", "CNY", "SGD", "AED", "SAR"];
  if (decimalCurrencies.includes(rule.currency)) {
    finalSalePrice = Math.round(finalSalePrice * 100) / 100;
    calculatedOriginal = Math.round(calculatedOriginal * 100) / 100;
    formattedSale = `${rule.currencySymbol}${finalSalePrice.toFixed(2)}`;
    formattedOriginal = `${rule.currencySymbol}${calculatedOriginal.toFixed(2)}`;
  } else {
    finalSalePrice = Math.round(finalSalePrice);
    calculatedOriginal = Math.round(calculatedOriginal);
    formattedSale = `${rule.currencySymbol} ${finalSalePrice.toLocaleString()}`;
    formattedOriginal = `${rule.currencySymbol} ${calculatedOriginal.toLocaleString()}`;
  }

  return {
    countryCode: rule.countryCode,
    countryName: rule.countryName,
    currency: rule.currency,
    currencySymbol: rule.currencySymbol,
    salePrice: finalSalePrice,
    originalPrice: calculatedOriginal,
    discountPercent,
    isFree: false,
    isInternational: !isDomesticTier,
    minPriceEnforced,
    formattedSale,
    formattedOriginal,
    priceNote: minPriceEnforced ? `International Minimum Applied (${rule.currencySymbol}${rule.minPrice})` : undefined,
  };
};

/**
 * Fast, privacy-preserving IP Geolocation detector with multiple fallbacks
 */
export const detectVisitorCountry = async (): Promise<string> => {
  // Check cached detected country in sessionStorage & localStorage
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY_DETECTED) || localStorage.getItem(STORAGE_KEY_DETECTED);
    if (cached && cached.length === 2) return cached.toUpperCase();
  } catch (e) {}

  // 1. Try ipapi.co (reliable, standard ISO 2-letter codes)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store", signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data?.country_code && data.country_code.length === 2) {
        const code = data.country_code.toUpperCase();
        sessionStorage.setItem(STORAGE_KEY_DETECTED, code);
        localStorage.setItem(STORAGE_KEY_DETECTED, code);
        return code;
      }
    }
  } catch (err) {}

  // 2. Fallback to api.country.is
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("https://api.country.is/", { cache: "no-store", signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data?.country && data.country.length === 2) {
        const code = data.country.toUpperCase();
        sessionStorage.setItem(STORAGE_KEY_DETECTED, code);
        localStorage.setItem(STORAGE_KEY_DETECTED, code);
        return code;
      }
    }
  } catch (err) {}

  // 3. Fallback to ipwho.is
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("https://ipwho.is/", { cache: "no-store", signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data?.country_code && data.country_code.length === 2) {
        const code = data.country_code.toUpperCase();
        sessionStorage.setItem(STORAGE_KEY_DETECTED, code);
        localStorage.setItem(STORAGE_KEY_DETECTED, code);
        return code;
      }
    }
  } catch (err) {}

  // 4. Timezone heuristic (instant & offline)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Calcutta") || tz.includes("Kolkata")) return "IN";
    if (tz.includes("Dhaka")) return "BD";
    if (tz.includes("Colombo")) return "LK";
    if (tz.includes("Shanghai") || tz.includes("Urumqi") || tz.includes("Chongqing")) return "CN";
    if (tz.includes("Kathmandu")) return "NP";
    if (tz.includes("Karachi")) return "PK";
    if (tz.includes("Dubai")) return "AE";
    if (tz.includes("Riyadh")) return "SA";
    if (tz.includes("London")) return "GB";
    if (tz.includes("New_York") || tz.includes("Chicago") || tz.includes("Los_Angeles") || tz.includes("Denver")) return "US";
  } catch (err) {}

  // 5. Fallback to browser locale
  try {
    const navLang = navigator.language || (navigator as any).userLanguage || "";
    const parts = navLang.split("-");
    if (parts.length > 1 && parts[1].length === 2) {
      const code = parts[1].toUpperCase();
      sessionStorage.setItem(STORAGE_KEY_DETECTED, code);
      localStorage.setItem(STORAGE_KEY_DETECTED, code);
      return code;
    }
  } catch (err) {}

  // 6. Default fallback: US
  return "US";
};

/**
 * Authoritative Server-side Price Validation (verifies amounts submitted for checkout)
 */
export const validateOrderAmount = (
  product: { price: number; country_prices?: Record<string, number> | null },
  submittedAmount: number,
  countryCode: string
): { isValid: boolean; expectedPrice: number; message?: string } => {
  const calc = calculateProductPrice(product, countryCode);
  const isValid = Math.abs(submittedAmount - calc.salePrice) <= 0.05 || submittedAmount >= calc.salePrice;
  return {
    isValid,
    expectedPrice: calc.salePrice,
    message: isValid
      ? "Price verified"
      : `Submitted amount (${submittedAmount}) does not match authoritative country price (${calc.salePrice} ${calc.currency})`,
  };
};
