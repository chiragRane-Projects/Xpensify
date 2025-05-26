import FeaturesSection from "@/components/landingPage/FeaturesSection";
import Footer from "@/components/landingPage/Footer";
import HeroSection from "@/components/landingPage/HeroSection";

export default function Home() {
  return (
   <main className="overflow-hidden">
    <HeroSection/>
    <FeaturesSection/>
    <Footer/>
   </main>
  );
}
