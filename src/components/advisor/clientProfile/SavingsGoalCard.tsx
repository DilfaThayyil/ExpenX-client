import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign } from 'lucide-react';

const SavingsGoalCard = ({ current, target }) => {
    const percentComplete = Math.round((current / target) * 100);
    
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign size={18} className="text-blue-500" />
                    Savings Goal
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">${current.toLocaleString()}</div>
                    <div className="text-sm font-medium text-slate-500">
                        of ${target.toLocaleString()}
                    </div>
                </div>
                <Progress value={percentComplete} className="h-2 mt-2" />
                <div className="text-sm text-slate-500 mt-2">{percentComplete}% completed</div>
            </CardContent>
        </Card>
    );
};

export default SavingsGoalCard;