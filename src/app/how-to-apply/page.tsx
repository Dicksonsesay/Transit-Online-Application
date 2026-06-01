import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HowToApplyView from "@/components/public/HowToApplyView";

export const metadata = {
  title: "How to Apply | Transit College",
  description:
    "Step-by-step guide to applying online at Transit College Sierra Leone—bank payment, PIN verification, registration, and application submission.",
};

export default function HowToApplyPage() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HowToApplyView />
      </main>
      <Footer />
    </div>
  );
}
