import PinManagement from "@/components/admin/PinManagement";
import { summarizePinRevenue } from "@/lib/admin-export/pin-export";
import { getPinStats, listAdmissionPins } from "@/lib/admin-pins";

export default async function PinsPage() {
  const [pins, stats] = await Promise.all([listAdmissionPins(), getPinStats()]);
  const revenue = summarizePinRevenue(pins);

  return <PinManagement pins={pins} stats={stats} revenue={revenue} />;
}
