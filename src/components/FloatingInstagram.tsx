import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig, getSocialConfig } from "@/data/siteConfig";

const FloatingInstagram = () => {
  const socials = getSocialConfig();
  const instagramUrl = socials.instagram || siteConfig.socials.instagram;

  return (
    <motion.a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full shadow-lg"
      aria-label="Contact us on Instagram"
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -10, 10, -5, 5, 0],
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          "0 10px 15px -3px rgba(168, 85, 247, 0.3)",
          "0 10px 25px -3px rgba(236, 72, 153, 0.4)",
          "0 10px 15px -3px rgba(168, 85, 247, 0.3)",
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 0.4,
        }
      }}
    >
      <Instagram className="w-7 h-7 text-white" />
    </motion.a>
  );
};

export default FloatingInstagram;
