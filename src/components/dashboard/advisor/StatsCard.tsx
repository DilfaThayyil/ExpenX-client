import { IndianRupee , Users, Target, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { moneyColors } from "@/style/theme";

export interface Stats{
  totalRevenue: number;
  // revenueChange: string | number;
  activeClients: number;
  // clientsChange: string | number;
  completedGoals: number;
  // goalsChange: string | number;
  slotUtilization: number;
  // utilizationChange: string | number;
};

interface StatCardProps{
  title: string;
  value: number;
  change?: string | number;
  icon: JSX.Element;
  iconBg: string;
  bgGradient?: string;
};


export default function StatsCards({ stats }:{stats:Stats}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Revenue" 
        value={stats.totalRevenue} 
        // change={stats.revenueChange} 
        icon={<IndianRupee className="h-4 w-4 text-white" />} 
        iconBg={moneyColors.money.primary}
        bgGradient={moneyColors.gradient.primary}
      />
      <StatCard 
        title="Active Clients" 
        value={stats.activeClients} 
        // change={stats.clientsChange} 
        icon={<Users className="h-4 w-4 text-white" />} 
        iconBg={moneyColors.money.secondary}
        bgGradient={moneyColors.gradient.primary}
      />
      <StatCard 
        title="Goals Completed" 
        value={stats.completedGoals} 
        // change={stats.goalsChange} 
        icon={<Target className="h-4 w-4 text-white" />} 
        iconBg={moneyColors.money.accent}
        bgGradient={moneyColors.gradient.primary}
      />
      <StatCard 
        title="Slot Utilization" 
        value={stats.slotUtilization} 
        // change={stats.utilizationChange} 
        icon={<Clock className="h-4 w-4 text-white" />} 
        iconBg={moneyColors.money.info}
        bgGradient={moneyColors.gradient.primary}
      />
    </div>
  );
}


function StatCard({ title, value, change, icon, iconBg, bgGradient }:StatCardProps) {
  const changeValue = change ?? "0"; 
  const isPositive = parseFloat(changeValue.toString()) > 0;

  return (
    <Card className="overflow-hidden border-none shadow-md">
      {bgGradient ? (
        <div style={{ background: bgGradient }} className="h-1"></div>
      ) : (
        <div style={{ background: iconBg }} className="h-1"></div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="rounded-full p-2" style={{ backgroundColor: iconBg }}>
            {icon}
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-4">
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className="flex items-center text-xs font-medium">
            {isPositive ? (
              <span style={{ color: moneyColors.money.success }} className="flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {typeof changeValue === "string" ? changeValue.replace('-', '') : changeValue}
              </span>
            ) : (
              <span style={{ color: moneyColors.money.danger }} className="flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                {typeof changeValue === "string" ? changeValue.replace('-', '') : changeValue}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
