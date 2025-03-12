import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import Store from '@/store/store';
import Header from '@/components/dashboard/user/Header';
import BudgetOverview from '@/components/dashboard/user/BudgetOverview'
import SpendingTrend from '@/components/dashboard/user/SpendingTrends'
import RecentActivity from '@/components/dashboard/user/RecentActivity'
import CategoryBreakdown from '@/components/dashboard/user/CategoryBreakdown'
import AchievementCard from '@/components/dashboard/user/AchievementCard'
import {getDashboardData} from '@/services/user/userService'
import {useNavigate} from 'react-router-dom'

const DashboardPage: React.FC = () => {
  const user = Store(state => state.user);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    monthlyExpenses: [],
    trendData: [],
    recentActivity: [],
    budgetInfo: {
      totalSpent: 0,
      budget: 0,
      progress: 0
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData(user._id);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Handle error (you could set an error state and display a message)
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // const refreshDashboard = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await refreshData();
  //     setDashboardData(data);
  //   } catch (error) {
  //     console.error("Error refreshing dashboard data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddExpense = () => {
    navigate('/expenses')
  };

  return (
    <Layout role='user'>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <Header username={user.username} />

        <Button 
          className="fixed bottom-6 right-6 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 z-10"
          onClick={handleAddExpense}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Expense
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <BudgetOverview
              totalSpent={dashboardData.budgetInfo.totalSpent}
              // budget={dashboardData.budgetInfo.budget}
              // progress={dashboardData.budgetInfo.progress}
              loading={loading}
            />

            <SpendingTrend
              data={dashboardData.trendData}
              loading={loading}
            />
            <RecentActivity
              activities={dashboardData.recentActivity}
              loading={loading}
            />
          </div>

          <div className="space-y-6">
            <CategoryBreakdown
              categories={dashboardData.monthlyExpenses}
              loading={loading}
            />
            <AchievementCard
              title="Great job!"
              description={`You've tracked ${dashboardData.recentActivity.length} expenses`}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;