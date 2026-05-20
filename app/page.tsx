import Hero from "@/components/sections/Hero";
import Navbar from "@/components/sections/Navbar";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Preview from "@/components/sections/Preview";
import Footer from "@/components/sections/Footer";
export default function HomePage() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Preview />
      <Footer />
    </div>
  );
}