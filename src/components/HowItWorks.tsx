import { MousePointerClick, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLiveCustomerCount } from "@/lib/customerStats";

const steps = [
  {
    icon: MousePointerClick,
    step: "1",
    title: "Choose Template",
    description: "Browse our collection and pick the one you love"
  },
  {
    icon: MessageCircle,
    step: "2", 
    title: "Message on WhatsApp",
    description: "Tell me what you need - I'll handle the rest"
  },
  {
    icon: Sparkles,
    step: "3",
    title: "Get Your Website",
    description: "Receive your custom website in 24-48 hours"
  }
];

const HowItWorks = () => {
  const { count } = useLiveCustomerCount();

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-secondary/30 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
            Getting your dream website is easier than you think! 🚀
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {step.step}
              </div>
              
              {/* Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 mt-4">
                <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {step.description}
              </p>

              {/* Arrow connector (hidden on mobile, shown between items on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary/40">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/10 border border-green-500/30 rounded-full text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
            ✅ {count > 10 ? `${count}+` : count} Happy Customers
          </span>
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-primary">
            ⚡ 24-48h Delivery
          </span>
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 border border-accent/30 rounded-full text-xs sm:text-sm font-medium text-accent">
            📱 Mobile Friendly
          </span>
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-xs sm:text-sm font-medium text-rose-500">
            🎨 Fully Customizable
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
