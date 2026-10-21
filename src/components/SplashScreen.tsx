import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-new.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    const failsafe = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, [onComplete]);

  const handleAnimationComplete = () => {
    onComplete();
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/20 via-transparent to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Dot pattern overlay */}
          <div className="absolute inset-0 dot-pattern opacity-30" />

          {/* Content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Logo with animations */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
            >
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0.4] }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  times: [0, 0.5, 1],
                }}
                style={{
                  boxShadow: "0 0 60px 20px hsl(var(--primary) / 0.4)",
                }}
              />
              
              {/* Logo image */}
              <motion.img
                src={logo}
                alt="Erenn"
                className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />

              {/* Orbiting dots */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-accent"
                  style={{
                    top: "50%",
                    left: "50%",
                    marginTop: "-6px",
                    marginLeft: "-6px",
                  }}
                  animate={{
                    x: [0, Math.cos((i * 120 * Math.PI) / 180) * 80],
                    y: [0, Math.sin((i * 120 * Math.PI) / 180) * 80],
                    scale: [0, 1, 0.8],
                    opacity: [0, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.8 + i * 0.15,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>

            {/* Brand name with letter animation */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="flex items-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex">
                  {"Erenn".split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      className="font-display text-3xl md:text-4xl font-bold text-foreground"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.8 + i * 0.05,
                      }}
                      style={{
                        display: "inline-block",
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Tagline */}
              <motion.p
                className="text-muted-foreground text-sm md:text-base tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                Crafting Digital Experiences
              </motion.p>
            </div>

            {/* Loading indicator */}
            <motion.div
              className="flex gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
