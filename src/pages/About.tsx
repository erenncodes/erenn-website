import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { siteConfig } from "@/data/siteConfig";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users, Zap, Globe, MessageCircle, Star, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLiveCustomerCount } from "@/lib/customerStats";

const About = () => {
  const { count } = useLiveCustomerCount();
  const whatsappUrl = `https://wa.me/91${siteConfig.whatsappNumber}?text=Hi! I'd love to know more about your services`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              About Us
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              The Story Behind{" "}
              <span className="gradient-text">{siteConfig.businessName}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We create personalized websites that turn your special moments into unforgettable digital experiences. Every template is crafted with love, creativity, and attention to detail.
            </p>
          </motion.div>

          {/* Our Story */}
          <motion.section
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-3">
                <Heart className="w-7 h-7 text-primary" />
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {siteConfig.businessName} was born from a simple idea: everyone deserves the chance to make their loved ones feel truly special. Whether it's a birthday surprise, a heartfelt anniversary message, a romantic love proposal, or a festive Ramadan greeting — we believe a personalized website can say it all in the most beautiful way possible.
                </p>
                <p>
                  Founded by Eren, a passionate web developer and designer from Pakistan, {siteConfig.businessName} started as a creative side project and quickly grew into a full-fledged template marketplace serving customers across Pakistan, India, and beyond. What makes us different? We don't just sell templates — we create beautiful moments online.
                </p>
                <p>
                  Every single template in our collection is hand-crafted with stunning animations, responsive layouts, and thoughtful design details. From the smooth transitions to the carefully chosen color palettes, every element is designed to evoke emotion and create lasting memories.
                </p>
              </div>
            </div>
          </motion.section>

          {/* What We Offer */}
          <motion.section
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-center">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  icon: Heart,
                  title: "Birthday & Anniversary Websites",
                  desc: "Surprise your loved ones with a stunning personalized website featuring their photos, messages, and beautiful animations. Perfect for birthdays, anniversaries, and milestone celebrations."
                },
                {
                  icon: Sparkles,
                  title: "Love Proposal & Valentine's Templates",
                  desc: "Make your romantic gesture truly unforgettable with our specially designed proposal and Valentine's Day websites. Beautiful designs that capture the essence of love and devotion."
                },
                {
                  icon: Globe,
                  title: "Festival & Occasion Templates",
                  desc: "Celebrate festivals like Ramadan, Holi, and other special occasions with our themed templates. Each design captures the spirit and joy of the celebration perfectly."
                },
                {
                  icon: Code,
                  title: "Custom Web Development",
                  desc: "Need something unique? We offer fully custom website development tailored to your exact requirements. From design to deployment, we handle everything for you."
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="bg-card border border-border rounded-xl p-5 sm:p-6 hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Why Choose Us */}
          <motion.section
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-center">
              Why Choose {siteConfig.businessName}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Zap,
                  title: "Fast Delivery",
                  desc: "Most templates are delivered within 24-48 hours. Custom projects take up to 3 days. We keep you updated throughout the process via WhatsApp."
                },
                {
                  icon: Users,
                  title: `${count > 10 ? `${count}+` : count} Happy Customers`,
                  desc: `We've served over ${count} happy customers across Pakistan, India, and internationally. Our reviews speak for themselves — quality and satisfaction guaranteed.`
                },
                {
                  icon: Star,
                  title: "Affordable Pricing",
                  desc: "Premium quality doesn't have to break the bank. Our templates start from as low as ₹124, with some even available completely free. We believe everyone deserves beautiful designs."
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="text-center p-5 sm:p-6 bg-card border border-border rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Our Process */}
          <motion.section
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
                How We Work
              </h2>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Browse & Choose", desc: "Explore our collection of beautifully designed website templates. Watch the YouTube preview videos to see each template in action. Every template showcases smooth animations, responsive design, and stunning visuals." },
                  { step: "2", title: "Get in Touch", desc: "Once you've found a template you love, message us on WhatsApp. Tell us about your occasion, share your requirements, and we'll discuss pricing and customization options. We're friendly and here to help!" },
                  { step: "3", title: "Make Payment", desc: "Choose from our flexible payment options — Bank Alfalah, EasyPaisa, JazzCash for Pakistan, or Crypto, UPI apps, PayPal for international customers. Send your payment screenshot for instant confirmation." },
                  { step: "4", title: "Receive Your Website", desc: "Sit back and relax! We'll customize your template with your personal content — photos, messages, music, and more. Your unique website link will be ready within 24-48 hours, perfect for sharing with your special someone." }
                ].map((item, index) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Ready to Create Something Beautiful?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Browse our templates, pick your favorite, and let's make your special moment unforgettable. We're just a WhatsApp message away! 💕
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <Link to="/products">Browse Templates</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default About;
