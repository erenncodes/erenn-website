import { ArrowRight, Sparkles, Code, Palette, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { siteConfig, getPromoBannerConfig } from "@/data/siteConfig";
import { useRef, useState, useEffect } from "react";
import AnimatedCounter from "@/components/AnimatedCounter";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [promoConfig, setPromoConfig] = useState(getPromoBannerConfig());

  useEffect(() => {
    const handleConfigUpdate = () => {
      setPromoConfig(getPromoBannerConfig());
    };
    window.addEventListener("erenn_config_updated", handleConfigUpdate);
    return () => window.removeEventListener("erenn_config_updated", handleConfigUpdate);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const orb1X = useTransform(mouseXSpring, [-500, 500], [-30, 30]);
  const orb1Y = useTransform(mouseYSpring, [-500, 500], [-20, 20]);
  const orb2X = useTransform(mouseXSpring, [-500, 500], [25, -25]);
  const orb2Y = useTransform(mouseYSpring, [-500, 500], [15, -15]);
  const orb3X = useTransform(mouseXSpring, [-500, 500], [-15, 15]);
  const orb3Y = useTransform(mouseYSpring, [-500, 500], [-25, 25]);
  const orb4X = useTransform(mouseXSpring, [-500, 500], [20, -20]);
  const orb4Y = useTransform(mouseYSpring, [-500, 500], [10, -10]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const orbScrollY1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const orbScrollY2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbScrollX1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const orbScrollX2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const patternY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const orbScrollY3 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const orbScrollY4 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section ref={sectionRef} className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden py-8 sm:py-12 lg:py-0 z-0">
      <motion.div className="absolute inset-0 dot-pattern opacity-50" style={{ y: patternY }} />

      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"
        style={{ y: orbScrollY1, x: orbScrollX1, translateX: orb1X, translateY: orb1Y }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse"
        style={{ y: orbScrollY2, x: orbScrollX2, translateX: orb2X, translateY: orb2Y }}
      />
      <motion.div
        className="absolute top-1/2 left-[15%] w-64 h-64 bg-primary/10 rounded-full blur-[100px]"
        style={{ y: orbScrollY3, translateX: orb3X, translateY: orb3Y }}
      />
      <motion.div
        className="absolute top-1/3 right-[15%] w-48 h-48 bg-violet-500/15 rounded-full blur-[80px]"
        style={{ y: orbScrollY4, translateX: orb4X, translateY: orb4Y }}
      />

      <motion.div className="container mx-auto px-4 relative z-10" style={{ y: contentY }}>
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30 mb-8 shadow-lg shadow-primary/10 animate-pulse"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{promoConfig.badgeText}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Turn Every Moment into a{" "}
            <span className="gradient-text">Stunning Website</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Gift a personalized website they'll never forget — birthdays, anniversaries, proposals & more.
            Handcrafted designs, delivered in 24–48 hours. ✨
            <span className="block mt-2 text-primary font-semibold text-sm sm:text-base">🔥 Limited Offer: Flat {promoConfig.discountPercent}% OFF on all designs!</span>
          </motion.p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10 text-xs sm:text-sm text-muted-foreground px-2">
            <span className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-secondary/50 rounded-full">
              <Code className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              Built from Scratch
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-secondary/50 rounded-full">
              <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              One-of-a-Kind Designs
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-secondary/50 rounded-full">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              24–48hr Delivery
            </span>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              size="lg"
              className="text-lg px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30"
              onClick={() => navigate("/products")}
            >
              Explore Templates
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
