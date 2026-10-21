import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartButtonProps {
  onClick: () => void;
}

const HeartButton = ({ onClick }: HeartButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative group px-8 py-4 rounded-full font-semibold text-lg overflow-hidden pulse-glow"
      style={{
        background: "linear-gradient(90deg, hsl(340 82% 55%), hsl(350 80% 60%), hsl(340 82% 55%))",
        backgroundSize: "200% 100%",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        backgroundPosition: ["0% center", "200% center"],
      }}
      transition={{
        backgroundPosition: {
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        },
      }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <span className="relative flex items-center gap-2 text-primary-foreground">
        Open My Heart
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Heart className="w-5 h-5" fill="currentColor" />
        </motion.span>
      </span>
    </motion.button>
  );
};

export default HeartButton;