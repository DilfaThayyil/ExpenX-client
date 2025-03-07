// src/components/dashboard/SpendingTrend.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface TrendData {
    date: string;
    expenses: number;
    payments: number
}

interface SpendingTrendProps {
    data: TrendData[];
    loading?: boolean;
}

const SpendingTrend: React.FC<SpendingTrendProps> = ({ data, loading = false }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <p>Loading trend data...</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                            <Line type="monotone" dataKey="expenses" stroke="#10B981" strokeWidth={2} />
                            <Line type="monotone" dataKey="payments" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default SpendingTrend;