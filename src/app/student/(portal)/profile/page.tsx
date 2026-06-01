import { redirect } from "next/navigation";
import StudentProfilePanel from "@/components/account/StudentProfilePanel";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/session";

export const metadata = {
  title: "Profile | Transit College",
};

function formatDateValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

function displayValue(value: string | null | undefined) {
  return value || "Not provided";
}

function formatDisplayDate(date: Date | null) {
  return date
    ? date.toLocaleDateString("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not provided";
}

export default async function ProfilePage() {
  const session = await requireStudentSession();
  if (!session) {
    redirect("/auth/login");
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    redirect("/auth/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      applicationNumber: true,
      fullname: true,
      gender: true,
      dateOfBirth: true,
      email: true,
      phone: true,
      address: true,
      nationality: true,
      accountStatus: true,
      createdAt: true,
    },
  });

  if (!student) {
    redirect("/auth/login");
  }

  const formStudent = {
    fullname: student.fullname,
    email: student.email,
    gender: student.gender,
    dateOfBirth: formatDateValue(student.dateOfBirth),
    phone: student.phone ?? "",
    address: student.address ?? "",
    nationality: student.nationality ?? "",
  };

  return (
    <StudentProfilePanel
      details={{
        applicationNumber: displayValue(student.applicationNumber),
        fullname: student.fullname,
        email: student.email,
        phone: displayValue(student.phone),
        gender: displayValue(student.gender),
        dateOfBirth: formatDisplayDate(student.dateOfBirth),
        nationality: displayValue(student.nationality),
        address: displayValue(student.address),
        accountStatus: student.accountStatus,
        joined: formatDisplayDate(student.createdAt),
      }}
      formStudent={formStudent}
    />
  );
}
