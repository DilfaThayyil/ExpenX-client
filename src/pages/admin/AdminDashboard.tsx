import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import { fetchMonthlyTrends, fetchExpenseCategories, fetchDashboardStats, fetchUserGrowth } from '@/services/admin/adminServices'
import { AdminNavbar } from '@/layout/AdminNav'
import { MonthlyData, CategoryData, DashboardStats } from './types'



const AdminDashboard = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [userGrowth, setUserGrowth] = useState([])
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPayments: 0,
    averageExpense: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [monthlyResponse, categoryResponse, statsResponse, userGrowthResponse] = await Promise.all([
        fetchMonthlyTrends(),
        fetchExpenseCategories(),
        fetchDashboardStats(),
        fetchUserGrowth()
      ]);
      setMonthlyData(monthlyResponse);
      setCategoryData(categoryResponse);
      setStats(statsResponse);
      setUserGrowth(userGrowthResponse)
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !monthlyData.length) {
    return (
      <Layout role='admin'>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout role="admin">
        <AdminNavbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all"
            >
              {loading ? "Retrying..." : "Retry"}
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout role='admin'>
      <AdminNavbar />
      <div className="p-16 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800"> Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Payments</p>
                <h3 className="text-2xl font-bold">{stats.totalPayments}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Expense</p>
                <h3 className="text-2xl font-bold">${stats.averageExpense}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${value}`, undefined]}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    name="Expenses"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    name="Income"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Expense Categories</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${value}`, undefined]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;