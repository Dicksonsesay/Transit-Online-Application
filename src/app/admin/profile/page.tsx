import { redirect } from "next/navigation";
import AdminProfilePanel from "@/components/account/AdminProfilePanel";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

export const metadata = {
  title: "Admin Profile | Transit College",
};

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminProfilePage() {
  const session = await requireAdminSession();
  if (!session) {
    redirect("/auth/admin/login");
  }

  const adminId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(adminId)) {
    redirect("/auth/admin/login");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      fullname: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!admin) {
    redirect("/auth/admin/login");
  }

  return (
    <div className="space-y-6">
      <AdminProfilePanel
      details={{
        fullname: admin.fullname,
        email: admin.email,
        phone: admin.phone ?? "Not provided",
        role: admin.role.replaceAll("_", " "),
        status: admin.status,
        created: formatDisplayDate(admin.createdAt),
      }}
      formAdmin={{
        fullname: admin.fullname,
        email: admin.email,
        phone: admin.phone ?? "",
      }}
      />
    </div>
  );
}
