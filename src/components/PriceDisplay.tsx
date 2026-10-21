import { useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateProductPrice } from "@/lib/countryPricing";

interface PriceDisplayProps {
  priceInPKR: number; // Base price in INR
  showOriginal?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  regionPrices?: Partial<Record<string, number | null | undefined>>;
  showMinBadge?: boolean;
}

const PriceDisplay = ({
  priceInPKR,
  showOriginal = true,
  className,
  size = "md",
  regionPrices,
  showMinBadge = false,
}: PriceDisplayProps) => {
  const { country, currentRule, setCountry, formatProduct, rules } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(false);

  const productData = {
    price: priceInPKR,
    country_prices: regionPrices as any,
  };

  const calculated = formatProduct(productData);

  const sizeClasses = {
    sm: { price: "text-lg", original: "text-xs", expanded: "text-sm" },
    md: { price: "text-2xl", original: "text-sm", expanded: "text-sm" },
    lg: { price: "text-3xl", original: "text-base", expanded: "text-base" },
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Main Price Display */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 group cursor-pointer hover:opacity-85 transition-opacity text-left"
        aria-expanded={isExpanded}
        aria-label="Click to change country or view prices in other regions"
      >
        <div className="flex items-baseline gap-2 flex-wrap">
          {showOriginal && calculated.originalPrice > calculated.salePrice && (
            <span className={cn("line-through text-muted-foreground font-normal", sizeClasses[size].original)}>
              {calculated.formattedOriginal}
            </span>
          )}
          <span className={cn("font-bold text-primary", sizeClasses[size].price)}>
            {calculated.formattedSale}
          </span>
          {showMinBadge && calculated.minPriceEnforced && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
              Min. Intl
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>
      </button>

      {/* Expanded Regional Pricing Selector */}
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 z-[99]"
            onClick={() => setIsExpanded(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-card border border-border rounded-2xl shadow-2xl p-5 min-w-[320px] max-w-[90vw] max-h-[85vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="text-center mb-4">
              <h4 className="font-display font-bold text-base text-foreground">
                🌍 Regional Pricing
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Prices set individually for each region
              </p>
            </div>

            <div className="space-y-2">
              {rules
                .filter((r) => r.isEnabled)
                .map((r) => {
                  const regionCalc = calculateProductPrice(productData, r.countryCode);
                  const isCurrent = country === r.countryCode || currentRule.countryCode === r.countryCode;

                  return (
                    <button
                      key={r.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCountry(r.countryCode);
                        setIsExpanded(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                        isCurrent
                          ? "bg-primary/10 border-primary"
                          : "border-border/60 hover:bg-secondary/60 hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{r.flag}</span>
                        <div>
                          <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            {r.countryName}
                            {isCurrent && (
                              <span className="text-[10px] text-primary font-bold">● Active</span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {r.currency} ({r.currencySymbol})
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-foreground">
                          {regionCalc.formattedSale}
                        </span>
                        {regionCalc.minPriceEnforced && (
                          <div className="text-[9px] text-muted-foreground">Min. applied</div>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-border text-center">
              <p className="text-[11px] text-muted-foreground">
                Final payment will be securely processed in the local currency selected.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
