import { useState } from 'react';
import Layout from "@/layout/Sidebar"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Phone, MessageSquare, Calendar, Upload, Download, ChevronDown, Home, ShoppingBag, CreditCard, Plane, ArrowUp, ArrowDown, DollarSign, Plus, FileText, FileSpreadsheet, Share2, MoreHorizontal, Filter, ChevronRight, ChevronLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from 'react-router-dom';
import { Booking } from '@/pages/advisor/Clients'


// Sample data
const transactionData = [
    { id: 1, type: 'Income', description: 'Salary', amount: 5000, date: '2025-03-15', category: 'Income' },
    { id: 2, type: 'Expense', description: 'Rent', amount: 1500, date: '2025-03-10', category: 'Housing' },
    { id: 3, type: 'Expense', description: 'Groceries', amount: 300, date: '2025-03-20', category: 'Food' },
    { id: 4, type: 'Expense', description: 'Flight Tickets', amount: 800, date: '2025-03-05', category: 'Travel' },
    { id: 5, type: 'Investment', description: 'Stock Purchase', amount: 2000, date: '2025-03-12', category: 'Investment' }
];

const incomeVsExpenseData = [
    { name: 'Jan', income: 4500, expenses: 3200 },
    { name: 'Feb', income: 4800, expenses: 3400 },
    { name: 'Mar', income: 5000, expenses: 2800 },
    { name: 'Apr', income: 4700, expenses: 3100 },
    { name: 'May', income: 5200, expenses: 3500 },
    { name: 'Jun', income: 5500, expenses: 3300 }
];

const expenseData = [
    { name: 'Housing', value: 35, color: '#8884d8' },
    { name: 'Food', value: 20, color: '#82ca9d' },
    { name: 'Travel', value: 15, color: '#ffc658' },
    { name: 'Shopping', value: 10, color: '#ff8042' },
    { name: 'Investments', value: 20, color: '#0088fe' }
];

const investmentData = [
    { name: 'Jan', value: 10000 },
    { name: 'Feb', value: 12000 },
    { name: 'Mar', value: 11500 },
    { name: 'Apr', value: 13500 },
    { name: 'May', value: 14800 },
    { name: 'Jun', value: 16000 }
];

const investmentPortfolio = [
    { name: 'Apple Inc.', type: 'Stock', amount: 5000, growth: 12.5, risk: 'Medium' },
    { name: 'S&P 500 ETF', type: 'ETF', amount: 8000, growth: 8.3, risk: 'Low' },
    { name: 'Real Estate Fund', type: 'Real Estate', amount: 15000, growth: 5.2, risk: 'Medium' },
    { name: 'Bitcoin', type: 'Crypto', amount: 3000, growth: -7.6, risk: 'High' }
];

const meetingsData = [
    { id: 1, date: '2025-04-10', time: '10:00 AM', topic: 'Portfolio Review', notes: 'Discuss recent market changes and adjust investment strategy.', completed: false },
    { id: 2, date: '2025-02-15', time: '2:30 PM', topic: 'Tax Planning', notes: 'Reviewed tax documents and identified potential deductions.', completed: true },
    { id: 3, date: '2025-01-20', time: '11:00 AM', topic: 'Retirement Planning', notes: 'Calculated retirement savings goals and adjusted monthly contributions.', completed: true }
];

const documentsData = [
    { id: 1, name: 'Financial Statement Q1', type: 'PDF', date: '2025-03-01' },
    { id: 2, name: 'Investment Portfolio', type: 'XLSX', date: '2025-02-28' },
    { id: 3, name: 'Tax Documents', type: 'PDF', date: '2025-02-15' },
    { id: 4, name: 'Retirement Plan', type: 'PDF', date: '2025-01-10' }
];

