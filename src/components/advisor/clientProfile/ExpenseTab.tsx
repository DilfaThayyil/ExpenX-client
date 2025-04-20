import {ExpensesTabProps,ExpenseItemProps,ExpenseBreakdownChartProps,ExpenseDataType} from './types'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, } from 'recharts';
import { Plane, CreditCard, ShoppingBag, Home } from 'lucide-react'
import { Progress } from '@/components/ui/progress';
import "react-datepicker/dist/react-datepicker.css";
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DashboardCard } from './DocumentsTab';
import DatePicker from "react-datepicker";
import { useState } from 'react'
import React from 'react';


export const ExpensesTab:React.FC<ExpensesTabProps> = ({ expenseTimeframe, setExpenseTimeframe, expenseData, setCustomDates }) => {
    return (
        <TabsContent value="expenses" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ExpenseBreakdownChart
                    timeframe={expenseTimeframe}
                    setTimeframe={setExpenseTimeframe}
                    expenseData={expenseData}
                    setCustomDates={setCustomDates}
                />
                <TopExpensesCard expenseData={expenseData} />
            </div>
        </TabsContent>
    );
};

export const TopExpensesCard: React.FC<{ expenseData: ExpenseDataType[] }> = ({ expenseData }) => {
    const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.value, 0);
    const topExpenses = [...expenseData].sort((a, b) => b.value - a.value).slice(0, 4);

    return (
        <DashboardCard title="Top Expenses">
            <div className="space-y-4">
                {topExpenses.map((expense) => {
                    const percentage = totalExpenses > 0 ? ((expense.value / totalExpenses) * 100).toFixed(1) : 0;
                    return (
                        <ExpenseItem
                            key={expense.name}
                            icon={<ExpenseIcon category={expense.name} size={16} />}
                            name={expense.name}
                            amount={`$${expense.value.toLocaleString()}`}
                            percentage={percentage.toString()}
                            />
                    );
                })}
            </div>
            {/* <Button variant="outline" size="sm" className="w-full mt-6">
                View All Categories
            </Button> */}
        </DashboardCard>
    );
};
const ExpenseIcon: React.FC<{ category: string; size: number }> = ({ category, size }) => {
    const icons: Record<string, React.ReactElement> = {
        "Housing": <Home size={size} />,
        "Food": <ShoppingBag size={size} />,
        "Shopping": <CreditCard size={size} />,
        "Travel": <Plane size={size} />,
    };
    return icons[category] || <CreditCard size={size} />;
};


export const ExpenseItem:React.FC<ExpenseItemProps> = ({ icon, name, amount, percentage }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    {React.cloneElement(icon, { className: "text-slate-400" })}
                    <span>{name}</span>
                </div>
                <span className="font-medium">{amount}</span>
            </div>
            <Progress value={Number(percentage)} className="h-2" />
        </div>
    );
};

export const ExpenseBreakdownChart:React.FC<ExpenseBreakdownChartProps> = ({ timeframe, setTimeframe, expenseData, setCustomDates }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [customStartDate, setCustomStartDate] = useState<Date|undefined>(undefined);
    const [customEndDate, setCustomEndDate] = useState<Date|null>(null);

    const handleCustomDateRange = () => {
        setShowDatePicker(true);
    };

    const applyCustomDateFilter = () => {
        if (customStartDate && customEndDate) {
            setCustomDates(customStartDate.toISOString().split('T')[0],customEndDate.toISOString().split('T')[0]);
            setTimeframe("custom");
            setShowDatePicker(false);
        }
    };
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
                        onClick={handleCustomDateRange}
                    >
                        Custom
                    </Button>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center items-center">
                    {expenseData.length === 0 ? (
                        <p className="text-gray-500">No expense data available for this period.</p>
                    ) : (
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
                    )}
                </div>
                <ExpenseBreakdownLegend expenseData={expenseData} />
            </div>
            {showDatePicker && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Start Date</label>
                            <DatePicker
                                selected={customStartDate}
                                onChange={(date) => setCustomStartDate(date ?? undefined)}
                                className="border p-2 w-full rounded"
                                selectsStart
                                startDate={customStartDate}
                                endDate={customEndDate}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">End Date</label>
                            <DatePicker
                                selected={customEndDate}
                                onChange={(date) => setCustomEndDate(date)}
                                className="border p-2 w-full rounded"
                                selectsEnd
                                startDate={customStartDate}
                                endDate={customEndDate}
                                minDate={customStartDate}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowDatePicker(false)}>
                                Cancel
                            </Button>
                            <Button variant="default" onClick={applyCustomDateFilter}>
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardCard>
    );
};

export const ExpenseBreakdownLegend: React.FC<{ expenseData: ExpenseDataType[] }> = ({ expenseData }) => {
    const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.value, 0);

    const biggestExpense = expenseData.length > 0
        ? expenseData.reduce((max, expense) => (expense.value > max.value ? expense : max), expenseData[0])
        : null;
    return (
        <div className="flex flex-col justify-center">
            {expenseData.map((item) => (
                <div key={item.name} className="flex items-center mb-3">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1">{item.name}</div>
                    <div className="font-medium">${item.value}</div>
                </div>
            ))}
            <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>Total Expenses:</span>
                    <span className="font-medium text-slate-900 dark:text-white">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                    <span>Biggest Expense:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{biggestExpense?.name}</span>
                </div>
            </div>
        </div>
    );
};
