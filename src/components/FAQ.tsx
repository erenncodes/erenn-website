import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import FAQSchema from "@/components/seo/FAQSchema";

const faqs = [
  {
    question: "How do I order?",
    answer: "Ordering is simple. Browse the template gallery, open the one you love, and hit Order Now — you can either take it as shown in the preview or personalise it through our short form. We'll pick things up on WhatsApp from there. ✨"
  },
  {
    question: "What do I get for the default price?",
    answer: "You get the exact website shown in the preview — identical design, colours, theme, images, music and layout. It's the polished, ready-to-share version, delivered straight to your inbox on WhatsApp. 🎯"
  },
  {
    question: "Can you customize it for me?",
    answer: "Absolutely. Colours, photos, music, names, messages, layouts — everything is fully personalisable. Share what you have in mind on WhatsApp and we'll tailor the whole experience to your story. 💌"
  },
  {
    question: "How fast will I get my website?",
    answer: "Most orders are delivered within 24–48 hours. Deeply customised projects may take up to 3 days. You'll get progress updates on WhatsApp the whole way through. ⚡"
  },
  {
    question: "Will it work on mobile?",
    answer: "Yes — every Erenn template is fully responsive and looks stunning on phones, tablets and desktops. 📱"
  },
  {
    question: "What if I need help later?",
    answer: "We're always a message away on WhatsApp. Small tweaks during the build, questions about your link, sharing tips — just ping us any time. ✨"
  },
  {
    question: "What payment methods do you accept?",
    answer: "For India we accept PhonePe, GPay and Paytm. International customers can pay via PayPal, Taptap Send or Binance (crypto). Pakistan-based customers can use Bank Alfalah, EasyPaisa or JazzCash. Full details are shared on WhatsApp once you're ready to confirm. 💳"
  },
  {
    question: "Can I share the finished website with anyone?",
    answer: "Yes — you receive a private, shareable link that works on any device, anywhere in the world. Send it via WhatsApp, Instagram, email — wherever your special someone is. 🌍"
  },
  {
    question: "Do you build fully custom websites from scratch?",
    answer: "We do. Beyond the gallery, we design bespoke celebration websites for proposals, milestone birthdays, wedding announcements and more. Message us with your idea and we'll craft something entirely one-of-a-kind. 🎨"
  },
];

const FAQ = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20" id="faq">
      <FAQSchema faqs={faqs} />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              Got Questions?
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Everything you need to know about our beautiful website templates and services. ✨
            </p>
          </motion.div>

          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-lg sm:rounded-xl px-4 sm:px-6"
                  >
                    <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:text-primary py-3 sm:py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-3 sm:pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
