import {ResponsiveContainer,PieChart,Pie,Cell,Tooltip,} from 'recharts';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Plane, CreditCard, ShoppingBag, Home } from 'lucide-react'
import React from 'react';
import { DashboardCard } from './DocumentsTab';
import { Progress } from '@/components/ui/progress';


export const ExpensesTab = ({ expenseTimeframe, setExpenseTimeframe, expenseData }) => {
    return (
        <TabsContent value="expenses" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ExpenseBreakdownChart
                    timeframe={expenseTimeframe}
                    setTimeframe={setExpenseTimeframe}
                    expenseData={expenseData}
                />
                <TopExpensesCard />
            </div>
        </TabsContent>
    );
};

export const TopExpensesCard = () => {
    return (
        <DashboardCard title="Top Expenses">
            <div className="space-y-4">
                <ExpenseItem icon={<Home size={16} />} name="Housing" amount="$1,500" percentage={75} />
                <ExpenseItem icon={<ShoppingBag size={16} />} name="Food" amount="$520" percentage={40} />
                <ExpenseItem icon={<CreditCard size={16} />} name="Shopping" amount="$260" percentage={20} />
                <ExpenseItem icon={<Plane size={16} />} name="Travel" amount="$320" percentage={25} />
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6">
                View All Categories
            </Button>
        </DashboardCard>
    );
};

export const ExpenseItem = ({ icon, name, amount, percentage }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    {React.cloneElement(icon, { className: "text-slate-400" })}
                    <span>{name}</span>
                </div>
                <span className="font-medium">{amount}</span>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
    );
};

export const ExpenseBreakdownChart = ({ timeframe, setTimeframe, expenseData }) => {
    return (
        <DashboardCard
            title="Expense Breakdown"
            className="lg:col-span-2"
            actions={
                <>
                    <Button
                        variant={timeframe === '7days' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeframe('7days')}
                    >
                        7 Days
                    </Button>
                    <Button
                        variant={timeframe === '30days' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeframe('30days')}
                    >
                        30 Days
                    </Button>
                    <Button
                        variant={timeframe === 'custom' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeframe('custom')}
                    >
                        Custom
                    </Button>
                </>
            }
        >
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
                <ExpenseBreakdownLegend expenseData={expenseData} />
            </div>
        </DashboardCard>
    );
};

export const ExpenseBreakdownLegend = ({ expenseData }) => {
    return (
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
    );
};
