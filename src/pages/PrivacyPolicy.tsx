import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { siteConfig } from "@/data/siteConfig";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">1. About This Website</h2>
              <p>
                {siteConfig.businessName} is a marketplace showcasing our premium website templates 
                including Birthday, Anniversary, Proposal, and custom themes. We offer template purchases 
                through direct communication via WhatsApp.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">2. Information We Collect</h2>
              <p>
                We collect minimal information necessary to process your orders:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact details (when you message us on WhatsApp)</li>
                <li>Payment confirmation screenshots (for order verification)</li>
                <li>Customization preferences for your template</li>
              </ul>
              <p className="mt-3">
                We do not store credit card details or sensitive payment information. All payments are 
                processed through secure channels (Bank Alfalah, EasyPaisa, JazzCash for Pakistan; 
                Crypto/Binance, PhonePe, GPay, Paytm, Taptap Send, PayPal for international orders).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">3. How We Use Your Information</h2>
              <p>
                Information shared with us is used solely for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processing and delivering your template order</li>
                <li>Providing customer support via WhatsApp</li>
                <li>Customizing templates according to your requirements</li>
              </ul>
              <p className="mt-3">
                We never sell, share, or distribute your information to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">4. Payment Security</h2>
              <p>
                We accept payments through trusted Pakistani and international channels:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Pakistan:</strong> Bank Alfalah, EasyPaisa, JazzCash</li>
                <li><strong>International:</strong> Crypto (Binance), PhonePe, GPay, Paytm, Taptap Send, PayPal</li>
              </ul>
              <p className="mt-3">
                After payment, simply send a screenshot to our WhatsApp for order confirmation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">5. Third-Party Links</h2>
              <p>
                Our website contains links to external sites (Instagram, YouTube, TikTok, demo previews). 
                We are not responsible for the privacy practices of these external websites. 
                We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">6. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page 
                with an updated date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please reach out to us on{" "}
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
                </a>.
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

export default PrivacyPolicy;
