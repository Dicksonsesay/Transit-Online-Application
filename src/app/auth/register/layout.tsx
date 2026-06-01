export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full max-h-full w-full items-center justify-center overflow-hidden py-1">
      {children}
    </div>
  );
}
