import { Wallet, RefreshCw, CreditCard, ArrowUpCircle, ArrowDownCircle, Plus, ArrowUpRight, Download, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyComponent } from "./empty/Empty";



export const WalletComponent = ({ transactions, loading, wallet }) => {
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((transaction) => {
        if (transaction.type === "credit") {
            totalIncome += transaction.amount;
        } else if (transaction.type === "debit") {
            totalExpense += transaction.amount;
        }
    });
    return (
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-200 to-emerald-300 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 text-emerald-600 mr-2" />
                    My Wallet
                </CardTitle>
                {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                    onClick={fetchTransactions} // Refresh Transactions
                >
                    <RefreshCw className="h-4 w-4 mr-1" /> Update
                </Button> */}
            </CardHeader>

            <CardContent>
                {loading ? (
                    <p className="text-center text-gray-500">Loading transactions...</p>
                ) : !wallet || !wallet.balance ? (
                    <div className="text-center py-10">
                        <p className="text-xl font-semibold text-gray-700">No wallet found</p>
                        <p className="text-gray-500">You don't have a wallet yet. Please make a payment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Wallet Balance */}
                        <div className="md:col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col items-center justify-center h-full">
                            <div className="absolute top-0 right-0 opacity-10">
                                <CreditCard className="h-32 w-32" />
                            </div>
                            <div className="space-y-4 text-center">
                                <div className="space-y-1">
                                    <p className="text-emerald-100 text-sm">Available Balance</p>
                                    <h3 className="text-3xl font-bold tracking-tight">₹{wallet.balance}</h3>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    {/* <div className="flex items-center">
                                        <ArrowUpCircle className="h-4 w-4 mr-1 text-emerald-300" />
                                        <span>Income: ${income.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ArrowDownCircle className="h-4 w-4 mr-1 text-emerald-300" />
                                        <span>Expense: ${expense.toFixed(2)}</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <h4 className="font-medium text-gray-800 mb-3">Recent Transactions</h4>
                            <div className="space-y-3">
                                {transactions.length === 0 ? (
                                    <EmptyComponent />
                                ) : (
                                    transactions.slice(0, 3).map((transaction) => (
                                        <div
                                            key={transaction._id}
                                            className="flex items-center justify-between py-2 border-b border-gray-100"
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                                                        }`}
                                                >
                                                    {transaction.type === "credit" ? (
                                                        <Download className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Upload className="h-4 w-4 text-red-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{transaction.description}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                                                        {new Date(transaction.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                                    }`}
                                            >
                                                {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button variant="ghost" size="sm" className="w-full mt-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                Have a nice day 😉
                            </Button>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    )
}