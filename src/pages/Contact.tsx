import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { siteConfig } from "@/data/siteConfig";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Clock, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const whatsappUrl = `https://wa.me/91${siteConfig.whatsappNumber}?text=Hi! I have a question about your services`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      subject: formData.subject?.trim() || null,
      message: formData.message.trim(),
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // 1. Save to local storage for guaranteed Admin Panel inbox visibility
    try {
      const existing = JSON.parse(localStorage.getItem("erenn_contact_messages") || "[]");
      localStorage.setItem("erenn_contact_messages", JSON.stringify([newMsg, ...existing]));
      window.dispatchEvent(new Event("erenn_messages_updated"));
    } catch (e) {}

    // 2. Save to Supabase
    try {
      await supabase.from("contact_messages").insert({
        name: newMsg.name,
        email: newMsg.email,
        phone: newMsg.phone,
        subject: newMsg.subject,
        message: newMsg.message,
      });
    } catch (err) {}

    toast.success("Message sent! We'll get back to you soon 💕");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              Get In Touch
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our website templates? Want a custom design? We'd love to hear from you! Reach out through any of the channels below.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-display text-xl font-bold mb-4">Reach Us Directly</h2>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-green-500/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">WhatsApp (Preferred)</h3>
                  <p className="text-sm text-muted-foreground">+91 9341736374</p>
                  <p className="text-xs text-green-500 mt-1">Fastest way to reach us — tap to chat!</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Social Media</h3>
                  <p className="text-sm text-muted-foreground">Instagram: @erencodes</p>
                  <p className="text-sm text-muted-foreground">TikTok: @erencodes</p>
                  <p className="text-sm text-muted-foreground">YouTube: ErenCodes</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Response Time</h3>
                  <p className="text-sm text-muted-foreground">WhatsApp: Usually within minutes</p>
                  <p className="text-sm text-muted-foreground">Contact form: Within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-sm text-muted-foreground">Pakistan 🇵🇰</p>
                  <p className="text-sm text-muted-foreground">Serving customers worldwide 🌍</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">
                        Name <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">
                        Email <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="text-sm font-medium text-foreground mb-1.5 block">
                        Phone (Optional)
                      </label>
                      <Input
                        id="phone"
                        placeholder="+92 xxx xxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="text-sm font-medium text-foreground mb-1.5 block">
                        Subject (Optional)
                      </label>
                      <Input
                        id="subject"
                        placeholder="e.g. Birthday template inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 block">
                      Message <span className="text-primary">*</span>
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your requirements, occasion, or any questions you have..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    For faster response, message us on{" "}
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                      WhatsApp
                    </a>
                    . We typically respond within minutes!
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Contact;
