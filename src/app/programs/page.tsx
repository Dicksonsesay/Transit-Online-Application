import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProgramsView from "@/components/public/ProgramsView";

export const metadata = {
  title: "Programmes | Transit College",
  description:
    "Degree programmes affiliated with Njala University and TEVET/NCTVA pathways—diplomas, HND, teacher certificates, and certificates—offered at Transit College Sierra Leone.",
};

export default function ProgramsPage() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <ProgramsView />
      </main>
      <Footer />
    </div>
  );
}
