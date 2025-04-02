import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip,Line,YAxis,XAxis,CartesianGrid,LineChart } from 'recharts';
import { TabsContent } from '@/components/ui/tabs';
import { DashboardCard } from './DocumentsTab';
import { Button } from '@/components/ui/button';
import { ChevronDown,Plus } from 'lucide-react'



export const InvestmentsTab = ({ investmentData, investmentPortfolio }) => {
    return (
        <TabsContent value="investments" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <InvestmentGrowthChart investmentData={investmentData} />
                <InvestmentAllocationChart />
                <InvestmentHoldingsTable investmentPortfolio={investmentPortfolio} />
            </div>
        </TabsContent>
    );
};

export const InvestmentGrowthChart = ({ investmentData }) => {
    return (
        <DashboardCard
            title="Investment Growth"
            className="lg:col-span-2"
            actions={
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
            }
        >
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
                <SummaryItem title="Initial" value="$10,000" />
                <SummaryItem title="Current" value="$16,000" />
                <SummaryItem title="Growth" value="+60%" valueClassName="text-green-600" />
            </div>
        </DashboardCard>
    );
};

export const SummaryItem = ({ title, value, valueClassName = "" }) => {
    return (
        <div className="text-center">
            <div className="text-sm text-slate-500">{title}</div>
            <div className={`font-medium ${valueClassName}`}>{value}</div>
        </div>
    );
};

export const InvestmentAllocationChart = () => {
    const allocationData = [
        { name: 'Stocks', value: 45, color: '#3b82f6' },
        { name: 'ETFs', value: 25, color: '#22c55e' },
        { name: 'Real Estate', value: 20, color: '#f59e0b' },
        { name: 'Crypto', value: 10, color: '#8b5cf6' }
    ];

    return (
        <DashboardCard title="Investment Allocation">
            <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                    <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs">{item.name} ({item.value}%)</span>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
};

export const InvestmentHoldingsTable = ({ investmentPortfolio }) => {
    return (
        <DashboardCard
            title="Investment Holdings"
            className="lg:col-span-3"
            actions={
                <Button variant="outline" size="sm" className="gap-1">
                    <Plus size={16} />
                    Add Investment
                </Button>
            }
        >
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
        </DashboardCard>
    );
};
