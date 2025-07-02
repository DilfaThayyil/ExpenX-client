import { Wallet, CreditCard, Download, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyComponent } from "./empty/Empty";
import { WalletComponentProps} from './types'


export const WalletComponent = ({ transactions, wallet, loading }: WalletComponentProps) => {
    const totalIncome = transactions.reduce((sum, txn) => txn.type === "credit" ? sum + txn.amount : sum, 0);
    const totalExpense = transactions.reduce((sum, txn) => txn.type === "debit" ? sum + txn.amount : sum, 0);

    const hasWallet = wallet !== null && typeof wallet.balance === "number";

    return (
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-200 to-emerald-300 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 text-emerald-600 mr-2" />
                    My Wallet
                </CardTitle>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-pulse text-gray-500 text-sm">Loading transactions...</div>
                    </div>
                ) : !hasWallet ? (
                    <div className="text-center py-10">
                        <p className="text-xl font-semibold text-gray-700">No wallet found</p>
                        <p className="text-gray-500">You don't have a wallet yet. Please make a payment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col items-center justify-center h-full">
                            <div className="absolute top-0 right-0 opacity-10">
                                <CreditCard className="h-32 w-32" />
                            </div>
                            <div className="space-y-4 text-center">
                                <div className="space-y-1">
                                    <p className="text-emerald-100 text-sm">Available Balance</p>
                                    <h3 className="text-3xl font-bold tracking-tight">₹{wallet.balance.toFixed(2)}</h3>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center justify-center gap-6 text-sm">
                                        <div className="flex items-center">
                                            <Download className="h-4 w-4 mr-1 text-green-300" />
                                            <span>Income: ₹{totalIncome}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Upload className="h-4 w-4 mr-1 text-red-300" />
                                            <span>Expense: ₹{totalExpense}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
                            <h4 className="font-medium text-gray-800 mb-3">Recent Transactions</h4>
                            <div className="flex-1 space-y-3 overflow-y-auto max-h-60">
                                {transactions.length === 0 ? (
                                    <EmptyComponent />
                                ) : (
                                    transactions.map((txn) => (
                                        <div
                                            key={txn._id}
                                            className="flex items-center justify-between py-2 border-b border-gray-100"
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${txn.type === "credit" ? "bg-green-100" : "bg-red-100"
                                                        }`}
                                                >
                                                    {txn.type === "credit" ? (
                                                        <Download className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Upload className="h-4 w-4 text-red-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{txn.description}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(txn.createdAt).toLocaleDateString()}{" "}
                                                        {new Date(txn.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`font-medium ${txn.type === "credit" ? "text-green-600" : "text-red-600"
                                                    }`}
                                            >
                                                {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            >
                                Have a nice day 😉
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
