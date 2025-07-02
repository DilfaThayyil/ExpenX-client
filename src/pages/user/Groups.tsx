import React, { useState, useEffect } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { createGroup, getUserGroups, addMember, addExpenseInGroup, removeMember, leaveGroup, settleDebt } from '../../services/user/groupServices'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SplitExpenseDialog from '@/components/user/splitExpenseDialog';
import { Users, Plus, ReceiptIndianRupee, Trash2, RefreshCcw, LogOut, HandCoins } from 'lucide-react';
import { Group, Group1, GroupExpense, Settlement } from './types';
import useShowToast from '@/customHook/showToaster';
import SettleUpDialog from '@/components/user/SettleUpDialog'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Layout from '@/layout/Sidebar';
import Store from '../../store/store';



const GroupsPage = () => {
    const Toaster = useShowToast()
    const [member, setMember] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const [isSettleUpDialogOpen, setIsSettleUpDialogOpen] = useState(false);
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
            } catch (error: any) {
                console.error('Error fetching groups', error)
                if (error.response.data.message === 'No groups found for this user')
                    setGroups([])
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

    const handleRemoveMember = async (groupId: string, memberEmail: string) => {
        try {
            setLoading(true);
            const response = await removeMember(groupId, memberEmail);
            if (response.success) {
                Toaster(response.message, 'success');
                setSelectedGroup(response.group);
                setRefreshGroups(prev => !prev);
            } else {
                Toaster(response.message || 'Failed to remove member', 'error');
            }
        } catch (error: any) {
            console.error('Error removing member:', error);
            Toaster(error.response.data.message || 'failed to remove the member', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveGroup = async (groupId: string) => {
        try {
            setLoading(true);
            const response = await leaveGroup(groupId, email, userId);
            if (response.success) {
                Toaster(response.message, 'success');
                setRefreshGroups(prev => !prev);
                setSelectedGroup(null);
            } else {
                Toaster(response.message || 'Failed to leave group', 'error');
            }
        } catch (error: any) {
            console.error(error)
            Toaster(error.response.data.message || 'Failed to leave group', 'error');
        } finally {
            setLoading(false);
        }
    };


    const validateForm = () => {
        const errors: string[] = []
        if (!newGroup.name) errors.push('Name is required')
        if (newGroup.members.length === 0) errors.push('Members are required.')
        const isCreatorIncluded = newGroup.members.some((mem) => mem === email);
        if (!isCreatorIncluded) errors.push("Add your email address also");
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
            await createGroup(userId, newGroup.name, newGroup.members, email)
            Toaster('Invitation send to the members', 'success')
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
        if (!expense.title.trim()) {
            Toaster("Expense title is required", "error");
            return;
        }
        if (expense.totalAmount <= 0) {
            Toaster("Amount must be greater than zero", "error");
            return;
        }
        if (!expense.paidBy) {
            Toaster("Paid by field is required", "error");
            return;
        }
        if (expense.splitMethod === 'custom' || expense.splitMethod === 'percentage') {
            if (!expense.share) {
                Toaster("Share information is missing", "error");
                return;
            }
            const sum = (Object.values(expense.share) as number[]).reduce((a, b) => a + b, 0);
            if (expense.splitMethod === 'custom' && Math.abs(sum - expense.totalAmount) > 0.01) {
                Toaster("Split amounts must equal the total amount", "error");
                return;
            }
            if (expense.splitMethod === 'percentage' && Math.abs(sum - 100) > 0.01) {
                Toaster("Percentages must add up to 100%", "error");
                return;
            }
        }
        setLoading(true);
        try {
            const response = await addExpenseInGroup(selectedGroup._id, { ...expense });
            if (response.success) {
                Toaster(response.message, "success");
                setSelectedGroup(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        expenses: [...prev.expenses, response.groups.expenses]
                    };
                });
                setRefreshGroups(prev => !prev);
                setIsExpenseDialogOpen(false);
            } else {
                throw new Error(response.message || "Failed to add expense");
            }
        } catch (error: any) {
            console.error("Error adding expense:", error);
            Toaster(error.response.data.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSettleUp = async (settlementData: Settlement) => {
        try {
            if (!selectedGroup || !selectedGroup._id) {
                Toaster('No group selected for settlement', 'error');
                return;
            }
            setLoading(true);
            const response = await settleDebt(selectedGroup._id, settlementData);
            if (response.success) {
                Toaster('Settlement recorded successfully', 'success');
                setSelectedGroup(response.group);
                setRefreshGroups(prev => !prev);
                setIsSettleUpDialogOpen(false);
            } else {
                Toaster(response.message || 'Failed to record settlement', 'error');
            }
        } catch (error) {
            console.error('Error settling debt:', error);
            Toaster('Failed to record settlement', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshGroups(prev => !prev);
    };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target
    //     setNewExpense({
    //         ...newExpense,
    //         [name]: name === 'amount' ? parseFloat(value) : value
    //     })
    // }


    return (
        <Layout role='user'>
            <div className="min-h-screen bg-muted  p-6 border rounded-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
                    <div className="flex gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={handleRefresh}>
                                        <RefreshCcw className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Refresh Groups</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

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
                                            placeholder="Type email address & press Enter - Remember to include yourself!"
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
                                                            if (!newGroup.members.includes(email)) {
                                                                setEmailError("Remember to include yourself email address");
                                                            } else {
                                                                setEmailError("");
                                                            }

                                                            e.currentTarget.value = '';
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <Card
                                    key={group._id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedGroup?._id === group._id ? 'ring-2 ring-emerald-500' : ''
                                        }`}
                                    onClick={() => setSelectedGroup(group)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold">{group.name}</h3>
                                            {group.createdBy === userId && (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Admin</Badge>
                                            )}
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
                                                {group.members.length} members
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>Total Expenses: ₹{group.expenses.reduce((sum, expense) => sum + expense.totalAmount, 0).toFixed(2)}</p>
                                            <p className="mt-1">{group.expenses.length > 0 ? group.expenses[group.expenses.length - 1].title : "No expenses yet"}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                <p className="text-gray-600">No groups yet. Create your first group!</p>
                            </div>
                        )}
                    </div>

                    {selectedGroup ? (
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>{selectedGroup.name}</CardTitle>
                                    <div className="flex gap-2">
                                        {selectedGroup.createdBy === userId ? (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Admin</Badge>
                                        ) : (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <LogOut className="h-4 w-4 mr-2" /> Leave Group
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will remove you from the group. Any outstanding balances should be settled before leaving.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleLeaveGroup(selectedGroup._id)}>Confirm</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-4">Members</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedGroup?.members.map((member) => {
                                                const totalPaid = selectedGroup.expenses
                                                    .filter((expense) => expense.paidBy === member.email)
                                                    .reduce((sum, expense) => sum + expense.totalAmount, 0);
                                                const totalOwed = selectedGroup.expenses.reduce((sum, expense) => {
                                                    const split = expense?.splits?.find((s) => s.user === member.email);
                                                    return sum + (split ? split.amountOwed : 0);
                                                }, 0);
                                                const settlementsPaid = selectedGroup.settlements
                                                    ? selectedGroup.settlements
                                                        .filter(settlement => settlement.from === member.email)
                                                        .reduce((sum, settlement) => sum + settlement.amount, 0)
                                                    : 0;
                                                const settlementsReceived = selectedGroup.settlements
                                                    ? selectedGroup.settlements
                                                        .filter(settlement => settlement.to === member.email)
                                                        .reduce((sum, settlement) => sum + settlement.amount, 0)
                                                    : 0;
                                                const balance = totalPaid - totalOwed + settlementsReceived - settlementsPaid;
                                                return (
                                                    <div key={member.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{member.name}</p>
                                                                <p className="text-sm text-gray-600">Paid: ₹{totalPaid.toFixed(2)}</p>
                                                                <p className="text-sm text-gray-600">Owed: ₹{Math.ceil(totalOwed).toFixed(2)}</p>
                                                                {(settlementsPaid > 0 || settlementsReceived > 0) && (
                                                                    <p className="text-sm text-gray-600">
                                                                        Settlements: ₹{(settlementsReceived - settlementsPaid).toFixed(2)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            {/* {selectedGroup?.createdBy === userId && member.email === email && (
                                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Admin</Badge>
                                                            )} */}
                                                            <Badge variant={balance < 0 ? "destructive" : "secondary"}>
                                                                {balance < 0 ? "Owes" : "Owed"} ₹{Math.abs(balance).toFixed(2)}
                                                            </Badge>

                                                            {selectedGroup.createdBy === userId && member.email !== email && (
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                                                                            <Trash2 className="h-3 w-3 mr-1" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Remove member</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Are you sure you want to remove {member.name}? Any outstanding balances should be settled first.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction onClick={() => handleRemoveMember(selectedGroup._id, member.email)}>
                                                                                Remove
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            <div className="col-span-1 md:col-span-2 mt-4">
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter email address to add member"
                                                        value={member}
                                                        onChange={(e) => {
                                                            setMember(e.target.value);
                                                            setMemberError("");
                                                        }}
                                                        className={`${memberError ? "border-red-500" : "border-gray-300"}`}
                                                    />
                                                    <Button variant="outline" onClick={handleAddMember} disabled={loading}>
                                                        {loading ? (
                                                            <div className="flex items-center">
                                                                <span className="animate-spin mr-2">◌</span>
                                                                Adding...
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Users className="mr-2 h-4 w-4" /> Add
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                                {memberError && (
                                                    <p className="text-red-500 text-sm mt-1">{memberError}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Actions</h3>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                onClick={() => setIsExpenseDialogOpen(true)}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                <ReceiptIndianRupee className="mr-2 h-4 w-4" /> Add Expense
                                            </Button>
                                            <Button
                                                onClick={() => setIsSettleUpDialogOpen(true)}
                                                className="flex-1"
                                                variant="outline"
                                            >
                                                <HandCoins className="mr-2 h-4 w-4" /> Settle Up
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Recent Expenses</h3>
                                        </div>
                                        {selectedGroup.expenses.length > 0 ? (
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
                                                    {selectedGroup.expenses.map((expense, index) => {
                                                        const paidByUser = selectedGroup.members.find(m => m.email === expense.paidBy);
                                                        return (
                                                            <TableRow key={expense.id || index}>
                                                                <TableCell>{expense.date}</TableCell>
                                                                <TableCell>{expense.title}</TableCell>
                                                                <TableCell>{paidByUser ? paidByUser.name : expense.paidBy}</TableCell>
                                                                <TableCell className="text-right">
                                                                    ₹{expense?.totalAmount?.toFixed(2)}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                                <p className="text-gray-600">No expenses added yet.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Recent Settlements</h3>
                                        {selectedGroup.settlements && selectedGroup.settlements.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>From</TableHead>
                                                        <TableHead>To</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {selectedGroup.settlements.map((settlement, index) => {
                                                        const fromUser = selectedGroup.members.find(m => m.email === settlement.from);
                                                        const toUser = selectedGroup.members.find(m => m.email === settlement.to);
                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell>{settlement.date}</TableCell>
                                                                <TableCell>{fromUser ? fromUser.name : settlement.from}</TableCell>
                                                                <TableCell>{toUser ? toUser.name : settlement.to}</TableCell>
                                                                <TableCell className="text-right">₹{settlement.amount.toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                                <p className="text-gray-600">No settlements recorded yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="lg:col-span-2">
                            <div className="text-center p-12 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium mb-2">Select a group to see details</h3>
                                <p className="text-gray-600">Or create a new group to get started</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <SplitExpenseDialog
                isOpen={isExpenseDialogOpen}
                onClose={() => setIsExpenseDialogOpen(false)}
                group={selectedGroup}
                onSubmit={handleAddExpense}
                loading={loading}
            />

            {selectedGroup && (
                <SettleUpDialog
                    isOpen={isSettleUpDialogOpen}
                    onClose={() => setIsSettleUpDialogOpen(false)}
                    group={selectedGroup}
                    onSubmit={handleSettleUp}
                    loading={loading}
                    currentUserEmail={email}
                />
            )}

        </Layout>
    );
};

export default GroupsPage;