import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SettleUpDialogProps, Settlement, Errors, Balance } from './types'


const SettleUpDialog: React.FC<SettleUpDialogProps> = ({ isOpen, onClose, group, onSubmit, loading, currentUserEmail }) => {
    const [settlement, setSettlement] = useState<Settlement>({
        from: currentUserEmail,
        to: '',
        amount: 0,
        date: new Date().toLocaleDateString(),
    });

    const [errors, setErrors] = useState<Errors>({
        from: '',
        to: '',
        amount: '',
    });

    const [balances, setBalances] = useState<Balance[]>([]);

    useEffect(() => {
        if (isOpen && group) {
            setSettlement({
                from: currentUserEmail,
                to: '',
                amount: 0,
                date: new Date().toLocaleDateString(),
            });

            setErrors({
                from: '',
                to: '',
                amount: '',
            });

            calculateBalances();
        }
    }, [isOpen, group, currentUserEmail]);

    const calculateBalances = () => {
        const balanceMap: Record<string, number> = {};

        group.members.forEach(member => {
            balanceMap[member.email] = 0;
        });

        group.expenses.forEach(expense => {
            balanceMap[expense.paidBy] += expense.totalAmount;

            expense.splits?.forEach(split => {
                balanceMap[split.user] -= split.amountOwed;
            });
        });

        group.settlements?.forEach(settlement => {
            balanceMap[settlement.from] -= settlement.amount;
            balanceMap[settlement.to] += settlement.amount;
        });

        const balanceArray: Balance[] = Object.entries(balanceMap).map(([email, balance]) => {
            const member = group.members.find(m => m.email === email);
            return {
                email,
                name: member?.name || email,
                balance,
            };
        });

        setBalances(balanceArray);
    };

    const handleFromChange = (value: string) => {
        setSettlement(prev => ({ ...prev, from: value }));
        if (value === settlement.to) {
            setErrors(prev => ({ ...prev, to: "Payer and receiver can't be the same" }));
        } else {
            setErrors(prev => ({ ...prev, from: '', to: '' }));
        }
    };

    const handleToChange = (value: string) => {
        setSettlement(prev => ({ ...prev, to: value }));
        if (value === settlement.from) {
            setErrors(prev => ({ ...prev, to: "Payer and receiver can't be the same" }));
        } else {
            setErrors(prev => ({ ...prev, to: '' }));
        }
    };

    const handleAmountChange = (value: string) => {
        const amount = parseFloat(value) || 0;

        if (amount <= 0) {
            setErrors(prev => ({ ...prev, amount: 'Amount must be greater than zero' }));
        } else {
            setErrors(prev => ({ ...prev, amount: '' }));
        }

        setSettlement(prev => ({ ...prev, amount }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Errors = {
            from: !settlement.from ? 'Payer is required' : '',
            to: !settlement.to ? 'Receiver is required' : '',
            amount: !settlement.amount || settlement.amount <= 0 ? 'Amount must be greater than zero' : '',
        };

        if (settlement.from === settlement.to) {
            newErrors.to = "Payer and receiver can't be the same";
        }

        if (Object.values(newErrors).some(error => error)) {
            setErrors(newErrors);
            return;
        }

        onSubmit(settlement);
    };

    const getRecommendedSettlements = () => {
        const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
        const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);

        if (debtors.length === 0 || creditors.length === 0) {
            return null;
        }

        const currentUserBalance = balances.find(b => b.email === currentUserEmail);

        if (currentUserBalance) {
            if (currentUserBalance.balance < 0) {
                const topCreditor = creditors[0];
                if (topCreditor) {
                    return {
                        from: currentUserEmail,
                        to: topCreditor.email,
                        toName: topCreditor.name,
                        amount: Math.min(Math.abs(currentUserBalance.balance), topCreditor.balance),
                    };
                }
            } else if (currentUserBalance.balance > 0) {
                const topDebtor = debtors[0];
                if (topDebtor) {
                    return {
                        from: topDebtor.email,
                        fromName: topDebtor.name,
                        to: currentUserEmail,
                        amount: Math.min(Math.abs(topDebtor.balance), currentUserBalance.balance),
                    };
                }
            }
        }

        const topDebtor = debtors[0];
        const topCreditor = creditors[0];

        if (topDebtor && topCreditor) {
            return {
                from: topDebtor.email,
                fromName: topDebtor.name,
                to: topCreditor.email,
                toName: topCreditor.name,
                amount: Math.min(Math.abs(topDebtor.balance), topCreditor.balance),
            };
        }

        return null;
    };

    const applyRecommendedSettlement = () => {
        const recommended = getRecommendedSettlements();
        if (recommended) {
            setSettlement({
                ...settlement,
                from: recommended.from,
                to: recommended.to,
                amount: recommended.amount,
            });
            setErrors({
                from: '',
                to: '',
                amount: '',
            });
        }
    };

    const recommendedSettlement = getRecommendedSettlements();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Settle Up</DialogTitle>
                </DialogHeader>

                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Current Balances</h3>
                    <div className="max-h-40 overflow-y-auto">
                        {balances.map((balance) => (
                            <div
                                key={balance.email}
                                className="flex justify-between items-center py-1 border-b border-gray-200"
                            >
                                <span className="font-medium">{balance.name}</span>
                                <span className={`font-medium ${balance.balance > 0 ? 'text-green-600' : balance.balance < 0 ? 'text-red-600' : ''}`}>
                                    {balance.balance > 0 ? '+' : ''}{balance.balance.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {recommendedSettlement && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                        <h3 className="text-md font-medium mb-2">Recommended Settlement</h3>
                        <div className="text-sm">
                            <p>
                                <span className="font-medium">{recommendedSettlement.fromName || recommendedSettlement.from}</span>
                                {' '}pays{' '}
                                <span className="font-medium">{recommendedSettlement.toName || recommendedSettlement.to}</span>
                                {' '}<span className="font-bold">₹{recommendedSettlement.amount.toFixed(2)}</span>
                            </p>
                            <button
                                type="button"
                                onClick={applyRecommendedSettlement}
                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Apply This Settlement
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                            Payer
                        </label>
                        <select
                            id="from"
                            value={settlement.from}
                            onChange={(e) => handleFromChange(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select Payer</option>
                            {group?.members.map((member) => (
                                <option key={`from-${member.email}`} value={member.email}>
                                    {member.name} {member.email === currentUserEmail ? '(You)' : ''}
                                </option>
                            ))}
                        </select>
                        {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from}</p>}
                    </div>

                    <div>
                        <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                            Receiver
                        </label>
                        <select
                            id="to"
                            value={settlement.to}
                            onChange={(e) => handleToChange(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select Receiver</option>
                            {group?.members.map((member) => (
                                <option key={`to-${member.email}`} value={member.email}>
                                    {member.name} {member.email === currentUserEmail ? '(You)' : ''}
                                </option>
                            ))}
                        </select>
                        {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to}</p>}
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (₹)
                        </label>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={settlement.amount || ''}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={settlement.date}
                            onChange={(e) => setSettlement(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Settlement'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SettleUpDialog;