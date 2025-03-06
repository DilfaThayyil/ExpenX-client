import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { moneyColors } from "@/style/theme";

interface RevenueChartProps {
  timeframe: "monthly" | "quarterly" | "yearly";
  setTimeframe: React.Dispatch<React.SetStateAction<"monthly" | "quarterly" | "yearly">>;
  revenueData: Record<string, { name: string; revenue: number }[]>;
}

export default function RevenueChart({ timeframe, setTimeframe, revenueData }: RevenueChartProps) {
  return (
    <Card className="col-span-1 overflow-hidden border-none shadow-md">
      <div style={{ background: moneyColors.gradient.primary }} className="h-1"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <div className="w-2 h-6 rounded-md mr-2" style={{ backgroundColor: moneyColors.money.primary }}></div>
            Revenue Overview
          </CardTitle>
          <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>
        <CardDescription>Compare your revenue against targets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData[timeframe]} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <XAxis dataKey="name" stroke={moneyColors?.text?.primary || "#333"} />
              <YAxis stroke={moneyColors?.text?.primary || "#333"} />
              <Tooltip
                contentStyle={{ backgroundColor: moneyColors?.bg?.dark || "#222", color: moneyColors?.text?.light || "#fff" }}
              />

              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={moneyColors.chart.revenue}
                strokeWidth={3}
                dot={{ r: 4, fill: moneyColors.chart.revenue }}
                activeDot={{ r: 6, fill: moneyColors.chart.highlight }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface TimeframeSelectorProps {
  timeframe: "monthly" | "quarterly" | "yearly";
  setTimeframe: React.Dispatch<React.SetStateAction<"monthly" | "quarterly" | "yearly">>;
}

function TimeframeSelector({ timeframe, setTimeframe }: TimeframeSelectorProps) {
  return (
    <select
      className="px-3 py-1 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      value={timeframe}
      onChange={(e) => setTimeframe(e.target.value as "monthly" | "quarterly" | "yearly")}
      style={{ backgroundColor: moneyColors.bg.muted, color: moneyColors.text.primary }}
    >
      <option value="monthly">Monthly</option>
      <option value="quarterly">Quarterly</option>
      <option value="yearly">Yearly</option>
    </select>
  );
} 
