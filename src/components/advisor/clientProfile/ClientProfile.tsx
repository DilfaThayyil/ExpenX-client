import { getClientMeetings, getClient, getExpenseByCategory } from '@/services/advisor/advisorService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MeetingCalendar from './MeetingCalender';
import RecentTransactions from './RecentTransactions'
import { DocumentsTab } from './DocumentsTab';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ExpensesTab } from './ExpenseTab';
import ClientHeader from './ClientHeader';
import MeetingsTab from './MeetingsTab';
import Layout from "@/layout/Sidebar";
import Store from '@/store/store'


const transactionData = [
    { id: 1, type: 'Income', description: 'Salary', amount: 5000, date: '2025-03-15', category: 'Income' },
    { id: 2, type: 'Expense', description: 'Rent', amount: 1500, date: '2025-03-10', category: 'Housing' },
    { id: 3, type: 'Expense', description: 'Groceries', amount: 300, date: '2025-03-20', category: 'Food' },
    { id: 4, type: 'Expense', description: 'Flight Tickets', amount: 800, date: '2025-03-05', category: 'Travel' },
];


const ClientProfilePage = () => {
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
    const [meetings, setMeetings] = useState([]);
    const [client, setClient] = useState(null)
    const [expense, setExpense] = useState([])
    const [expenseTimeframe, setExpenseTimeframe] = useState('30days');
    const [activeTab, setActiveTab] = useState('transactions');
    const { clientId } = useParams()
    const advisorId = Store((state) => state.user._id)
    console.log("clientId-clientProfilePage : ", clientId)

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await getClientMeetings(clientId, advisorId)
            console.log("meetings ; ", response.clientMeetings)
            setMeetings(response.clientMeetings)
        }
        fetchMeetings()
    }, [clientId])

    useEffect(() => {
        const fetchClient = async () => {
            const response = await getClient(clientId)
            setClient(response.client)
        }
        fetchClient()
    }, [clientId])

    useEffect(() => {
        const fetchExpenseData = async () => {
            try {
                const response = await getExpenseByCategory(clientId, expenseTimeframe, customStartDate, customEndDate);
                const formattedData = response.expenses.map(exp => ({
                    name: exp.category,
                    value: exp.totalAmount,
                    color: getCategoryColor(exp.category)
                }));
                console.log("formatedDta-fetchExpense ^^^^^^ ", formattedData)
                setExpense(formattedData);
            } catch (error) {
                console.error("Error fetching expense data:", error);
            }
        };
        fetchExpenseData();
    }, [clientId, expenseTimeframe, customStartDate, customEndDate]);

    const setCustomDates = (start, end) => {
        setCustomStartDate(start);
        setCustomEndDate(end);
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            Utility: '#3b82f6',
            Entertainment: '#502966',
            Education: '#e62e77',
            Movie: '#e8502e',
            Food: '#22c55e',
            Shopping: '#f59e0b',
            Travel: '#8b5cf6',
            Other: '#64748b'
        };
        return colors[category] || '#000000';
    };

    const getMeetingDetails = (meetings) => {
        const today = new Date();
        const sortedMeetings = meetings.sort((a, b) => new Date(a.date) - new Date(b.date));
        let lastMeeting = null;
        let nextMeeting = null;
        for (const meeting of sortedMeetings) {
            const meetingDate = new Date(meeting.date);
            if (meetingDate < today) {
                lastMeeting = meeting;
            } else if (!nextMeeting && meetingDate >= today) {
                nextMeeting = meeting;
            }
        }
        return { lastMeeting, nextMeeting };
    };
    const { lastMeeting, nextMeeting } = getMeetingDetails(meetings);

    return (
        <Layout role='advisor'>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
                <ClientHeader client={client} lastMeeting={lastMeeting} nextMeeting={nextMeeting} />

                {/* Main Content with Tabs */}
                <Tabs defaultValue="transactions" className="w-full" onValueChange={setActiveTab}>
                    <div className="mb-6 overflow-x-auto">
                        <TabsList className="bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm">
                            <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Transactions
                            </TabsTrigger>
                            <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Expenses
                            </TabsTrigger>
                            {/* <TabsTrigger value="investments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Investments
                            </TabsTrigger> */}
                            <TabsTrigger value="meetings" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Meetings
                            </TabsTrigger>
                            <TabsTrigger value="calender" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Calender
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-700">
                                Documents
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Overview Tab */}
                    <TabsContent value="transactions" className="mt-0">
                        <RecentTransactions clientId={clientId}/>
                    </TabsContent>

                    <TabsContent value="expenses" className="mt-0">
                        <ExpensesTab
                            expenseTimeframe={expenseTimeframe}
                            setExpenseTimeframe={setExpenseTimeframe}
                            expenseData={expense}
                            setCustomDates={setCustomDates}
                        />
                    </TabsContent>

                    <TabsContent value="meetings" className="mt-0">
                        <MeetingsTab meetings={meetings} />
                    </TabsContent>

                    <TabsContent value="calender" className="mt-0">
                        <MeetingCalendar meetings={meetings} />
                    </TabsContent>

                    <TabsContent value="documents" className="mt-0">
                        <DocumentsTab clientId={clientId} />
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default ClientProfilePage;