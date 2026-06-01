import PinManagement from "@/components/admin/PinManagement";
import { getPinStats, listAdmissionPins } from "@/lib/admin-pins";

export default async function PinsPage() {
  const [pins, stats] = await Promise.all([listAdmissionPins(), getPinStats()]);

  return <PinManagement pins={pins} stats={stats} />;
}
