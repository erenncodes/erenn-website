import { useEffect, useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Globe, Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "erenn_country_modal_dismissed";

const CountrySelectorModal = () => {
  const { country, setCountry, rules, detectedCountry, isCountryChangeLocked } = useCurrency();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // When visitors are locked to their auto-detected country, do not show the modal
    if (isCountryChangeLocked) {
      setOpen(false);
      return;
    }

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Auto prompt on first visit after a slight delay
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isCountryChangeLocked]);

  // If visitor country change is locked, never render selector modal
  if (isCountryChangeLocked) return null;

  const handleSelect = (countryCode: string) => {
    setCountry(countryCode);
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const activeRules = rules.filter((r) => r.isEnabled);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) localStorage.setItem(STORAGE_KEY, "1");
        setOpen(v);
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <Globe className="w-5 h-5 text-primary" />
            Where are you shopping from?
          </DialogTitle>
          <DialogDescription className="text-xs">
            {detectedCountry ? (
              <span>
                We detected your location as <strong>{detectedCountry}</strong>. Pick your region to view tailored pricing and payment methods.
              </span>
            ) : (
              "Select your country or region to see prices in your local currency. You can adjust this anytime."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 mt-3 overflow-y-auto pr-1 max-h-[50vh]">
          {activeRules.map((r) => {
            const active = country === r.countryCode;
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r.countryCode)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left",
                  active
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-secondary/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.flag}</span>
                  <div>
                    <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      {r.countryName}
                      {detectedCountry === r.countryCode && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary font-medium">
                          Detected
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.currency} ({r.currencySymbol}) {r.isInternational ? "• International" : "• Domestic"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-primary">{r.currencySymbol}</span>
                  {active && <Check className="w-4 h-4 text-primary" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Regional pricing applied
          </span>
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "1");
              setOpen(false);
            }}
            className="text-primary hover:underline font-medium"
          >
            Continue with {country}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountrySelectorModal;
