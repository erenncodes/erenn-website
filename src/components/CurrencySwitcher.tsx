import { useCurrency } from "@/hooks/useCurrency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Globe, RefreshCw, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  variant?: "default" | "prominent";
}

const CurrencySwitcher = ({ variant = "default" }: CurrencySwitcherProps) => {
  const {
    country,
    currentRule,
    setCountry,
    rules,
    detectedCountry,
    isLoading,
    isCountryChangeLocked,
  } = useCurrency();

  const activeRules = rules.filter((r) => r.isEnabled);

  // When visitor is locked to their auto-detected country, render a locked verified pill
  if (isCountryChangeLocked) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 transition-all rounded-full border text-xs font-medium cursor-pointer shadow-sm select-none",
              variant === "prominent"
                ? "h-9 px-3 bg-primary/10 border-primary/30 hover:bg-primary/15 hover:border-primary/50 text-foreground"
                : "h-8 px-2.5 bg-background/60 border-border/60 hover:bg-secondary text-foreground"
            )}
            title={`Region automatically detected as ${currentRule.countryName}. Click for details.`}
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <span className="text-base">{currentRule.flag}</span>
                <span className="font-bold text-primary">{currentRule.currencySymbol}</span>
                <span className="font-semibold text-xs">{currentRule.currency}</span>
                <span className="text-[10px] px-1 py-0.2 rounded-full bg-primary/20 text-primary font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentRule.countryCode}</span>
                </span>
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 text-xs space-y-2" align="end">
          <div className="flex items-center gap-2 font-semibold text-foreground border-b pb-2">
            <span className="text-xl">{currentRule.flag}</span>
            <div>
              <div className="text-sm">{currentRule.countryName}</div>
              <div className="text-[11px] text-muted-foreground font-normal">
                {currentRule.currency} ({currentRule.currencySymbol})
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground pt-1">
            <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Pricing and currency are securely auto-detected and locked to your location (<strong>{currentRule.countryName}</strong>) to prevent region tampering.
            </span>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // When manual switching is enabled in Admin settings
  if (variant === "prominent") {
    return (
      <div className="flex items-center gap-1">
        <Select value={country} onValueChange={(val) => setCountry(val)}>
          <SelectTrigger
            className={cn(
              "h-9 text-xs sm:text-sm font-medium border-2 transition-all rounded-full",
              "bg-primary/10 border-primary/30 hover:border-primary/50",
              "focus:ring-2 focus:ring-primary/20",
              "min-w-[110px]"
            )}
          >
            <SelectValue>
              <span className="flex items-center gap-1.5">
                <span className="text-base">{currentRule.flag}</span>
                <span className="font-bold">{currentRule.currencySymbol}</span>
                <span className="font-semibold text-xs">{currentRule.currency}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="min-w-[220px] max-h-80">
            <div className="px-3 py-1.5 text-[11px] text-muted-foreground border-b mb-1 flex items-center justify-between">
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Detecting location...
                </span>
              ) : detectedCountry ? (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-primary" />
                  Detected: <strong>{detectedCountry}</strong>
                </span>
              ) : (
                "Select Region & Currency"
              )}
            </div>

            {activeRules.map((r) => (
              <SelectItem key={r.id} value={r.countryCode} className="text-xs py-2">
                <span className="flex items-center justify-between w-full gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-base">{r.flag}</span>
                    <span className="font-medium">{r.countryName}</span>
                  </span>
                  <span className="font-bold text-primary">
                    {r.currencySymbol} {r.currency}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Select value={country} onValueChange={(val) => setCountry(val)}>
      <SelectTrigger className="w-[100px] h-8 text-xs bg-background/50 border-border/50">
        <SelectValue>
          <span className="flex items-center gap-1.5">
            <span>{currentRule.flag}</span>
            <span className="font-semibold">{currentRule.currencySymbol}</span>
            <span>{currentRule.currency}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {activeRules.map((r) => (
          <SelectItem key={r.id} value={r.countryCode} className="text-xs">
            <span className="flex items-center gap-2">
              <span>{r.flag}</span>
              <span className="font-semibold">{r.currencySymbol}</span>
              <span>{r.currency}</span>
              <span className="text-muted-foreground text-[10px]">- {r.countryName}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySwitcher;
