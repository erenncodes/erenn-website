import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LatestTemplates from "@/components/LatestTemplates";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import WebsiteSchema from "@/components/seo/WebsiteSchema";
import ServiceSchema from "@/components/seo/ServiceSchema";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* SEO Schema Markup */}
      <OrganizationSchema />
      <WebsiteSchema />
      <ServiceSchema />
      <LocalBusinessSchema />
      
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <LatestTemplates />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
