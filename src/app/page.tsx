import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HomeFeaturesSection from "@/components/HomeFeaturesSection";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <main className="relative z-0 flex flex-1 flex-col">
        <HeroSection />
        <HomeFeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
