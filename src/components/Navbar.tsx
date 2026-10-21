import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/siteConfig";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import logo from "@/assets/logo-new.png";
import { useLiveCustomerCount } from "@/lib/customerStats";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useLiveCustomerCount();

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Banner - Live synchronized with completed orders */}
      <div className="bg-secondary/70 border-b border-border py-1.5 px-4 text-center text-xs sm:text-sm font-medium">
        <div className="container mx-auto flex items-center justify-center gap-2 flex-wrap">
          <div className="flex items-center text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-semibold text-foreground">4.9/5</span>
          <span className="text-muted-foreground/60">·</span>
          <span className="text-muted-foreground">
            Trusted by <strong className="text-primary font-bold">{count}</strong> happy customers worldwide
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <img src={logo} alt="Eren Codes Logo" className="h-9 sm:h-12 w-auto" />
              <span className="font-display text-base sm:text-xl font-bold text-foreground">Erenn</span>
            </Link>

            {/* Desktop Links - Centered */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button + Currency */}
            <div className="hidden md:flex items-center gap-3">
              <CurrencySwitcher variant="prominent" />
              <Button variant="red" onClick={() => navigate("/products")}>
                Explore Templates
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-1">
              <CurrencySwitcher variant="prominent" />
              <button
                className="p-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-card border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button className="w-full mt-4" onClick={() => {
                setIsOpen(false);
                navigate("/products");
              }}>
                Explore Templates
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