const ClientProfilePage = () => {
    const [meetings, setMeetings] = useState<Booking[]>([])
    const [activeTab, setActiveTab] = useState('overview');
    const [expenseTimeframe, setExpenseTimeframe] = useState('30days');
    const location = useLocation();
    const clientId = location.state?.clientId;
    console.log("clientId ==>> ", clientId)
    // Financial health score (0-100)
    const healthScore = 78;
    const getHealthColor = (score) => {
        if (score < 41) return 'bg-red-500';
        if (score < 71) return 'bg-orange-500';
        return 'bg-green-500';
    };



    return (
        <Layout role='advisor'>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
                {/* Header Section with Client Profile */}
                <div className="w-full mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 rounded-xl border-4 border-white dark:border-slate-700 shadow-lg">
                                <img src="/api/placeholder/150/150" alt="Client profile" className="object-cover" />
                            </Avatar>
                            <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full ${getHealthColor(healthScore)} flex items-center justify-center text-white font-bold border-2 border-white dark:border-slate-700`}>
                                {healthScore}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Michael Johnson</h1>
                                    <div className="text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:gap-4 mt-1">
                                        <span className="flex items-center gap-1">
                                            <MessageSquare size={16} />
                                            michael.johnson@example.com
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone size={16} />
                                            (555) 123-4567
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <span className="hidden sm:inline">Call</span>
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                                        <MessageSquare size={16} />
                                        <span className="hidden sm:inline">Chat</span>
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span className="hidden sm:inline">Schedule</span>
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                                        <Upload size={16} />
                                        <span className="hidden sm:inline">Upload</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex-1">
                                    <span className="text-slate-500 dark:text-slate-400">Last Meeting:</span> February 15, 2025
                                </div>
                                <Separator orientation="vertical" className="h-4 mx-4" />
                                <div className="flex-1">
                                    <span className="text-slate-500 dark:text-slate-400">Next Meeting:</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium ml-1">April 10, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content with Tabs */}
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                    <div className="mb-6 overflow-x-auto">
                        <TabsList className="bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Expenses
                            </TabsTrigger>
                            <TabsTrigger value="investments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Investments
                            </TabsTrigger>
                            <TabsTrigger value="meetings" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Meetings
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Documents
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Net Worth Card */}
                            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <DollarSign size={18} className="text-blue-500" />
                                        Net Worth
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end gap-2">
                                        <div className="text-3xl font-bold">$152,450</div>
                                        <div className="text-green-500 flex items-center text-sm font-medium mb-1">
                                            <ArrowUp size={16} />
                                            4.2%
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1">Compared to last month</div>
                                </CardContent>
                            </Card>

                            {/* Savings Goal Card */}
                            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <DollarSign size={18} className="text-blue-500" />
                                        Savings Goal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end justify-between">
                                        <div className="text-3xl font-bold">$35,000</div>
                                        <div className="text-sm font-medium text-slate-500">
                                            of $50,000
                                        </div>
                                    </div>
                                    <Progress value={70} className="h-2 mt-2" />
                                    <div className="text-sm text-slate-500 mt-2">70% completed</div>
                                </CardContent>
                            </Card>

                            {/* Monthly Income vs Expenses */}
                            <Card className="overflow-hidden hover:shadow-md transition-shadow lg:col-span-1 md:col-span-2 sm:col-span-1">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ArrowUp size={16} className="text-green-500" />
                                        <ArrowDown size={16} className="text-red-500" />
                                        Income vs Expenses
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                            <span className="text-sm text-slate-500">Income</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                            <span className="text-sm text-slate-500">Expenses</span>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={160}>
                                        <BarChart data={incomeVsExpenseData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Transactions */}
                        <Card className="mt-6 overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-sm">View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b text-slate-500 text-sm">
                                                <th className="text-left py-3 px-4 font-medium">Type</th>
                                                <th className="text-left py-3 px-4 font-medium">Description</th>
                                                <th className="text-left py-3 px-4 font-medium">Category</th>
                                                <th className="text-left py-3 px-4 font-medium">Date</th>
                                                <th className="text-right py-3 px-4 font-medium">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactionData.map((item) => (
                                                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <td className="py-3 px-4">
                                                        {item.type === 'Income' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Income</Badge>}
                                                        {item.type === 'Expense' && <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expense</Badge>}
                                                        {item.type === 'Investment' && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Investment</Badge>}
                                                    </td>
                                                    <td className="py-3 px-4">{item.description}</td>
                                                    <td className="py-3 px-4">{item.category}</td>
                                                    <td className="py-3 px-4">{item.date}</td>
                                                    <td className="py-3 px-4 text-right font-medium">
                                                        {item.type === 'Income' ? (
                                                            <span className="text-green-600">+${item.amount}</span>
                                                        ) : (
                                                            <span className="text-red-600">-${item.amount}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Expenses Tab */}
                    <TabsContent value="expenses" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Expense Breakdown Chart */}
                            <Card className="lg:col-span-2 overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={expenseTimeframe === '7days' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setExpenseTimeframe('7days')}
                                            >
                                                7 Days
                                            </Button>
                                            <Button
                                                variant={expenseTimeframe === '30days' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setExpenseTimeframe('30days')}
                                            >
                                                30 Days
                                            </Button>
                                            <Button
                                                variant={expenseTimeframe === 'custom' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setExpenseTimeframe('custom')}
                                            >
                                                Custom
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex justify-center items-center">
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie
                                                        data={expenseData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {expenseData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            {expenseData.map((item) => (
                                                <div key={item.name} className="flex items-center mb-3">
                                                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                                    <div className="flex-1">{item.name}</div>
                                                    <div className="font-medium">{item.value}%</div>
                                                </div>
                                            ))}
                                            <div className="mt-4 pt-4 border-t">
                                                <div className="flex justify-between text-sm text-slate-500 mb-1">
                                                    <span>Total Expenses:</span>
                                                    <span className="font-medium text-slate-900 dark:text-white">$2,600</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-slate-500">
                                                    <span>Monthly Budget:</span>
                                                    <span className="font-medium text-slate-900 dark:text-white">$3,500</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Expense Categories */}
                            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Top Expenses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Home size={16} className="text-slate-400" />
                                                    <span>Housing</span>
                                                </div>
                                                <span className="font-medium">$1,500</span>
                                            </div>
                                            <Progress value={75} className="h-2" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag size={16} className="text-slate-400" />
                                                    <span>Food</span>
                                                </div>
                                                <span className="font-medium">$520</span>
                                            </div>
                                            <Progress value={40} className="h-2" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={16} className="text-slate-400" />
                                                    <span>Shopping</span>
                                                </div>
                                                <span className="font-medium">$260</span>
                                            </div>
                                            <Progress value={20} className="h-2" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Plane size={16} className="text-slate-400" />
                                                    <span>Travel</span>
                                                </div>
                                                <span className="font-medium">$320</span>
                                            </div>
                                            <Progress value={25} className="h-2" />
                                        </div>
                                    </div>

                                    <Button variant="outline" size="sm" className="w-full mt-6">
                                        View All Categories
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Investments Tab */}
                    <TabsContent value="investments" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Investment Growth Chart */}
                            <Card className="lg:col-span-2 overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">Investment Growth</CardTitle>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    6 Months
                                                    <ChevronDown size={16} className="ml-1" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>3 Months</DropdownMenuItem>
                                                <DropdownMenuItem>6 Months</DropdownMenuItem>
                                                <DropdownMenuItem>1 Year</DropdownMenuItem>
                                                <DropdownMenuItem>All Time</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={investmentData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={{ r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <div className="text-center">
                                            <div className="text-sm text-slate-500">Initial</div>
                                            <div className="font-medium">$10,000</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-slate-500">Current</div>
                                            <div className="font-medium">$16,000</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-slate-500">Growth</div>
                                            <div className="font-medium text-green-600">+60%</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Investment Allocation */}
                            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Investment Allocation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={180}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Stocks', value: 45, color: '#3b82f6' },
                                                    { name: 'ETFs', value: 25, color: '#22c55e' },
                                                    { name: 'Real Estate', value: 20, color: '#f59e0b' },
                                                    { name: 'Crypto', value: 10, color: '#8b5cf6' }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                innerRadius={40}
                                                outerRadius={70}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {expenseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                            <span className="text-xs">Stocks (45%)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                            <span className="text-xs">ETFs (25%)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                                            <span className="text-xs">Real Estate (20%)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                                            <span className="text-xs">Crypto (10%)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Investment Holdings */}
                            <Card className="lg:col-span-3 overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">Investment Holdings</CardTitle>
                                        <Button variant="outline" size="sm" className="gap-1">
                                            <Plus size={16} />
                                            Add Investment
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b text-slate-500 text-sm">
                                                    <th className="text-left py-3 px-4 font-medium">Name</th>
                                                    <th className="text-left py-3 px-4 font-medium">Type</th>
                                                    <th className="text-right py-3 px-4 font-medium">Amount</th>
                                                    <th className="text-right py-3 px-4 font-medium">Growth</th>
                                                    <th className="text-left py-3 px-4 font-medium">Risk</th>
                                                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {investmentPortfolio.map((item, index) => (
                                                    <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                        <td className="py-3 px-4 font-medium">{item.name}</td>
                                                        <td className="py-3 px-4">{item.type}</td>
                                                        <td className="py-3 px-4">{item.amount}</td>
                                                        <td className="py-3 px-4">{item.growth}</td>
                                                        <td className="py-3 px-4">{item.risk}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Meetings Tab */}
                    <TabsContent value="meetings" className="mt-0">
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">Scheduled Meetings</CardTitle>
                                    <Button variant="outline" size="sm" className="text-sm">
                                        <Plus size={16} className="mr-1" />
                                        New Meeting
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b text-slate-500 text-sm">
                                                <th className="text-left py-3 px-4 font-medium">Date</th>
                                                <th className="text-left py-3 px-4 font-medium">Time</th>
                                                <th className="text-left py-3 px-4 font-medium">Topic</th>
                                                <th className="text-left py-3 px-4 font-medium">Notes</th>
                                                <th className="text-left py-3 px-4 font-medium">Status</th>
                                                <th className="text-right py-3 px-4 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {meetings?.map((meeting) => {
                                                const meetingDateTime = new Date(`${meeting.date}T${meeting.endTime}`);
                                                const isCompleted = meetingDateTime < new Date();
                                                return (
                                                    <tr key={meeting._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                        <td className="py-3 px-4">{meeting.date}</td>
                                                        <td className="py-3 px-4">{meeting.startTime}</td>
                                                        <td className="py-3 px-4 font-medium">{meeting.description}</td>
                                                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{meeting.status}</td>
                                                        <td className="py-3 px-4">
                                                            <Badge className={isCompleted ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}>
                                                                {isCompleted ? "Completed" : "Upcoming"}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal size={16} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4">
                                    <Button variant="outline" size="sm" className="text-sm">View All Meetings</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Calendar Widget */}
                        <Card className="mt-6 overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">Meeting Calendar</CardTitle>
                                    <Select defaultValue="month">
                                        <SelectTrigger className="w-[120px] h-8">
                                            <SelectValue placeholder="View" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="day">Day</SelectItem>
                                            <SelectItem value="week">Week</SelectItem>
                                            <SelectItem value="month">Month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center text-sm mb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <Button variant="ghost" size="sm">
                                            <ChevronLeft size={16} />
                                        </Button>
                                        <div className="font-medium">April 2025</div>
                                        <Button variant="ghost" size="sm">
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        <div className="py-1 text-slate-500">Sun</div>
                                        <div className="py-1 text-slate-500">Mon</div>
                                        <div className="py-1 text-slate-500">Tue</div>
                                        <div className="py-1 text-slate-500">Wed</div>
                                        <div className="py-1 text-slate-500">Thu</div>
                                        <div className="py-1 text-slate-500">Fri</div>
                                        <div className="py-1 text-slate-500">Sat</div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Previous month days */}
                                        <div className="py-2 text-slate-400">30</div>
                                        <div className="py-2 text-slate-400">31</div>
                                        {/* Current month days */}
                                        {Array.from({ length: 30 }, (_, i) => (
                                            <div
                                                key={i}
                                                className={`py-2 rounded-full hover:bg-slate-100 cursor-pointer ${i + 1 === 10 ? 'bg-blue-100 text-blue-800' : ''
                                                    }`}
                                            >
                                                {i + 1}
                                            </div>
                                        ))}
                                        {/* Next month days */}
                                        {Array.from({ length: 4 }, (_, i) => (
                                            <div key={i} className="py-2 text-slate-400">{i + 1}</div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Documents List */}
                            <Card className="lg:col-span-2 overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">Financial Documents</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                <Upload size={16} className="mr-1" />
                                                Upload
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Filter size={16} className="mr-1" />
                                                Filter
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b text-slate-500 text-sm">
                                                    <th className="text-left py-3 px-4 font-medium">Name</th>
                                                    <th className="text-left py-3 px-4 font-medium">Type</th>
                                                    <th className="text-left py-3 px-4 font-medium">Date</th>
                                                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documentsData.map((document) => (
                                                    <tr key={document.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                {document.type === 'PDF' ? <FileText size={16} className="text-red-500" /> : <FileSpreadsheet size={16} className="text-green-500" />}
                                                                <span className="font-medium">{document.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <Badge className={document.type === 'PDF' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 'bg-green-100 text-green-800 hover:bg-green-100'}>
                                                                {document.type}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4">{document.date}</td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <Download size={16} />
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <Share2 size={16} />
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal size={16} />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Document Upload */}
                            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Upload Document</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                                        <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-500 mb-4">Drag and drop files here or click to browse</p>
                                        <Button variant="outline" size="sm">Browse Files</Button>
                                    </div>
                                    <div className="mt-6">
                                        <div className="text-sm font-medium mb-2">Accepted file types</div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">PDF</Badge>
                                            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">XLSX</Badge>
                                            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">DOCX</Badge>
                                            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">CSV</Badge>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-sm font-medium mb-2">Recent uploads</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={14} className="text-red-500" />
                                                    <span>Q1_Taxes.pdf</span>
                                                </div>
                                                <span className="text-slate-500">Just now</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <FileSpreadsheet size={14} className="text-green-500" />
                                                    <span>Budget_2025.xlsx</span>
                                                </div>
                                                <span className="text-slate-500">Yesterday</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>

    )
}

export default ClientProfilePage