import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import {
    Plus,
    Search,
    //   Filter,
    Calendar as CalendarIcon,
    Edit,
    Trash2,
    Download,
    //   ArrowUpDown,
} from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/layout/Sidebar';
import { getExpenses, createExpense } from '../../services/user/userService'
import useShowToast from '@/customHook/showToaster';
import Loading from '@/style/loading';
import Store from '../../store/store'


// Types
interface Expense {
    id?: number;
    date: Date;
    amount: number;
    category: string;
    description: string;
}

const Expenses = () => {

    const Toaster = useShowToast()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [formData, setFormData] = useState<Expense>({
        date: new Date(),
        amount: 0,
        category: '',
        description: ''
    })
    const [loading,setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen,setIsDialogOpen] = useState<boolean>(false)
    const userId = Store((state)=>state.user.id)
console.log("frontent user Id  : ",userId)

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                if (!userId) {
                    console.error('User ID is not defined.');
                    return;
                }                
                console.log("type of userId : ",typeof userId)
                const data = await getExpenses(userId)
                console.log("data : ",data)
                setExpenses(data)
            } catch (error) {
                console.error('Error fetching expenses:', error);
                Toaster('Failed to fetch expenses','error')
            }
        };
        fetchExpenses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'amount' ? parseFloat(value) : value,
        });
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setFormData({ ...formData, date });
        }
    };

    const validateForm = () => {
        const errors: string[] = []
        if (isNaN(formData.amount) || formData.amount <= 0) errors.push('Amount must be greater than 0.')
        if (!formData.category) errors.push('Category is required.')
        if (!formData.description) errors.push('Description is required.')
        return errors
    }

    const handleCreateExpense = async (e: React.FormEvent) => {
        e.preventDefault()
        const errors = validateForm()
        if (errors.length > 0) {
            errors.forEach((error) => Toaster(error, 'error', true))
            return
        }
        setLoading(true)
        try {
            const newExpense = await createExpense(formData,userId)
            console.log("newExpense : ",newExpense.data)
            setExpenses((prev)=>[...prev,newExpense.data])
            Toaster('Expense added successfully!', 'success');
            setFormData({ date: new Date(), amount: 0, category: '', description: '' });
            setIsDialogOpen(false)
        } catch (error) {
            console.error('Error creating expense:', error)
            Toaster('Failed to add expense', 'error')
        } finally{
            setLoading(false)
        }
    };

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    return (
        <Layout role='user'>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Expense Tracker</h1>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Date Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">Last 7 Days</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="transport">Transport</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                className="pl-10"
                                placeholder="Search expenses..."
                                value={searchQuery}
                                onChange={(e)=>setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Expense List */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Expenses</CardTitle>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                                            <Plus className="mr-2 h-4 w-4" /> Add Expense
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Expense</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateExpense} className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <label>Amount</label>
                                                <Input
                                                    type="number"
                                                    name='amount'
                                                    placeholder="Enter amount"
                                                    value={formData.amount}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <label>Date</label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="justify-start text-left font-normal">
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {format(formData.date, 'PPP')}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={formData.date}
                                                            onSelect={handleDateChange}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="grid gap-2">
                                                <label>Category</label>
                                                <Select onValueChange={(value) => handleChange({ target: { name: 'category', value } } as any)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="food">Food</SelectItem>
                                                        <SelectItem value="transport">Transport</SelectItem>
                                                        <SelectItem value="entertainment">Entertainment</SelectItem>
                                                        <SelectItem value="utilities">Utilities</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <label>Description</label>
                                                <Input
                                                    name='description'
                                                    placeholder="Enter description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <Button type='submit' className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                {loading ? 'Saving...' : 'Save Expense'}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                        {loading ? (
                                            <Loading/>
                                        ):(
                                        <TableBody>
                                            {expenses.map((expense) => (
                                                <TableRow key={expense.id}>
                                                    <TableCell>{format(new Date(expense.date), 'PPP')}</TableCell>
                                                    <TableCell>{expense.description}</TableCell>
                                                    <TableCell>{expense.category}</TableCell>
                                                    <TableCell className="text-right">
                                                        ${expense.amount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-red-600">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        )}
                                </Table>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Column - Summary and Charts */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Expense Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Expenses</p>
                                        <p className="text-3xl font-bold text-emerald-600">${totalExpenses.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Monthly Budget</p>
                                        <Progress value={65} className="h-2 mt-2" />
                                        <p className="text-sm text-gray-600 mt-1">
                                            65% of budget used
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <p className="text-sm font-medium">Quick Stats</p>
                                        <div className="mt-2 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Average Daily</span>
                                                <span className="font-medium">$48.50</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Largest Expense</span>
                                                <span className="font-medium">$85.50</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Transactions</span>
                                                <span className="font-medium">12</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Export Data */}
                        <Button className="w-full" variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Export Data
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Expenses;