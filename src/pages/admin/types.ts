export interface MonthlyData {
    month: string;
    expenses: number;
    income: number;
    users: number;
}
export interface CategoryData {
    category: string;
    amount: number;
}
export interface DashboardStats {
    totalUsers: number;
    totalPayments: number;
    averageExpense: number;
    totalRevenue: number;
}

export interface Category {
    _id?: string;
    name: string;
}
export interface User {
    _id: string;
    username: string;
    email: string;
    isBlocked:boolean
  }