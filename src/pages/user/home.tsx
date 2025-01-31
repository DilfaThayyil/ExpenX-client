import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ChevronDown,
  Bell,
  Plus,
  CreditCard,
  Users,
  Wallet,
  TrendingUp,
  Calendar,
  Award,
  Download,
  LogOut
} from 'lucide-react';
import Layout from '@/layout/Sidebar';
import Store from '@/store/store'



// Types
interface ExpenseData {
  category: string;
  amount: number;
  color: string;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  amount: number;
  timestamp: string;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const DashboardPage = () => {

  const user = Store(state=>state.user)
  console.log("user in store : ", user)
  const [budgetProgress, setBudgetProgress] = useState(65);

  // Mock data
  const monthlyExpenses: ExpenseData[] = [
    { category: "Food", amount: 500, color: "#10B981" },
    { category: "Transport", amount: 300, color: "#3B82F6" },
    { category: "Entertainment", amount: 200, color: "#F59E0B" },
    { category: "Utilities", amount: 400, color: "#EF4444" }
  ];

  const trendData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1800 },
    { month: 'Mar', amount: 1400 },
    { month: 'Apr', amount: 2200 },
  ];

  const recentActivity: RecentActivity[] = [
    { id: 1, type: "expense", description: "Groceries at Walmart", amount: 85.50, timestamp: "2 hours ago" },
    { id: 2, type: "group", description: "Split dinner bill with roommates", amount: 45.00, timestamp: "Yesterday" },
    { id: 3, type: "payment", description: "Utility bill payment", amount: 120.00, timestamp: "2 days ago" }
  ];

  return (
    <Layout role='user'>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/api/placeholder/40/40" alt="User" />
              
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()},{user.username}
              </h1>
              <p className="text-gray-600">Welcome back to your dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick Add Button */}
        <Button className="fixed bottom-6 right-6 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 z-10">
          <Plus className="mr-2 h-5 w-5" /> Add Expense
        </Button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Budget Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Budget Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-3xl font-bold text-emerald-600">$2,450</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="text-xl font-semibold">$3,500</p>
                    </div>
                  </div>
                  <Progress value={budgetProgress} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {budgetProgress}% of monthly budget used
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Spending Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#10B981" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-600">{activity.timestamp}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${activity.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyExpenses}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {monthlyExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {monthlyExpenses.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.category}</span>
                      </div>
                      <span className="font-medium">${category.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: "Split Bill" },
                    { icon: Wallet, label: "Add Payment" },
                    { icon: Download, label: "Export Data" },
                    { icon: Calendar, label: "Schedule" },
                  ].map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                    >
                      <action.icon className="h-6 w-6" />
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Great job!</h3>
                    <p className="text-sm text-gray-600">
                      You've tracked 100 expenses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;