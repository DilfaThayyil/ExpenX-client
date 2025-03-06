import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { moneyColors } from "@/style/theme";

interface GoalProgressChartProps {
  timeframe: 'monthly' | 'quarterly' | 'yearly';
  setTimeframe: React.Dispatch<React.SetStateAction<'monthly' | 'quarterly' | 'yearly'>>;
  goalProgress: { completed: number; inProgress: number; notStarted: number }
}

 
export default function GoalProgressChart({ timeframe, setTimeframe, goalProgress }: GoalProgressChartProps) {
  const formattedGoalProgress = [
    { name: timeframe, ...goalProgress }
  ];

  return (
    <Card className="col-span-1 overflow-hidden border-none shadow-md">
      <div style={{ background: moneyColors.gradient.secondary }} className="h-1"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <div className="w-2 h-6 rounded-md mr-2" style={{ backgroundColor: moneyColors.money.accent }}></div>
            Client Goal Progress
          </CardTitle>
          <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>
        <CardDescription>Status of client financial goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedGoalProgress} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fill: moneyColors.text.secondary }} />
              <YAxis tick={{ fill: moneyColors.text.secondary }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: moneyColors.bg.card,
                  borderColor: moneyColors.chart.completed,
                  borderRadius: '6px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar 
                dataKey="completed" 
                stackId="a" 
                fill={moneyColors.chart.completed} 
                name="Completed"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="inProgress" 
                stackId="a" 
                fill={moneyColors.chart.inProgress} 
                name="In Progress"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="notStarted" 
                stackId="a" 
                fill={moneyColors.chart.notStarted} 
                name="Not Started"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}


interface TimeframeSelectorProps {
  timeframe: 'monthly' | 'quarterly' | 'yearly';
  setTimeframe: React.Dispatch<React.SetStateAction<'monthly' | 'quarterly' | 'yearly'>>;
}

function TimeframeSelector({ timeframe, setTimeframe }: TimeframeSelectorProps) {
  return (
    <select 
      className="px-3 py-1 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
      value={timeframe}
      onChange={(e) => setTimeframe(e.target.value as 'monthly' | 'quarterly' | 'yearly')}
      style={{ backgroundColor: moneyColors.bg.muted, color: moneyColors.text.primary }}
    >
      <option value="monthly">Monthly</option>
      <option value="quarterly">Quarterly</option>
      <option value="yearly">Yearly</option>
    </select>
  );
}
