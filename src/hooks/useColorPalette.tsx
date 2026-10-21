import { createContext, useContext, useEffect, useState } from "react";

export type ColorPalette = "cyan" | "purple" | "rose" | "orange" | "green" | "blue";

type ColorPaletteContextType = {
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;
};

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined);

const paletteColors: Record<ColorPalette, { light: Record<string, string>; dark: Record<string, string> }> = {
  cyan: {
    light: {
      "--accent": "184 74% 45%",
      "--accent-foreground": "0 0% 100%",
      "--ring": "184 74% 45%",
      "--cyan": "184 74% 45%",
      "--cyan-glow": "184 80% 55%",
      "--red": "184 74% 45%",
      "--red-glow": "184 80% 55%",
    },
    dark: {
      "--accent": "184 74% 65%",
      "--accent-foreground": "222 47% 6%",
      "--ring": "184 74% 65%",
      "--cyan": "184 74% 65%",
      "--cyan-glow": "184 80% 75%",
      "--red": "184 74% 65%",
      "--red-glow": "184 80% 75%",
    },
  },
  purple: {
    light: {
      "--accent": "262 83% 58%",
      "--accent-foreground": "0 0% 100%",
      "--ring": "262 83% 58%",
      "--cyan": "262 83% 58%",
      "--cyan-glow": "262 90% 68%",
      "--red": "262 83% 58%",
      "--red-glow": "262 90% 68%",
    },
    dark: {
      "--accent": "262 83% 68%",
      "--accent-foreground": "222 47% 6%",
      "--ring": "262 83% 68%",
      "--cyan": "262 83% 68%",
      "--cyan-glow": "262 90% 78%",
      "--red": "262 83% 68%",
      "--red-glow": "262 90% 78%",
    },
  },
  rose: {
    light: {
      "--accent": "346 77% 50%",
      "--accent-foreground": "0 0% 100%",
      "--ring": "346 77% 50%",
      "--cyan": "346 77% 50%",
      "--cyan-glow": "346 85% 60%",
      "--red": "346 77% 50%",
      "--red-glow": "346 85% 60%",
    },
    dark: {
      "--accent": "346 77% 60%",
      "--accent-foreground": "222 47% 6%",
      "--ring": "346 77% 60%",
      "--cyan": "346 77% 60%",
      "--cyan-glow": "346 85% 70%",
      "--red": "346 77% 60%",
      "--red-glow": "346 85% 70%",
    },
  },
  orange: {
    light: {
      "--accent": "25 95% 53%",
      "--accent-foreground": "0 0% 100%",
      "--ring": "25 95% 53%",
      "--cyan": "25 95% 53%",
      "--cyan-glow": "25 98% 63%",
      "--red": "25 95% 53%",
      "--red-glow": "25 98% 63%",
    },
    dark: {
      "--accent": "25 95% 63%",
      "--accent-foreground": "222 47% 6%",
      "--ring": "25 95% 63%",
      "--cyan": "25 95% 63%",
      "--cyan-glow": "25 98% 73%",
      "--red": "25 95% 63%",
      "--red-glow": "25 98% 73%",
    },
  },
  green: {
    light: {
      "--accent": "142 76% 36%",
      "--accent-foreground": "0 0% 100%",
      "--ring": "142 76% 36%",
      "--cyan": "142 76% 36%",
      "--cyan-glow": "142 80% 46%",
      "--red": "142 76% 36%",
      "--red-glow": "142 80% 46%",
    },
    dark: {
      "--accent": "142 76% 50%",
      "--accent-foreground": "222 47% 6%",
      "--ring": "142 76% 50%",
      "--cyan": "142 76% 50%",
      "--cyan-glow": "142 80% 60%",
      "--red": "142 76% 50%",
      "--red-glow": "142 80% 60%",
    },
  },
  blue: {
    light: {
      "--accent": "217 91% 50%",
      "--accent-foreground": "0 0% 100%",
      "--ring": "217 91% 50%",
      "--cyan": "217 91% 50%",
      "--cyan-glow": "217 95% 60%",
      "--red": "217 91% 50%",
      "--red-glow": "217 95% 60%",
    },
    dark: {
      "--accent": "217 91% 60%",
      "--accent-foreground": "222 47% 6%",
      "--ring": "217 91% 60%",
      "--cyan": "217 91% 60%",
      "--cyan-glow": "217 95% 70%",
      "--red": "217 91% 60%",
      "--red-glow": "217 95% 70%",
    },
  },
};

export function ColorPaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<ColorPalette>(() => {
    const stored = localStorage.getItem("eren-codes-palette");
    return (stored as ColorPalette) || "cyan";
  });

  const applyPalette = (newPalette: ColorPalette) => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const colors = isDark ? paletteColors[newPalette].dark : paletteColors[newPalette].light;

    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  useEffect(() => {
    applyPalette(palette);
  }, [palette]);

  // Re-apply palette when theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          applyPalette(palette);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [palette]);

  const setPalette = (newPalette: ColorPalette) => {
    localStorage.setItem("eren-codes-palette", newPalette);
    setPaletteState(newPalette);
  };

  return (
    <ColorPaletteContext.Provider value={{ palette, setPalette }}>
      {children}
    </ColorPaletteContext.Provider>
  );
}

export function useColorPalette() {
  const context = useContext(ColorPaletteContext);
  if (!context) {
    throw new Error("useColorPalette must be used within a ColorPaletteProvider");
  }
  return context;
}
