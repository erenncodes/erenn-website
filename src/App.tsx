import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ColorPaletteProvider } from "@/hooks/useColorPalette";
import { CurrencyProvider } from "@/hooks/useCurrency";

import OrganizationSchema from "@/components/seo/OrganizationSchema";
import SplashScreen from "@/components/SplashScreen";
import FloatingSocialSwitcher from "@/components/FloatingSocialSwitcher";
import CountrySelectorModal from "@/components/CountrySelectorModal";
import Index from "./pages/Index";

// Hash listener to support https://yourdomain.com/#admin access
const AdminHashRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#admin" || hash.startsWith("#admin/")) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        navigate("/admin");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [navigate]);

  return null;
};

// Lazy load non-critical routes
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const DemoPreview = lazy(() => import("./pages/DemoPreview"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
      setHasShownSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasShownSplash(true);
    sessionStorage.setItem("splashShown", "true");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="eren-codes-theme">
        <ColorPaletteProvider>
          <CurrencyProvider>
            <AuthProvider>
              <TooltipProvider>
                {showSplash && !hasShownSplash && (
                  <SplashScreen onComplete={handleSplashComplete} />
                )}
                <OrganizationSchema />
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AdminHashRedirect />
                  <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/demo-preview/:id" element={<DemoPreview />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/refund-policy" element={<RefundPolicy />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
                <FloatingSocialSwitcher />
                <CountrySelectorModal />
              </TooltipProvider>
            </AuthProvider>
          </CurrencyProvider>
        </ColorPaletteProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
