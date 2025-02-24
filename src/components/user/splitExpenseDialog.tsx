import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GroupExpense } from '@/pages/user/Groups'

interface Member {
    email: string;
    name: string;
}
interface Group {
    members: Member[];
}
interface SplitExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group;
    onSubmit: (expense: GroupExpense) => void;
    loading: boolean;
}

const SplitExpenseDialog: React.FC<SplitExpenseDialogProps> = ({
    isOpen,
    onClose,
    group,
    onSubmit,
    loading
}) => {
    const [splitType, setSplitType] = useState('equal');
    const [shares, setShares] = useState<Record<string, number>>({});
    const [expense, setExpense] = useState<GroupExpense>({
        date: new Date().toLocaleDateString(),
        title: '',
        totalAmount: 0,
        paidBy: '',
        splitMethod: 'equal',
        shares: {}
    });

    const calculateEqualShares = (amount: number) => {
        const memberCount = group.members.length;
        const equalShare = amount / memberCount;
        const newShares: Record<string, number> = {};
        group.members.forEach(member => {
            newShares[member.email] = equalShare;
        });
        return newShares;
    };

    const handleAmountChange = (value: string) => {
        const amount = parseFloat(value) || 0;
        setExpense(prev => ({
            ...prev,
            totalAmount: amount
        }));

        if (splitType === 'equal' && !isNaN(amount)) {
            setShares(calculateEqualShares(amount));
        }
    };

    const handleSplitTypeChange = (value: string) => {
        setSplitType(value);
        if (value === 'equal' && expense.totalAmount) {
            setShares(calculateEqualShares(expense.totalAmount));
        } else {
            setShares({});
        }
        setExpense(prev => ({ ...prev, splitMethod: value }));
    };

    const handleShareChange = (memberEmail: string, value: number) => {
        const newShares = { ...shares };
        
        if (splitType === 'percentage') {
            newShares[memberEmail] = value; 
        } else {
            newShares[memberEmail] = value;
        }
    
        setShares(newShares);
        setExpense(prev => ({ ...prev, shares: newShares }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...expense,
            shares: shares
        });
    };

    const validateShares = () => {
        if (splitType === 'equal') return true;

        const totalAmount = expense.totalAmount;
        if (isNaN(totalAmount)) return false;

        const shareSum = Object.values(shares).reduce((sum, share) => sum + (share || 0), 0);

        if (splitType === 'percentage') {
            return Math.abs(shareSum - 100) < 0.01;
        } else {
            return Math.abs(shareSum - totalAmount) < 0.01;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Split Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            placeholder="What's this expense for?"
                            value={expense.title}
                            onChange={(e) => setExpense(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={expense.totalAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Paid By</Label>
                        <Select
                            value={expense.paidBy}
                            onValueChange={(value) => setExpense(prev => ({ ...prev, paidBy: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Who paid?" />
                            </SelectTrigger>
                            <SelectContent>
                                {group.members.map(member => (
                                    <SelectItem key={member.email} value={member.email}>
                                        {member.name} ({member.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Split Type</Label>
                        <Select value={splitType} onValueChange={handleSplitTypeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="How to split?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="equal">Equal Split</SelectItem>
                                <SelectItem value="percentage">Percentage Split</SelectItem>
                                <SelectItem value="custom">Custom Split</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {splitType !== 'equal' && expense.totalAmount && (
                        <Card className="p-4">
                            <h4 className="font-medium mb-4">Split Shares</h4>
                            <div className="space-y-3">
                                {group.members.map(member => (
                                    <div key={member.email} className="flex items-center gap-4">
                                        <span className="w-1/3">{member.name}</span>
                                        <Input
                                            type="number"
                                            value={shares[member.email] || ''}
                                            onChange={(e) => handleShareChange(member.email, parseFloat(e.target.value) || 0)}
                                            placeholder={splitType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                                            className="w-1/3"
                                            step={splitType === 'percentage' ? '0.1' : '0.01'}
                                            min="0"
                                            max={splitType === 'percentage' ? '100' : expense.totalAmount}
                                        />
                                        <span className="w-1/3">
                                            {splitType === 'percentage'
                                                ? `$${((shares[member.email] || 0) * expense.totalAmount / 100).toFixed(2)}` // 💡 Correct calculation
                                                : `${((shares[member.email] || 0) / expense.totalAmount * 100).toFixed(1)}%`
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !expense.title || !expense.totalAmount || !expense.paidBy || !validateShares()}
                    >
                        {loading ? 'Adding...' : 'Add Split Expense'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SplitExpenseDialog;