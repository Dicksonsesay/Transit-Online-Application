import Header from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto bg-[var(--hero-blue)] px-4 py-4">
        <div className="mx-auto flex w-full max-w-md justify-center py-2 sm:py-4">
          {children}
        </div>
      </main>
    </div>
  );
}
