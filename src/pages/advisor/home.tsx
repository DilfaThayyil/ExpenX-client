import { useEffect, useState } from "react";
import Layout from "@/layout/Sidebar";
import StatsCards from "@/components/dashboard/advisor/StatsCard";
import RevenueChart from "@/components/dashboard/advisor/RevenueChart";
import GoalProgressChart from "@/components/dashboard/advisor/GoalProgressChart";
import AppointmentsList from "@/components/dashboard/advisor/AppointmentsList";
import ClientActivities from "@/components/dashboard/advisor/ClientActivities";
import { moneyColors } from "@/style/theme";
import { fetchDashboard, fetchRevenue,fetchClientGoals } from '@/services/advisor/advisorService'
import Store from '@/store/store'

interface Stats {
  totalRevenue: number
  activeClients: number
  completedGoals: number
  slotUtilization: number
}

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>("monthly");
  const [revenueData, setRevenueData] = useState<Record<string, { name: string; revenue: number }[]>>({});
  const [goalProgress,setGoalProgress] = useState<{ completed: number; inProgress: number; notStarted: number }>({
    completed: 0,
    inProgress: 0,
    notStarted: 0
  })
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    activeClients: 0,
    completedGoals: 0,
    slotUtilization: 0
  });
  const advisor = Store((state) => state.user)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchDashboard(advisor._id)
        console.log("response-stats : ", response)
        setStats({
          totalRevenue: response.totalRevenue,
          activeClients: response.activeClients,
          completedGoals: response.completedGoals,
          slotUtilization: Math.floor(response.slotUtilization),
        })
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        console.log("revenueData : ", advisor._id, ",", timeframe)
        const response = await fetchRevenue(advisor._id, timeframe);
        console.log(`response-(${timeframe}):`, response);
        setRevenueData({
          [timeframe]: Array.isArray(response) ? response : [{ name: timeframe, revenue: response.revenue }]
        });
      } catch (error) {
        console.error(`Error fetching ${timeframe} revenue:`, error);
      }
    };
    fetchRevenueData();
  }, [timeframe]);

  useEffect(()=>{
    const fetchClientGoalProgress = async()=>{
      try{
        const response = await fetchClientGoals(advisor._id)
        console.log("response-clientProgress : ",response)
        setGoalProgress(response.clientGoalProgress)
      }catch(err){
        console.error('Error fetching clientGoalsProgress : ',err)
      }
    }
    fetchClientGoalProgress()
  },[])

  return (
    <Layout role="advisor">
      <div className="p-6 space-y-6 w-full min-h-screen" style={{ backgroundColor: moneyColors.bg.muted }}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* Stats Overview Cards */}
        <StatsCards stats={stats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RevenueChart timeframe={timeframe} setTimeframe={setTimeframe} revenueData={revenueData} />
          <GoalProgressChart timeframe={timeframe} setTimeframe={setTimeframe} goalProgress={goalProgress}/>
        </div>

        {/* Client Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <AppointmentsList advisorId={advisor._id} />
          <ClientActivities advisorId={advisor._id}/>
        </div>

        {/* Client Stats Table */}
        {/* <ClientPerformance /> */}
      </div>
    </Layout>
  );
}
