import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RequirementsView from "@/components/public/RequirementsView";

export const metadata = {
  title: "Requirements | Transit College",
  description:
    "Admission requirements for Transit College Sierra Leone—academic qualifications, documents, and eligibility for Njala University degrees and TEVET/NCTVA programmes.",
};

export default function RequirementsPage() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <RequirementsView />
      </main>
      <Footer />
    </div>
  );
}
