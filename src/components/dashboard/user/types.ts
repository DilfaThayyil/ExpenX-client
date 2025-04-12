export interface AchievementCardProps {
    title: string;
    description: string;
    icon?: React.ElementType;
    loading?: boolean;
}

export interface BudgetOverviewProps {
    totalSpent: number;
    //   budget: number;
    //   progress: number;
    loading?: boolean;
}

export interface ExpenseCategory {
    category: string;
    amount: number;
    color: string;
}

export interface CategoryBreakdownProps {
    categories: ExpenseCategory[];
    loading?: boolean;
}

export interface HeaderProps {
    username: string;
}

export interface Activity {
    id: number | string;
    type: string;
    description: string;
    amount: number;
    timestamp: string;
}

export interface RecentActivityProps {
    activities: Activity[];
    loading?: boolean;
}

export interface InsightItem {
    title: string;
    value: string | number;
    description: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    icon: React.ElementType;
    iconBgColor?: string;
    iconColor?: string;
}

export interface SpendingInsightsProps {
    insights: InsightItem[];
    loading?: boolean;
}

export interface TrendData {
    date: string;
    expenses: number;
    payments: number
}

export interface SpendingTrendProps {
    data: TrendData[];
    loading?: boolean;
}
