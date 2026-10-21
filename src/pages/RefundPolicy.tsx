import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { siteConfig } from "@/data/siteConfig";
import { Info } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-8">Refund & Service Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            {/* Important Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex gap-4">
              <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  Satisfaction Guaranteed
                </h3>
                <p className="text-foreground/80">
                  We're committed to delivering exactly what you expect. All templates are customized 
                  to your requirements before final delivery. We work with you until you're happy! 💕
                </p>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">How It Works</h2>
              <p>
                Our simple ordering process:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browse and preview our template collection on this website</li>
                <li>Watch YouTube video previews to see templates in action</li>
                <li>Contact us on WhatsApp to discuss your requirements</li>
                <li>Make payment via Bank Alfalah, EasyPaisa, JazzCash (Pakistan) or Crypto, UPI apps, Taptap Send, PayPal (International)</li>
                <li>Send payment screenshot to WhatsApp for confirmation</li>
                <li>Receive your customized template within 24-48 hours</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Payment Methods</h2>
              <p>
                We accept multiple secure payment options:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Pakistan:</strong> Bank Alfalah, EasyPaisa, JazzCash</li>
                <li><strong>International:</strong> Crypto (Binance), PhonePe, GPay, Paytm, Taptap Send, or PayPal</li>
              </ul>
              <p className="mt-3 text-sm">
                Message us on WhatsApp for account details! 💬
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Refund Policy</h2>
              <p>
                Due to the digital and customized nature of our products:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds are available before work begins on your order</li>
                <li>Once customization has started, refunds are not possible</li>
                <li>We offer unlimited revisions until you're satisfied with your template</li>
                <li>If we cannot deliver as promised, a full refund will be provided</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Our Commitment</h2>
              <p>
                When you work with us, we are committed to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clear communication about pricing and deliverables</li>
                <li>Professional customization of your chosen template</li>
                <li>24-48 hour delivery for templates, up to 3 days for custom work</li>
                <li>Unlimited revisions until you're happy</li>
                <li>Ongoing support via WhatsApp</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Before You Order</h2>
              <p>
                We encourage you to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Watch all YouTube video previews carefully</li>
                <li>Read template descriptions and features</li>
                <li>Ask all your questions on WhatsApp before paying</li>
                <li>Discuss your specific customization needs</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">Contact Us</h2>
              <p>
                Ready to get started or have questions? Reach out to us on{" "}
                <a 
                  href={siteConfig.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline"
                >
                  WhatsApp
                </a>{" "}
                or{" "}
                <a 
                  href={siteConfig.socials.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Instagram
                </a>{" "}
                and let's create something beautiful for your special occasion! 💕
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default RefundPolicy;
