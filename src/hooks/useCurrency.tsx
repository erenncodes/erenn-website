import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { CurrencyCode, defaultCurrency } from "@/data/siteConfig";
import {
  PricingRule,
  findRuleForCountry,
  calculateProductPrice,
  detectVisitorCountry,
  getPricingRules,
  getGlobalPricingSettings,
  CalculatedPrice,
  SAME_AS_INDIA_COUNTRIES,
} from "@/lib/countryPricing";
import { toast } from "sonner";

type CurrencyContextType = {
  country: string; // ISO country code e.g. 'IN', 'US', 'GB', 'CN', 'BD', 'LK'
  detectedCountry: string | null;
  currency: CurrencyCode;
  currencySymbol: string;
  currentRule: PricingRule;
  setCountry: (countryCode: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  formatProduct: (product: any, discountPercent?: number) => CalculatedPrice;
  rates: Record<string, number>;
  isLoading: boolean;
  refreshRates: () => Promise<void>;
  rules: PricingRule[];
  isDomesticLocked: boolean;
  isCountryChangeLocked: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY_COUNTRY = "erenn_selected_country";
const STORAGE_KEY_CURRENCY = "eren-codes-currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_COUNTRY) || "IN";
  });

  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [rules, setRules] = useState<PricingRule[]>(getPricingRules());
  const [isLoading, setIsLoading] = useState(true);

  // Strict Geo-Lock (Option A): visitors detected outside Same-as-India group cannot select domestic rates
  const isDomesticLocked = useMemo(() => {
    const settings = getGlobalPricingSettings();
    if (!settings.strictGeoLockDomestic || !detectedCountry) return false;
    return !SAME_AS_INDIA_COUNTRIES.includes(detectedCountry.toUpperCase());
  }, [detectedCountry]);

  // Lock visitor from changing country manually if enabled in settings
  const isCountryChangeLocked = useMemo(() => {
    const settings = getGlobalPricingSettings();
    return Boolean(settings.isCountryPricingEnabled && settings.lockVisitorToDetectedCountry && detectedCountry);
  }, [detectedCountry]);

  // Derive effective country enforcing auto-lock
  const effectiveCountry = useMemo(() => {
    if (isCountryChangeLocked && detectedCountry) return detectedCountry;
    if (isDomesticLocked && SAME_AS_INDIA_COUNTRIES.includes(country.toUpperCase())) {
      return detectedCountry || "US";
    }
    return country;
  }, [country, detectedCountry, isCountryChangeLocked, isDomesticLocked]);

  // Derive current rule from country (enforcing geo-lock)
  const currentRule = useMemo(() => {
    return findRuleForCountry(effectiveCountry, detectedCountry);
  }, [effectiveCountry, detectedCountry, rules]);

  // Filter available rules for visitor UI (Hides same-as-India domestic tier for international visitors)
  const availableRules = useMemo(() => {
    return rules.filter((r) => {
      if (!r.isEnabled) return false;
      if (isDomesticLocked && SAME_AS_INDIA_COUNTRIES.includes(r.countryCode)) return false;
      return true;
    });
  }, [rules, isDomesticLocked]);

  // Derive current currency from current rule
  const currency = (currentRule.currency as CurrencyCode) || defaultCurrency;
  const currencySymbol = currentRule.currencySymbol || "$";

  const setCountry = (newCountryCode: string) => {
    const code = newCountryCode.trim().toUpperCase();
    const settings = getGlobalPricingSettings();

    // 1. Enforce lock to detected country
    if (settings.lockVisitorToDetectedCountry && detectedCountry && code !== detectedCountry.toUpperCase()) {
      toast.error(`Pricing and currency are automatically locked to your detected region (${detectedCountry}).`);
      return;
    }

    // 2. Option A enforcement: reject manual switch to India / same-as-India if detected outside
    if (isDomesticLocked && SAME_AS_INDIA_COUNTRIES.includes(code)) {
      toast.error("Domestic rates are only available to visitors located within India, China, Bangladesh, Sri Lanka, Nepal, or Bhutan.");
      const fallbackCode = detectedCountry || "US";
      localStorage.setItem(STORAGE_KEY_COUNTRY, fallbackCode);
      setCountryState(fallbackCode);
      return;
    }

    localStorage.setItem(STORAGE_KEY_COUNTRY, code);
    setCountryState(code);

    const rule = findRuleForCountry(code, detectedCountry);
    if (rule?.currency) {
      localStorage.setItem(STORAGE_KEY_CURRENCY, rule.currency);
    }
    window.dispatchEvent(new Event("erenn_pricing_updated"));
  };

  const setCurrency = (newCurrency: CurrencyCode) => {
    const rule = availableRules.find((r) => r.currency === newCurrency) || findRuleForCountry(newCurrency, detectedCountry);
    if (rule) {
      setCountry(rule.countryCode);
    }
  };

  // Helper function to format any product's price for the active country
  const formatProduct = useCallback(
    (product: any, discountPercent: number = 60): CalculatedPrice => {
      return calculateProductPrice(product, effectiveCountry, discountPercent);
    },
    [effectiveCountry, rules]
  );

  // Automatic Location Detection on Startup
  useEffect(() => {
    const initLocation = async () => {
      const storedCountry = localStorage.getItem(STORAGE_KEY_COUNTRY);

      try {
        const detected = await detectVisitorCountry();
        setDetectedCountry(detected);

        const settings = getGlobalPricingSettings();
        const detectedIsInternational = !SAME_AS_INDIA_COUNTRIES.includes(detected);

        // Auto-lock visitor to detected country
        if (settings.lockVisitorToDetectedCountry) {
          localStorage.setItem(STORAGE_KEY_COUNTRY, detected);
          setCountryState(detected);
        } else if (settings.strictGeoLockDomestic && detectedIsInternational && storedCountry && SAME_AS_INDIA_COUNTRIES.includes(storedCountry)) {
          console.log("[Geo-Lock Option A] Resetting international visitor to:", detected);
          localStorage.setItem(STORAGE_KEY_COUNTRY, detected);
          setCountryState(detected);
        } else if (!storedCountry && detected) {
          console.log("[Geo-Pricing] Auto-detected visitor country:", detected);
          setCountry(detected);
        }
      } catch (e) {
        console.warn("[Geo-Pricing] Fallback to default country");
      } finally {
        setIsLoading(false);
      }
    };

    initLocation();

    // Listen for pricing rule updates from Admin
    const handleRulesUpdate = () => {
      setRules(getPricingRules());
    };
    window.addEventListener("erenn_pricing_updated", handleRulesUpdate);
    return () => window.removeEventListener("erenn_pricing_updated", handleRulesUpdate);
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        country: effectiveCountry,
        detectedCountry,
        currency,
        currencySymbol,
        currentRule,
        setCountry,
        setCurrency,
        formatProduct,
        rates: { INR: 1, USD: 0.045, GBP: 0.038, EUR: 0.042, PKR: 3.33, CNY: 0.086, BDT: 1.40, LKR: 3.55 },
        isLoading,
        refreshRates: async () => {},
        rules: availableRules,
        isDomesticLocked,
        isCountryChangeLocked,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
