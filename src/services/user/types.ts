export interface IcreateUser {
    username: string
    email: string
    password: string
}

export interface ErrorResponse {
    error: string
}

export interface DashboardData {
    monthlyExpenses: {
        category: string;
        amount: number;
        count: number;
        color: string;
    }[];
    trendData: {
        date: string;
        expenses: number;
        payments: number;
    }[];
    recentActivity: {
        id: string;
        date: Date;
        amount: number;
        description: string;
        category: string;
        type: 'expense' | 'payment';
    }[];
    budgetInfo: {
        totalSpent: number;
        budget: number;
        progress: number;
    };
}
export interface Settlement {
    from: string;
    to: string;  
    amount: number;
    date: string;
}