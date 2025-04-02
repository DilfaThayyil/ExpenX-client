import NetWorthCard from './NetworthCard';
import SavingsGoalCard from './SavingsGoalCard';
import IncomeExpenseChart from './IncomeExpenseChart';
import RecentTransactions from './RecentTransactions';

// Sample data
const incomeVsExpenseData = [
    { name: 'Jan', income: 4500, expenses: 3200 },
    { name: 'Feb', income: 4800, expenses: 3400 },
    { name: 'Mar', income: 5000, expenses: 2800 },
    { name: 'Apr', income: 4700, expenses: 3100 },
    { name: 'May', income: 5200, expenses: 3500 },
    { name: 'Jun', income: 5500, expenses: 3300 }
];

const transactionData = [
    { id: 1, type: 'Income', description: 'Salary', amount: 5000, date: '2025-03-15', category: 'Income' },
    { id: 2, type: 'Expense', description: 'Rent', amount: 1500, date: '2025-03-10', category: 'Housing' },
    { id: 3, type: 'Expense', description: 'Groceries', amount: 300, date: '2025-03-20', category: 'Food' },
    { id: 4, type: 'Expense', description: 'Flight Tickets', amount: 800, date: '2025-03-05', category: 'Travel' },
    { id: 5, type: 'Investment', description: 'Stock Purchase', amount: 2000, date: '2025-03-12', category: 'Investment' }
];

const ClientOverview = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NetWorthCard value={152450} changePercentage={4.2} />
                <SavingsGoalCard current={35000} target={50000} />
                <IncomeExpenseChart data={incomeVsExpenseData} />
            </div>
            <RecentTransactions transactions={transactionData} />
        </>
    );
};

export default ClientOverview;