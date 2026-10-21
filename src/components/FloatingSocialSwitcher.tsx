import { useState, useEffect } from "react";
import { Instagram, Youtube, MessageCircle, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig, getSocialConfig } from "@/data/siteConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const PinterestIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.537.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

const FloatingSocialSwitcher = () => {
  const [socials, setSocials] = useState(getSocialConfig());
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleConfigUpdate = () => {
      setSocials(getSocialConfig());
    };
    window.addEventListener("erenn_config_updated", handleConfigUpdate);
    return () => window.removeEventListener("erenn_config_updated", handleConfigUpdate);
  }, []);

  const whatsappUrl = `https://wa.me/91${siteConfig.whatsappNumber}?text=Hi! I'm interested in your templates`;

  const socialItems = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      url: whatsappUrl,
      label: "Chat with us on WhatsApp",
      tooltip: "Chat on WhatsApp",
      bgClass: "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[#25D366]/30",
      icon: <WhatsAppIcon size={20} />,
    },
    {
      id: "instagram",
      name: "Instagram",
      url: socials.instagram || "https://www.instagram.com/erenncodes",
      label: "Follow us on Instagram",
      tooltip: "Follow on Instagram",
      bgClass: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white shadow-pink-500/30",
      icon: <Instagram className="w-5 h-5 text-white" />,
    },
    {
      id: "youtube",
      name: "YouTube",
      url: socials.youtube || "https://youtube.com/@erenncodes",
      label: "Watch on YouTube",
      tooltip: "Subscribe on YouTube",
      bgClass: "bg-[#FF0000] hover:bg-[#d90000] text-white shadow-red-600/30",
      icon: <Youtube className="w-5 h-5 text-white" />,
    },
    {
      id: "facebook",
      name: "Facebook",
      url: socials.facebook || "https://www.facebook.com/erenncodes",
      label: "Connect with us on Facebook",
      tooltip: "Follow on Facebook",
      bgClass: "bg-[#1877F2] hover:bg-[#0e65d9] text-white shadow-blue-600/30",
      icon: <FacebookIcon size={20} />,
    },
    {
      id: "pinterest",
      name: "Pinterest",
      url: socials.pinterest || "https://www.pinterest.com/erenncodes",
      label: "Discover on Pinterest",
      tooltip: "Follow on Pinterest",
      bgClass: "bg-[#E60023] hover:bg-[#c8001e] text-white shadow-rose-600/30",
      icon: <PinterestIcon size={20} />,
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <aside 
        aria-label="Social media links"
        className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-end gap-2"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-2 p-1.5 sm:p-2 rounded-full bg-card/90 backdrop-blur-md border border-border/80 shadow-2xl"
            >
              {socialItems.map((item, index) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <motion.a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-md transition-transform ${item.bgClass}`}
                    >
                      {item.icon}
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="font-medium text-xs">
                    {item.tooltip}
                  </TooltipContent>
                </Tooltip>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle / Hub button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse social media buttons" : "Expand social media buttons"}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary/90 hover:bg-secondary text-foreground border border-border shadow-md transition-all hover:scale-105 active:scale-95"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              ) : (
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {isExpanded ? "Minimize Socials" : "Open Social Media"}
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
};

export default FloatingSocialSwitcher;
