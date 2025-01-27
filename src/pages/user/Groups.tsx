
import React, { useState,useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip
// } from 'recharts';
import {
    Users,
    Plus,
    //   Settings,
    //   LogOut,
    Receipt,
    //   ArrowRight,
    //   ChevronRight,
    //   UserPlus
} from 'lucide-react';
import Layout from '@/layout/Sidebar';
import { createGroup,getUserGroups} from '../../services/user/userService'
import useShowToast from '@/customHook/showToaster';
// import Loading from '@/style/loading';
import Store from '../../store/store'


// Types
interface Group {
    id: string;
    name: string;
    totalExpenses: number;
    memberCount: number;
    balance: number;
    lastActivity: string;
    members: GroupMember[];
    expenses: GroupExpense[];
    splitMethod?: string;
}

interface GroupMember {
    id: string;
    name: string;
    avatar: string;
    paid: number;
    owed: number;
}

interface GroupExpense {
    date: string;
    description: string;
    amount: string;
    paidBy: string;
    splitMethod: string;
}

interface Group1 {
    name: string;
    members: string[];
    splitMethod: string;
}

const GroupsPage = () => {

    const Toaster = useShowToast()
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [newExpense, setNewExpense] = useState<GroupExpense>({
        date: '',
        description: '',
        amount: '',
        paidBy: '',
        splitMethod: 'equal'
    })
    const [newGroup, setNewGroup] = useState<Group1>({
        name: '',
        members: [],
        splitMethod: ''
    })
    const [groups, setGroups] = useState<Group[]>([])
    
    const [isDialogOpen,setIsDialogOpen] = useState<boolean>(false)
    const email = Store((state)=>state.user.email)

    const [refreshGroups, setRefreshGroups] = useState(false)

    useEffect(()=>{
        const fetchGroups = async()=>{
            try{
                if(!email){
                    console.error('email is required')
                    return
                }
                console.log("email : ",email)
                const response = await getUserGroups(email)
                if (Array.isArray(response)) {
                    setGroups(response)
                } else {
                    console.error('Invalid response format:', response)
                    Toaster('Error fetching groups: Invalid format', 'error')
                }
            }catch(error){
                console.error('Error creating group',error)
                Toaster('errrr fetching groups','error')
            }
        }
        fetchGroups()
    },[email,refreshGroups])
   

    


    //   const categoryData = [
    //     { name: "Food", value: 400, color: "#10B981" },
    //     { name: "Transport", value: 300, color: "#3B82F6" },
    //     { name: "Hotel", value: 800, color: "#F59E0B" },
    //     { name: "Activities", value: 200, color: "#EF4444" }
    //   ];

    const validateForm = () => {
        const errors: string[] = []
        if (!newGroup.name) errors.push('Name is required')
        if (!newGroup.splitMethod) errors.push('splitmethod is required.')
        if (newGroup.members.length === 0) errors.push('Members are required.')
        return errors
    }


    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault()
        const errors = validateForm()
        if (errors.length > 0) {
            errors.forEach((error) => Toaster(error, 'error', true))
            return
        }
        setLoading(true)
        try {
            const response = await createGroup(newGroup)
            // setGroups((prev)=>[...prev,response])
            console.log("-------------response : ", response)
            Toaster('Group creation successfull','success')
            setNewGroup({name:'',members:[],splitMethod:''})
            setIsDialogOpen(false)
            setRefreshGroups(prev => !prev)
        } catch (error) {
            console.error('Error creating group',error)
            Toaster('Failed to create group','error')
        }finally{
            setLoading(false)
        }
    }

    // const handleAddExpense = async () => {
    //     if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) {
    //         Toaster('All fields are required for the expense.', 'error');
    //         return;
    //     }
    //     try {
    //         setLoading(true);
    //         const response = await addExpense(selectedGroup?.id, newExpense);
    //         const updatedGroup = response.data.group;
    //         setGroups((prev) =>
    //             prev.map((group) => (group.id === updatedGroup.id ? updatedGroup : group))
    //         );
    //         setSelectedGroup(updatedGroup);
    //         Toaster('Expense added successfully.', 'success');
    //     } catch (error) {
    //         Toaster('Failed to add expense.', 'error');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // const handleAddExpense = () => {
    //     if (selectedGroup && newExpense.description && newExpense.amount && newExpense.paidBy) {
    //         const newExpenseData: GroupExpense = {
    //             id: selectedGroup.expenses.length + 1,
    //             date: new Date().toISOString().split('T')[0],
    //             description: newExpense.description,
    //             amount: parseFloat(newExpense.amount),
    //             paidBy: newExpense.paidBy,
    //             splitMethod: "Equal"
    //         };
    //         selectedGroup.expenses.push(newExpenseData);
    //         selectedGroup.totalExpenses += newExpenseData.amount;
    //         setNewExpense({ description: '', amount: '', paidBy: '' });
    //     }
    // };

    return (
        <Layout role='user'>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="mr-2 h-4 w-4" /> Create New Group
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Group</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label>Group Name</label>
                                    <Input
                                        placeholder="Enter group name"
                                        value={newGroup.name}
                                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label>Split Method</label>
                                    <Select onValueChange={(value) => setNewGroup({ ...newGroup, splitMethod: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select split method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="equal">Equal Split</SelectItem>
                                            <SelectItem value="percentage">Percentage Split</SelectItem>
                                            <SelectItem value="custom">Custom Split</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label>Add Members</label>
                                    <Input
                                        placeholder="Enter email addresses"
                                        onKeyPress={(e) => {
                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                            if (e.key === 'Enter' && emailRegex.test(e.currentTarget.value)) {
                                                if (!newGroup.members.includes(e.currentTarget.value)) {
                                                    setNewGroup((prev) => ({
                                                        ...prev,
                                                        members: [...prev.members, e.currentTarget.value],
                                                    }));
                                                    e.currentTarget.value = '';
                                                } else {
                                                    alert('This email is already added.');
                                                }
                                            } else if (e.key === 'Enter') {
                                                alert('Please enter a valid email address.');
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    {newGroup.members.length > 0 && (
                                        <ul>
                                            {newGroup.members.map((member, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    {member}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setNewGroup((prev) => ({
                                                                ...prev,
                                                                members: prev.members.filter((_, i) => i !== index),
                                                            }));
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <Button
                                onClick={handleCreateGroup}
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                            >
                                Create Group
                            </Button>

                        </DialogContent>
                    </Dialog>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Groups List */}
                    <div className="space-y-4">
                        {groups.map((group) => (
                            <Card
                                key={group.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${selectedGroup?.id === group.id ? 'ring-2 ring-emerald-500' : ''
                                    }`}
                                onClick={() => setSelectedGroup(group)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">{group.name}</h3>
                                        <Badge variant={group.balance < 0 ? "destructive" : "secondary"}>
                                            {group.balance < 0 ? "You owe" : "You're owed"} ${Math.abs(group.balance)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex -space-x-2">
                                            {group.members.slice(0, 3).map((member) => (
                                                <Avatar key={member.id} className="border-2 border-white">
                                                    <AvatarImage src={member.avatar} alt={member.name} />
                                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                            {group.members.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium border-2 border-white">
                                                    +{group.members.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-600 ml-2">
                                            {group.memberCount} members
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p>Total Expenses: ${group.totalExpenses}</p>
                                        <p className="mt-1">{group.lastActivity}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Center Column - Group Details */}
                    {selectedGroup ? (
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>{selectedGroup.name}</CardTitle>
                                    {/* <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-600">
                        <LogOut className="h-4 w-4" />
                    </Button>
                    </div> */}
                                </CardHeader>
                                <CardContent>
                                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Expenses</p>
                        <p className="text-2xl font-bold text-emerald-600">
                        ${selectedGroup.totalExpenses}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Your Share</p>
                        <p className="text-2xl font-bold text-blue-600">
                        ${selectedGroup.totalExpenses / selectedGroup.memberCount}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Your Balance</p>
                        <p className={`text-2xl font-bold ${selectedGroup.balance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        ${selectedGroup.balance}
                        </p>
                    </div>
                    </div> */}

                                    {/* Members List */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-4">Members</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedGroup.members.map((member) => (
                                                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={member.avatar} alt={member.name} />
                                                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{member.name}</p>
                                                            <p className="text-sm text-gray-600">
                                                                Paid: ${member.paid}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge variant={member.paid < member.owed ? "destructive" : "secondary"}>
                                                        {member.paid < member.owed ? "Owes" : "Owed"} ${Math.abs(member.paid - member.owed)}
                                                    </Badge>
                                                </div>
                                            ))}
                                            <Button variant="outline" className="h-full">
                                                <Users className="mr-2 h-4 w-4" /> Add Member
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expenses Table */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Recent Expenses</h3>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button>
                                                        <Receipt className="mr-2 h-4 w-4" /> Add Expense
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Add New Expense</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <label>Description</label>
                                                            <Input
                                                                placeholder="What was this expense for?"
                                                                value={newExpense.description}
                                                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label>Amount</label>
                                                            <Input
                                                                type="number"
                                                                placeholder="Enter amount"
                                                                value={newExpense.amount}
                                                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label>Paid By</label>
                                                            <Select onValueChange={(value) => setNewExpense({ ...newExpense, paidBy: value })}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Who paid?" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {selectedGroup.members.map(member => (
                                                                        <SelectItem key={member.id} value={member.name}>
                                                                            {member.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <Button className="w-full" >Add Expense</Button>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Paid By</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedGroup.expenses.map((expense) => (
                                                    <TableRow key={expense.id}>
                                                        <TableCell>{expense.date}</TableCell>
                                                        <TableCell>{expense.description}</TableCell>
                                                        <TableCell>{expense.paidBy}</TableCell>
                                                        <TableCell className="text-right">
                                                            ${expense.amount}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Spending Categories
                    <div>
                    <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {categoryData.map((category) => (
                        <div key={category.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm">{category.name}</span>
                            </div>
                            <span className="font-medium">${category.value}</span>
                        </div>
                        ))}
                    </div>
                    </div> */}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="lg:col-span-2">
                            <p className="text-gray-600">Select a group to see details.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default GroupsPage;

