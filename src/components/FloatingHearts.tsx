import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const FloatingHearts = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    size: 12 + Math.random() * 16,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0 text-primary/40"
          style={{ left: `${heart.left}%` }}
          initial={{ y: 100, opacity: 0, rotate: 0 }}
          animate={{
            y: "-100vh",
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart
            size={heart.size}
            fill="currentColor"
            className="drop-shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;