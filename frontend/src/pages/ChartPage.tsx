import { ChartPieDonut } from "@/components/PieCard";
import { ChartBarStacked } from "@/components/BarCard";

export default function ChartPage() {
  return (
    <div className="flex flex-wrap gap-4">
      <ChartPieDonut />

      <ChartBarStacked />
    </div>
  );
}
