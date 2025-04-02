import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

const NetWorthCard = ({ value, changePercentage }) => {
    const isPositive = changePercentage > 0;
    
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign size={18} className="text-blue-500" />
                    Net Worth
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">${value.toLocaleString()}</div>
                    <div className={`${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center text-sm font-medium mb-1`}>
                        {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        {Math.abs(changePercentage)}%
                    </div>
                </div>
                <div className="text-sm text-slate-500 mt-1">Compared to last month</div>
            </CardContent>
        </Card>
    );
};

export default NetWorthCard;    