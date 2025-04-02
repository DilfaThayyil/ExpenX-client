import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

const IncomeExpenseChart = ({ data }) => {
    return (
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
                    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
    );
};

export default IncomeExpenseChart;