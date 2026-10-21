import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  end: number | string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Parse the end value - handle strings like "100+" or "24/7"
  const numericEnd = typeof end === "string" 
    ? parseInt(end.replace(/[^0-9]/g, "")) || 0
    : end;
  
  const displaySuffix = typeof end === "string" 
    ? end.replace(/[0-9]/g, "") 
    : suffix;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCount();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, numericEnd]);

  const animateCount = () => {
    const startTime = performance.now();
    
    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * numericEnd);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(numericEnd);
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  return (
    <span ref={ref}>
      {prefix}{count}{displaySuffix}
    </span>
  );
};

export default AnimatedCounter;
