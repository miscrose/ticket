import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import type { ChartConfig } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"

// Type pour les données reçues de l'API (nouvelle structure)
type ChartDataPoint = {
  date: string;
  [key: string]: string | number; // Pour les tickets dynamiques
};

const intervalOptions = [
  { key: "7", label: "7 jours" },
  { key: "14", label: "14 jours" },
  { key: "30", label: "30 jours" },
];

// Couleurs pour les tickets
const ticketColors = [
  "var(--chart-1)",
  "var(--chart-2)", 
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

export function ChartBarStacked() {
  const [interval, setInterval] = useState(intervalOptions[0].key);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/dashboard/doneTicketsDetailsPerDay", {
          params: { days: Number(interval) },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          }
        });

        const data: ChartDataPoint[] = res.data;
        
        // Collecter tous les titres de tickets uniques
        const ticketTitles = new Set<string>();
        data.forEach(day => {
          Object.keys(day).forEach(key => {
            if (key !== 'date') {
              ticketTitles.add(key);
            }
          });
        });

        // Créer la config du chart
        const config: ChartConfig = {};
        Array.from(ticketTitles).forEach((title, index) => {
          config[title] = {
            label: title,
            color: ticketColors[index % ticketColors.length],
          };
        });
        setChartConfig(config);
        setChartData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setChartData([]);
      }
    };

    fetchData();
  }, [interval]);

  return (
    <Card className="w-full md:w-[48%]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Temps de résolution des tickets par jour</CardTitle>
           
          </div>
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
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
              }}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          
            {Object.keys(chartConfig).map((ticketTitle, index) => (
              <Bar
                key={ticketTitle}
                dataKey={ticketTitle}
                stackId="a"
                fill={ticketColors[index % ticketColors.length]}
                radius={index === 0 ? [0, 0, 4, 4] : index === Object.keys(chartConfig).length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
 
    </Card>
  )
}
