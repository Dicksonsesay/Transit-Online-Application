import StudentMessagesView from "@/components/student/StudentMessagesView";
import { getStudentNotifications } from "@/lib/notifications";
import { requireStudentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Messages | Transit College",
};

export default async function MessagesPage() {
  const session = await requireStudentSession();
  if (!session) redirect("/auth/login");

  const studentId = Number.parseInt(session.user.id, 10);
  const messages = Number.isNaN(studentId)
    ? []
    : await getStudentNotifications(studentId);

  return <StudentMessagesView messages={messages} />;
}
