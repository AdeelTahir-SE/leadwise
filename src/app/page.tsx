import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyLeadwise from "@/components/WhyLeadwise";
import HowItWorks from "@/components/HowItWorks";
import IcpMatchSection from "@/components/IcpMatchSection";
import InteractiveLeadFinder from "@/components/InteractiveLeadFinder";
import FeaturesGrid from "@/components/FeaturesGrid";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <WhyLeadwise />
        <HowItWorks />
        <IcpMatchSection />
        <InteractiveLeadFinder />
        <FeaturesGrid />
        <PricingSection />
        <Testimonials />
        <FAQSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
