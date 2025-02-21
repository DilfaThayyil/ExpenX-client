import React, { useState, useEffect } from 'react';
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
    Calendar as CalendarIcon,
    Receipt,
    //   ArrowRight,
    //   ChevronRight,
    //   UserPlus
} from 'lucide-react';
import Layout from '@/layout/Sidebar';
import { createGroup, getUserGroups, addMember, addExpenseInGroup } from '../../services/user/userService'
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
    name: string;
    email: string;
    avatar: string;
    paid: number;
    owed: number;
}

interface GroupExpense {
    id: string;
    date: string;
    description: string;
    amount: number;
    paidBy: string;
    splitMethod?: string;
}

interface Group1 {
    name: string;
    members: string[];
    splitMethod: string;
}

const GroupsPage = () => {

    const Toaster = useShowToast()
    const [member, setMember] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const [newExpense, setNewExpense] = useState<GroupExpense>({
        id: '',
        date: new Date().toISOString(),
        description: '',
        amount: 0,
        paidBy: '',
        splitMethod: 'equal'
    })
    const [newGroup, setNewGroup] = useState<Group1>({
        name: '',
        members: [],
        splitMethod: ''
    })
    const [groups, setGroups] = useState<Group[]>([])
    const [memberError,setMemberError] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const email = Store((state) => state.user.email)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [refreshGroups, setRefreshGroups] = useState(false)

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                if (!email) {
                    console.error('email is required')
                    return
                }
                console.log("email : ", email)
                const response = await getUserGroups(email)
                console.log("response : ", response)
                if (Array.isArray(response)) {
                    setGroups(response)
                } else {
                    console.error('Invalid response format:', response)
                    Toaster('Error fetching groups: Invalid format', 'error')
                }
            } catch (error) {
                console.error('Error fetching groups', error)
                Toaster('errrr fetching groups', 'error')
            }
        }
        fetchGroups()
    }, [email, refreshGroups])


    const handleAddMember = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(member)) {
            setMemberError("Please enter a valid email address");
            return;
        }
        if (newGroup.members.includes(member)) {
            setMemberError("This email is already added");
            return;
        }
        if (!selectedGroup?.id || !member) {
            setMemberError('Member email is required');
            return;
        }
        setMemberError("");
        try {
            setLoading(true);
            const response = await addMember(selectedGroup.id, member);
            console.log("response : ", response)
            if (response.success) {
                Toaster(response.message, 'success');
                setSelectedGroup(response.transformedGroup[0])
                setMember('');
                // setRefreshGroups(prev => !prev);
            } else {
                Toaster(response.message || 'Failed to add member', 'error');
            }
        } catch (error) {
            console.error('Error adding member:', error);
            Toaster('Failed to add member', 'error');
        } finally {
            setLoading(false);
        }
    };
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
            console.log("creatingGroup : ", newGroup)
            const response = await createGroup(newGroup)
            // setGroups((prev)=>[...prev,response])
            console.log("-------------response : ", response)
            Toaster('Group creation successful', 'success')
            setNewGroup({ name: '', members: [], splitMethod: '' })
            setIsDialogOpen(false)
            setRefreshGroups(prev => !prev)
        } catch (error) {
            console.error('Error creating group', error)
            Toaster('Failed to create group', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroup?.id || !newExpense.description || !newExpense.amount || !newExpense.paidBy) {
            Toaster('All fields are required for the expense.', 'error');
            return;
        }

        try {
            setLoading(true)
            console.log("handleAddExpense......")
            const response = await addExpenseInGroup(selectedGroup.id, {
                ...newExpense,
                date: new Date().toISOString(),
                splitMethod: newExpense.splitMethod || selectedGroup.splitMethod || 'equal'
            })
            if (response.success) {
                setGroups(prev =>
                    prev.map(group =>
                        group.id === selectedGroup.id ? response.data.group : group
                    )
                )
                console.log("response : ", response.data)
                setSelectedGroup(response.data.group)
                setNewExpense({
                    id: '',
                    date: new Date().toISOString(),
                    description: '',
                    amount: 0,
                    paidBy: '',
                    splitMethod: 'equal'
                });
                setIsExpenseDialogOpen(false)
                Toaster('Expense added successfully', 'success')
            } else {
                Toaster(response.message || 'Failed to add expense', 'error')
            }
        } catch (error) {
            console.error('Error adding expense:', error)
            Toaster('Failed to add expense', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewExpense({
            ...newExpense,
            [name]: name === 'amount' ? parseFloat(value) : value
        })
    }


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
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (emailRegex.test(e.currentTarget.value)) {
                                                    if (!newGroup.members.includes(e.currentTarget.value)) {
                                                        setNewGroup((prev) => ({
                                                            ...prev,
                                                            members: [...prev.members, e.currentTarget.value],
                                                        }));
                                                        setEmailError("")
                                                        e.currentTarget.value = ''
                                                    } else {
                                                        setEmailError("This email is already added");
                                                    }
                                                } else {
                                                    setEmailError("Please enter a valid email");
                                                }
                                            }
                                        }}
                                    />
                                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

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
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <span className="animate-spin mr-2">◌</span>
                                        Creating...
                                    </div>
                                ) : (
                                    'Create Group'
                                )}
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
                                                <Avatar key={member.email} className="border-2 border-white">
                                                    <AvatarImage src={member.avatar} alt={member.name} />
                                                    <AvatarFallback>{member.name}</AvatarFallback>
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
                                                <div key={member.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={member.avatar} alt={member.name} />
                                                            <AvatarFallback>{member.name}</AvatarFallback>
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
                                            <input
                                                type="text"
                                                placeholder="Enter email address"
                                                value={member}
                                                onChange={(e) => setMember(e.target.value)}
                                                className={`border ${memberError ? "border-red-500" : "border-gray-300"} rounded px-2 py-1`}
                                            />
                                            {memberError && <p className="text-red-500 text-sm">{memberError}</p>}

                                            <Button variant="outline" className="h-full" onClick={handleAddMember} disabled={loading}>
                                                {loading ? (
                                                    <div className="flex items-center">
                                                        <span className="animate-spin mr-2">◌</span>
                                                        Adding...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Users className="mr-2 h-4 w-4" /> Add Member
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expenses Table */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Recent Expenses</h3>
                                            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button>
                                                        <Receipt className="mr-2 h-4 w-4" /> Add Expense
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Add New Expense</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={handleAddExpense} className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <label>Description</label>
                                                            <Input
                                                                name="description"
                                                                placeholder="What was this expense for?"
                                                                value={newExpense.description}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label>Amount</label>
                                                            <Input
                                                                type="number"
                                                                name="amount"
                                                                placeholder="Enter amount"
                                                                value={newExpense.amount || ''}
                                                                onChange={handleChange}
                                                                required
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label>Paid By</label>
                                                            <Select
                                                                value={newExpense.paidBy}
                                                                onValueChange={(value) => {
                                                                    setNewExpense(prev => ({
                                                                        ...prev,
                                                                        paidBy: value
                                                                    }));
                                                                }}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Who paid?" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {selectedGroup.members.map(member => (
                                                                        <SelectItem
                                                                            key={member.email}
                                                                            value={member.email}
                                                                        >
                                                                            {member.email}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <Button
                                                            type="submit"
                                                            className="w-full"
                                                            disabled={loading || !newExpense.description || !newExpense.amount || !newExpense.paidBy}
                                                        >
                                                            {loading ? (
                                                                <div className="flex items-center">
                                                                    <span className="animate-spin mr-2">◌</span>
                                                                    Adding...
                                                                </div>
                                                            ) : (
                                                                'Add Expense'
                                                            )}
                                                        </Button>
                                                    </form>
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
                                                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
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

