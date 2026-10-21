import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { siteConfig } from "@/data/siteConfig";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">1. About Our Services</h2>
              <p>
                Welcome to {siteConfig.businessName}. We provide premium website templates for special occasions 
                including birthdays, anniversaries, proposals, and more. All purchases are processed via 
                WhatsApp with payment through Bank Alfalah, EasyPaisa, JazzCash (Pakistan) or international methods.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">2. Website Usage</h2>
              <p>
                By accessing this website, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the website for browsing, preview, and purchase purposes</li>
                <li>Not attempt to copy, reproduce, or redistribute our template designs without purchase</li>
                <li>Respect intellectual property rights on all displayed content</li>
                <li>Not engage in any activity that could harm the website or its users</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">3. Our Services</h2>
              <p>
                {siteConfig.businessName} offers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium website templates (Birthday, Anniversary, Proposal, Valentine's, and more)</li>
                <li>Full customization of colors, photos, music, and text</li>
                <li>24-48 hour delivery for templates</li>
                <li>Up to 3 days delivery for custom development work</li>
                <li>Ongoing support via WhatsApp</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">4. Payment Terms</h2>
              <p>
                We accept the following payment methods:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Pakistan:</strong> Bank Alfalah, EasyPaisa, JazzCash</li>
                <li><strong>International:</strong> Crypto (Binance), PhonePe, GPay, Paytm, Taptap Send, or PayPal</li>
              </ul>
              <p className="mt-3">
                After payment, send a screenshot to our{" "}
                <a 
                  href={siteConfig.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline"
                >
                  WhatsApp
                </a>{" "}
                for order confirmation and processing.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">5. Intellectual Property</h2>
              <p>
                All templates, designs, and content displayed on this website are the intellectual 
                property of {siteConfig.businessName}. Upon purchase, you receive a license to use 
                the template for personal use. Redistribution or resale is not permitted.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">6. Demo Previews</h2>
              <p>
                Template video previews are provided on YouTube and within this website. Demo content, 
                including placeholder text and images, are for demonstration and will be customized 
                with your personal content upon purchase.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">7. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting on this page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">8. Contact</h2>
              <p>
                For any questions regarding these terms or our services, please reach out to us on{" "}
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

export default TermsOfService;
