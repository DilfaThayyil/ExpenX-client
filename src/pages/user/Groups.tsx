import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SplitExpenseDialog from '@/components/user/splitExpenseDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Users, Plus, Receipt, Trash2 } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import { createGroup, getUserGroups, addMember, addExpenseInGroup } from '../../services/user/userService'
import useShowToast from '@/customHook/showToaster';
// import Loading from '@/style/loading';
import Store from '../../store/store'



interface Group {
    _id: string;
    name: string;
    totalExpenses: number;
    memberCount: number;
    balance: number;
    lastActivity: string;
    members: GroupMember[];
    expenses: GroupExpense[];
}
interface GroupMember {
    name: string;
    email: string;
    avatar: string;
    paid: number;
    owed: number;
}
export interface GroupExpense {
    id?: string;
    date: string;
    title: string;
    totalAmount: number;
    paidBy: string;
    splitMethod: string;
    splits?: Record<string, number>;
}
interface Group1 {
    name: string;
    members: string[];
}

const GroupsPage = () => {
    const Toaster = useShowToast()
    const [member, setMember] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const [newExpense, setNewExpense] = useState<GroupExpense>({ id: '', date: new Date().toISOString(), title: '', totalAmount: 0, paidBy: '', splitMethod: 'equal' })
    const [newGroup, setNewGroup] = useState<Group1>({ name: '', members: [] })
    const [groups, setGroups] = useState<Group[]>([])
    const [memberError, setMemberError] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const email = Store((state) => state.user.email)
    const userId = Store((state) => state.user._id)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [refreshGroups, setRefreshGroups] = useState(false)

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                if (!userId) {
                    console.error('userId is required')
                    return
                }
                const response = await getUserGroups(userId)
                if (Array.isArray(response)) {
                    setGroups(response)
                    setSelectedGroup(response[0])
                } else {
                    console.error('Invalid response format:', response)
                    Toaster('Error fetching groups: Invalid format', 'error')
                }
            } catch (error) {
                console.error('Error fetching groups', error)
                // Toaster('errrr fetching groups', 'error')
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
        if (!selectedGroup?._id || !member) {
            setMemberError('Member email is required');
            return;
        }
        setMemberError("");
        try {
            setLoading(true);
            const response = await addMember(selectedGroup._id, member);
            if (response.success) {
                Toaster(response.message, 'success');
                setSelectedGroup(response.groups)
                setMember('');
            } else {
                Toaster(response.message || 'Failed to add member', 'error');
            }
        } catch (error) {
            console.error('Error adding member:', error);
            Toaster('Failed to add member', 'error');
        } finally {
            setLoading(false);
        }
    }

    const validateForm = () => {
        const errors: string[] = []
        if (!newGroup.name) errors.push('Name is required')
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
            const response = await createGroup(userId, newGroup.name, newGroup.members)
            Toaster('Group creation successful', 'success')
            setNewGroup({ name: '', members: [] })
            setIsDialogOpen(false)
            setRefreshGroups(prev => !prev)
        } catch (error) {
            console.error('Error creating group', error)
            Toaster('Failed to create group', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleAddExpense = async (expense: GroupExpense) => {
        if (!selectedGroup) {
            Toaster("Please select a group first.", "error");
            return;
        }
        setLoading(true);
        try {
            const response = await addExpenseInGroup(selectedGroup._id, { ...expense });
            if (response.success) {
                Toaster(response.message, "success");
                setRefreshGroups((prev) => !prev);
                setIsExpenseDialogOpen(false);
            } else {
                throw new Error(response.message || "Failed to add expense");
            }
        } catch (error: any) {
            console.error("Error adding expense:", error);
            Toaster(error.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewExpense({
            ...newExpense,
            [name]: name === 'amount' ? parseFloat(value) : value
        })
    }


    return (
        <Layout role='user'>
            <div className="min-h-screen bg-muted  p-6 border rounded-2xl">
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
                                    <label>Add Members</label>
                                    <Input
                                        placeholder="Type email address & press Enter"
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
                                                        <Trash2 />
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
                                key={group._id}
                                className={`cursor-pointer transition-all hover:shadow-md ${selectedGroup?._id === group._id ? 'ring-2 ring-emerald-500' : ''
                                    }`}
                                onClick={() => setSelectedGroup(group)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">{group.name}</h3>
                                        {/* <Badge variant={group.balance < 0 ? "destructive" : "secondary"}>
                                            {group.balance < 0 ? "You owe" : "You're owed"} ${Math.abs(group.balance)}
                                        </Badge> */}
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex -space-x-2">
                                            {group.members?.slice(0, 3).map((member) => (
                                                <Avatar key={member.email} className="border-2 border-white">
                                                    <AvatarImage src={member.avatar} alt={member.name} />
                                                    <AvatarFallback>{member.name}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                            {group.members?.length > 3 && (
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
                                        <p>Total Expenses: ${group.expenses.reduce((sum, expense) => sum + expense.totalAmount, 0)}</p>
                                        <p className="mt-1">{group.expenses.length > 0 ? group.expenses[group.expenses.length - 1].title : "No expenses yet"}</p>
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
                                </CardHeader>
                                <CardContent>
                                    {/* Members List */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-4">Members</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedGroup.members.map((member) => {
                                                const totalPaid = selectedGroup.expenses
                                                    .filter((expense) => expense.paidBy === member.email)
                                                    .reduce((sum, expense) => sum + expense.totalAmount, 0);
                                                const totalOwed = selectedGroup.expenses.reduce((sum, expense) => {
                                                    const split = expense?.splits?.find((s: { user: string; }) => s.user === member.email);
                                                    return sum + (split ? split.amountOwed : 0);
                                                }, 0);
                                                return (
                                                    <div key={member.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                                <AvatarFallback>{member.name}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{member.name}</p>
                                                                <p className="text-sm text-gray-600">Paid: ${totalPaid}</p>
                                                                <p className="text-sm text-gray-600">Owed: ${Math.ceil(totalOwed)}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant={totalPaid < totalOwed ? "destructive" : "secondary"}>
                                                            {totalPaid < totalOwed ? "Owes" : "Owed"} ${Math.ceil(totalPaid - totalOwed)}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
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
                                            <Button onClick={() => setIsExpenseDialogOpen(true)}>
                                                <Receipt className="mr-2 h-4 w-4" /> Add Expense
                                            </Button>

                                            <SplitExpenseDialog
                                                isOpen={isExpenseDialogOpen}
                                                onClose={() => setIsExpenseDialogOpen(false)}
                                                group={selectedGroup}
                                                onSubmit={handleAddExpense}
                                                loading={loading}
                                            />
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Paid By</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedGroup.expenses.map((expense) => (
                                                    <TableRow key={expense.id}>
                                                        <TableCell>{expense.date}</TableCell>
                                                        <TableCell>{expense.title}</TableCell>
                                                        <TableCell>{expense.paidBy}</TableCell>
                                                        <TableCell className="text-right">
                                                            ${expense.totalAmount}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
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