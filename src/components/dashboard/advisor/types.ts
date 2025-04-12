export interface Appointment {
    _id: string;
    bookedBy: {
        username: string;
    };
    date: string;
    startTime: string;
    description: string;
}


export interface GoalProgressChartProps {
    timeframe: 'monthly' | 'quarterly' | 'yearly';
    setTimeframe: React.Dispatch<React.SetStateAction<'monthly' | 'quarterly' | 'yearly'>>;
    goalProgress: { completed: number; inProgress: number; notStarted: number }
}

export interface RevenueChartProps {
    timeframe: "monthly" | "quarterly" | "yearly";
    setTimeframe: React.Dispatch<React.SetStateAction<"monthly" | "quarterly" | "yearly">>;
    revenueData: Record<string, { name: string; revenue: number }[]>;
}

export interface StatCardProps {
    title: string;
    value: number;
    change?: string | number;
    icon: JSX.Element;
    iconBg: string;
    bgGradient?: string;
};

export interface Stats {
    totalRevenue: number;
    // revenueChange: string | number;
    activeClients: number;
    // clientsChange: string | number;
    completedGoals: number;
    // goalsChange: string | number;
    slotUtilization: number;
    // utilizationChange: string | number;
};

export interface TimeframeSelectorProps {
    timeframe: "monthly" | "quarterly" | "yearly";
    setTimeframe: React.Dispatch<React.SetStateAction<"monthly" | "quarterly" | "yearly">>;
}