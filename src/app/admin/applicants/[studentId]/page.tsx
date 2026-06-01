import { notFound } from "next/navigation";
import ApplicantDetailView from "@/components/admin/ApplicantDetailView";
import { getApplicantByStudentId } from "@/lib/admin-applicants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const applicant = await getApplicantByStudentId(Number.parseInt(studentId, 10));
  return {
    title: applicant
      ? `${applicant.fullname} | Applicants | Admin`
      : "Applicant | Admin | Transit College",
  };
}

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId: studentIdParam } = await params;
  const studentId = Number.parseInt(studentIdParam, 10);

  if (Number.isNaN(studentId)) {
    notFound();
  }

  const applicant = await getApplicantByStudentId(studentId);
  if (!applicant) {
    notFound();
  }

  return <ApplicantDetailView applicant={applicant} />;
}
