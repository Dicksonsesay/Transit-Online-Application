import Header from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[var(--hero-blue)] px-4 py-2">
        {children}
      </main>
    </div>
  );
}
