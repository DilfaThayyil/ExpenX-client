import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import Layout from '@/layout/Sidebar';

const AdminDashboard = () => {
  // Sample data - Replace with your actual API calls
  const monthlyData = [
    { month: 'Jan', expenses: 12500, income: 15000, users: 120 },
    { month: 'Feb', expenses: 11000, income: 16500, users: 150 },
    { month: 'Mar', expenses: 13000, income: 14000, users: 180 },
    { month: 'Apr', expenses: 14500, income: 17000, users: 200 },
    { month: 'May', expenses: 12000, income: 16000, users: 220 },
    { month: 'Jun', expenses: 13500, income: 18000, users: 250 },
  ];

  const stats = {
    totalUsers: 250,
    totalPayments: 1250,
    averageExpense: 580,
    totalRevenue: 96500
  };

  const categoryData = [
    { category: 'Food', amount: 25000 },
    { category: 'Transport', amount: 15000 },
    { category: 'Shopping', amount: 20000 },
    { category: 'Bills', amount: 18000 },
    { category: 'Entertainment', amount: 12000 },
  ];

  return (
    <Layout role='admin'>

    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Total Payments Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Payments</p>
              <h3 className="text-2xl font-bold">{stats.totalPayments}</h3>
            </div>
            <CreditCard className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Average Expense Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Expense</p>
              <h3 className="text-2xl font-bold">${stats.averageExpense}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" />
                <Line type="monotone" dataKey="income" stroke="#22c55e" name="Income" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Expense Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">User Growth</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8b5cf6" name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    </Layout>
  );
};

export default AdminDashboard;