import { useEffect, useState } from 'react';
import Layout from "@/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientHeader from './ClientHeader';
import ClientOverview from './ClientOverview';
import MeetingsTab from './MeetingsTab';
import { ExpensesTab } from './ExpenseTab';
import { InvestmentsTab } from './InvestmentsTab';
import { DocumentsTab } from './DocumentsTab';
import { useParams } from 'react-router-dom';
import { getClientMeetings } from '@/services/advisor/advisorService';


const investmentData = [
    { name: 'Jan', value: 10000 },
    { name: 'Feb', value: 11500 },
    { name: 'Mar', value: 13000 },
    { name: 'Apr', value: 12500 },
    { name: 'May', value: 14000 },
    { name: 'Jun', value: 16000 }
];
const investmentPortfolio = [
    { name: 'S&P 500 ETF', type: 'ETF', amount: '$5,000', growth: '+12%', risk: 'Medium' },
    { name: 'Tech Fund', type: 'Mutual Fund', amount: '$3,000', growth: '+18%', risk: 'High' },
    { name: 'Bond Fund', type: 'Bond', amount: '$4,000', growth: '+5%', risk: 'Low' },
    { name: 'Real Estate Trust', type: 'REIT', amount: '$2,000', growth: '+8%', risk: 'Medium' },
    { name: 'Bitcoin', type: 'Crypto', amount: '$1,000', growth: '+45%', risk: 'Very High' }
];
const expenseData = [
    { name: 'Housing', value: 40, color: '#3b82f6' },
    { name: 'Food', value: 20, color: '#22c55e' },
    { name: 'Shopping', value: 15, color: '#f59e0b' },
    { name: 'Travel', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 10, color: '#64748b' }
];
const documentsData = [
    { id: 1, name: 'Q1 Tax Documents', type: 'PDF', date: 'Mar 15, 2025' },
    { id: 2, name: 'Annual Budget', type: 'Excel', date: 'Jan 05, 2025' },
    { id: 3, name: 'Investment Statement', type: 'PDF', date: 'Feb 10, 2025' },
    { id: 4, name: 'Expense Tracker', type: 'Excel', date: 'Mar 01, 2025' }
];

const ClientProfilePage = () => {
    const [meetings, setMeetings] = useState([]);
    const [expenseTimeframe, setExpenseTimeframe] = useState('30days');
    const [activeTab, setActiveTab] = useState('overview');
    const { clientId } = useParams()
    console.log("clientId-clientProfilePage : ", clientId)

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await getClientMeetings(clientId)
            console.log("response-clientProfile-meetings ==>>  ", response.clientMeetings)
            setMeetings(response.clientMeetings)
        }
        fetchMeetings()
    }, [clientId])


    return (
        <Layout role='advisor'>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
                <ClientHeader />

                {/* Main Content with Tabs */}
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                    <div className="mb-6 overflow-x-auto">
                        <TabsList className="bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Expenses
                            </TabsTrigger>
                            <TabsTrigger value="investments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Investments
                            </TabsTrigger>
                            <TabsTrigger value="meetings" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Meetings
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Documents
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0">
                        <ClientOverview />
                    </TabsContent>

                    {/* Meetings Tab */}
                    <TabsContent value="meetings" className="mt-0">
                        <MeetingsTab meetings={meetings} />
                    </TabsContent>

                    {/* Other tabs would be added here */}
                    <TabsContent value="expenses" className="mt-0">
                        <ExpensesTab
                            expenseTimeframe={expenseTimeframe}
                            setExpenseTimeframe={setExpenseTimeframe}
                            expenseData={expenseData}
                        />
                    </TabsContent>

                    <TabsContent value="investments" className="mt-0">
                        <InvestmentsTab
                            investmentData={investmentData}
                            investmentPortfolio={investmentPortfolio}
                        />
                    </TabsContent>

                    <TabsContent value="documents" className="mt-0">
                        <DocumentsTab documentsData={documentsData} />
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default ClientProfilePage;