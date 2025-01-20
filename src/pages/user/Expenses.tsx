import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Download,
  ArrowUpDown,
} from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/layout/Sidebar';

// Types
interface Expense {
  id: number;
  date: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  group?: string;
}

const Expenses = () => {
  const [expenses] = useState<Expense[]>([
    {
      id: 1,
      date: "2024-01-19",
      amount: 85.50,
      category: "Food",
      description: "Grocery shopping",
      paymentMethod: "Credit Card"
    },
    {
      id: 2,
      date: "2024-01-18",
      amount: 45.00,
      category: "Entertainment",
      description: "Movie tickets",
      paymentMethod: "Cash"
    },
    // Add more mock data as needed
  ]);

  const [date, setDate] = useState<Date>();

  // Mock data for charts
  const categoryData = [
    { category: "Food", amount: 500, color: "#10B981" },
    { category: "Transport", amount: 300, color: "#3B82F6" },
    { category: "Entertainment", amount: 200, color: "#F59E0B" },
    { category: "Utilities", amount: 400, color: "#EF4444" }
  ];

  const trendData = [
    { date: '01/15', amount: 120 },
    { date: '01/16', amount: 180 },
    { date: '01/17', amount: 150 },
    { date: '01/18', amount: 220 },
    { date: '01/19', amount: 190 }
  ];

  return (
    <Layout role='user'>
        <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Expense Tracker</h1>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="debit">Debit Card</SelectItem>
                </SelectContent>
            </Select>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                className="pl-10" 
                placeholder="Search expenses..." 
                />
            </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Expense List */}
            <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expenses</CardTitle>
                <Dialog>
                    <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Expense
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                        <label>Amount</label>
                        <Input type="number" placeholder="Enter amount" />
                        </div>
                        <div className="grid gap-2">
                        <label>Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, 'PPP') : 'Pick a date'}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                            />
                            </PopoverContent>
                        </Popover>
                        </div>
                        <div className="grid gap-2">
                        <label>Category</label>
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="utilities">Utilities</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="grid gap-2">
                        <label>Description</label>
                        <Input placeholder="Enter description" />
                        </div>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Save Expense
                    </Button>
                    </DialogContent>
                </Dialog>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="text-right">
                            ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
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
            </div>

            {/* Right Column - Summary and Charts */}
            <div className="space-y-6">
            {/* Summary Card */}
            <Card>
                <CardHeader>
                <CardTitle>Expense Summary</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    <div>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p className="text-3xl font-bold text-emerald-600">$1,485.50</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-600">Monthly Budget</p>
                    <Progress value={65} className="h-2 mt-2" />
                    <p className="text-sm text-gray-600 mt-1">
                        65% of budget used
                    </p>
                    </div>
                    <div className="pt-4 border-t">
                    <p className="text-sm font-medium">Quick Stats</p>
                    <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                        <span className="text-gray-600">Average Daily</span>
                        <span className="font-medium">$48.50</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-600">Largest Expense</span>
                        <span className="font-medium">$85.50</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-600">Total Transactions</span>
                        <span className="font-medium">12</span>
                        </div>
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
                <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                        >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                    {categoryData.map((category) => (
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

            {/* Export Data */}
            <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
            </div>
        </div>
        </div>
    </Layout>
  );
};

export default Expenses;