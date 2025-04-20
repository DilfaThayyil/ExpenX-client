import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getTransactions } from '@/services/advisor/advisorService'
import { EmptyComponent } from '@/components/empty/Empty';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react'
import { TransactionProps, Transaction } from './types'


const RecentTransactions: React.FC<TransactionProps> = ({ clientId }) => {

    const [transactions, setTransactions] = useState<Transaction[]>([])
    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await getTransactions(clientId)
            setTransactions(response.transactions)
        }
        fetchTransactions()
    }, [])

    return (
        <Card className="mt-6 overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                    {/* <Button variant="ghost" size="sm" className="text-sm">View All</Button> */}
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
                            {transactions.length > 0 ? (
                                transactions.map((item) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <EmptyComponent />
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;