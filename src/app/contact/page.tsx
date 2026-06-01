import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ContactView from "@/components/public/ContactView";

export const metadata = {
  title: "Contact Us | Transit College",
  description:
    "Contact Transit College Sierra Leone admissions by phone, WhatsApp, or email. Get help with PINs, applications, and programme enquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <ContactView />
      </main>
      <Footer />
    </div>
  );
}
