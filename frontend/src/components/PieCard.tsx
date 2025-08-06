


import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type TicketStatusCount = {
  todo?: number;
  "in-progress"?: number;
  done?: number;
};

const intervalOptions = [
  { key: "7", label: "7 jours" },
  { key: "30", label: "30 jours" },
  { key: "90", label: "90 jours" },
];

export function ChartPieDonut() {
  const [interval, setInterval] = useState(intervalOptions[0].key);
  const [pieData, setPieData] = useState<TicketStatusCount>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/dashboard/countTicket", {
          params: { days: Number(interval) },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          }
        });
        setPieData(res.data);
        console.log(res.data);
      } catch (error) {
        setPieData({});
      }
    };
    fetchData();
  }, [interval]);

  const chartData = [
    { status: "todo", count: pieData.todo ?? 0, fill: "grey" },
    { status: "in-progress", count: pieData["in-progress"] ?? 0, fill: "red" },
    { status: "done", count: pieData.done ?? 0, fill: "yellow" },
  ];

  return (
    <Card className="w-full md:w-[48%]">
      <CardHeader className="items-center pb-0">
        <div className="w-full flex flex-row items-center gap-2">
          <CardTitle>Tickets par statut</CardTitle>
          <Select value={interval} onValueChange={setInterval}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Intervalle" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Intervalle</SelectLabel>
                {intervalOptions.map(opt => (
                  <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              label
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
