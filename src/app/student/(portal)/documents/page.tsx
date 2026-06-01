import PagePlaceholder from "@/components/PagePlaceholder";

export default function DocumentsPage() {
  return (
    <PagePlaceholder
      title="Upload Documents"
      description="Upload WAEC results, passport photo, and other required files."
      backHref="/student"
      backLabel="Back to dashboard"
    />
  );
}
