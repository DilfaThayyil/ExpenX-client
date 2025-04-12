import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Search, Calendar as CalendarIcon, Edit, Trash2, Download, } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/layout/Sidebar';
import { getExpenses, createExpense, getCategories, exportExpense, deleteExpense } from '../../services/user/userService'
import useShowToast from '@/customHook/showToaster';
import Loading from '@/style/loading';
import Store from '../../store/store'
import Pagination from "@/components/admin/Pagination";
import {Expense} from './types'



const Expenses = () => {

    const Toaster = useShowToast()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [formData, setFormData] = useState<Expense>({
        date: new Date(),
        amount: 0,
        category: '',
        description: ''
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const userId = Store((state) => state.user._id)
    const [isExporting, setIsExporting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDateRange, setSelectedDateRange] = useState<string>('');
    const [exportFilter, setExportFilter] = useState('daily');
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(3);
    const limit = 4;


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                if (!userId) {
                    console.error('User ID is not defined.');
                    return;
                }
                console.log("limit :", limit)
                console.log("currentPage : ", currentPage)
                const response = await getExpenses(userId, currentPage, limit)
                console.log(response)
                setExpenses(response.data.expenses)
                console.log("totalpages : ", response.data.totalPages)
                setTotalPages(response.data.totalPages)
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };
        fetchExpenses();
    }, [userId, currentPage]);

    const handleDeleteExpense = async (id: number | undefined) => {
        console.log("deleteExpensId :; ", id)
        if (!id) return;
        try {
            setLoading(true);
            await deleteExpense(id);
            setExpenses((prev) => prev.filter(exp => exp.id !== id));
            Toaster('Expense deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting expense:', error);
            Toaster('Failed to delete expense', 'error');
        } finally {
            setLoading(false);
        }
    };


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
            const newExpense = await createExpense(formData, userId)
            setExpenses((prev) => [...prev, newExpense.data])
            Toaster('Expense added successfully!', 'success');
            setFormData({ date: new Date(), amount: 0, category: '', description: '' });
            setIsDialogOpen(false)
        } catch (error) {
            console.error('Error creating expense:', error)
            Toaster('Failed to add expense', 'error')
        } finally {
            setLoading(false)
        }
    };

    const handleExportData = async (format: string) => {
        try {
            setIsExporting(true);
            let startDate: Date | null = null;
            let endDate: Date | null = new Date();

            switch (exportFilter) {
                case 'daily':
                    startDate = new Date();
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'weekly':
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 'monthly':
                    startDate = new Date();
                    startDate.setDate(1);
                    break;
                case 'custom':
                    if (!customStartDate || !customEndDate) {
                        Toaster('Please select a valid custom date range.', 'error');
                        setIsExporting(false);
                        return;
                    }
                    startDate = customStartDate;
                    endDate = customEndDate;
                    break;
                default:
                    break;
            }

            if (!startDate || !endDate) {
                Toaster('Invalid date range selected.', 'error');
                setIsExporting(false);
                return;
            }
            const filteredExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startDate! && expenseDate <= endDate!;
            });

            if (filteredExpenses.length === 0) {
                Toaster('No expenses found for the selected date range.', 'info');
                setIsExporting(false);
                return;
            }
            console.log("Exporting:", userId, format, startDate, endDate);
            const response = await exportExpense(userId, format, startDate, endDate);
            if (response.status === 404) {
                throw new Error('No expense found for this date range')
            }
            if (!response || response.status !== 200) {
                throw new Error(response?.data?.message || 'Failed to export data');
            }
            const blob = await response.data;
            if (!blob || blob.size === 0) {
                throw new Error('Received empty data from server');
            }
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `expense-report.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            Toaster(`successfully exported Expense report as ${format.toUpperCase()} `, 'success');
        } catch (error) {
            console.error("Error exporting data:", error);
            Toaster(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const isWithinRange = (date: Date) => {
        const now = new Date();
        const expenseDate = new Date(date);
        switch (selectedDateRange) {
            case 'today':
                return expenseDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return expenseDate >= weekAgo && expenseDate <= now;
            case 'month':
                return expenseDate.getMonth() === now.getMonth() &&
                    expenseDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    };
    const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const largestAmount = Math.max(...expenses.map((expense) => expense.amount))
    const expensesByDate: Record<string, number> = {};

    expenses.forEach(expense => {
        const date = new Date(expense.date).toISOString().split("T")[0];
        expensesByDate[date] = (expensesByDate[date] || 0) + expense.amount;
    });

    const totalDays = Object.keys(expensesByDate).length;
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageDailyExpense = totalDays > 0 ? (total / totalDays).toFixed(2) : "0.00";

    const filteredExpenses = expenses.filter(expense =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory ? expense.category === selectedCategory : true) &&
        isWithinRange(expense.date)
    );


    return (
        <Layout role='user'>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Expense Tracker</h1>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select onValueChange={(value) => setSelectedDateRange(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Date Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">Last 7 Days</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => setSelectedCategory(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>


                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                className="pl-10"
                                placeholder="Search expenses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.name}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
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
                                        <Loading />
                                    ) : (
                                        <TableBody>
                                            {filteredExpenses.map((expense) => (
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
                                                        <Button onClick={() => handleDeleteExpense(expense.id)} variant="ghost" size="icon" className="text-red-600">
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
                        <div className="flex justify-end mt-4">
                            <Pagination currentPage={currentPage} onPageChange={(page) => {
                                console.log("Changing page to: ", page);
                                setCurrentPage(page);
                            }} totalPages={totalPages} />
                        </div>
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
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-3xl font-bold text-emerald-600">${totalAmount.toFixed(2)}</p>
                                    </div>
                                    {/* <div>
                                        <p className="text-sm text-gray-600">Monthly Budget</p>
                                        <Progress value={65} className="h-2 mt-2" />
                                        <p className="text-sm text-gray-600 mt-1">
                                            65% of budget used
                                        </p>
                                    </div> */}
                                    <div className="pt-4 border-t">
                                        <p className="text-sm font-medium">Quick Stats</p>
                                        <div className="mt-2 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Average Daily</span>
                                                <span className="font-medium">${averageDailyExpense}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Largest Amount</span>
                                                <span className="font-medium">${largestAmount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Expenses</span>
                                                <span className="font-medium">{expenses.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Export Data */}
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full" variant="outline" disabled={isExporting}>
                                    <Download className="mr-2 h-4 w-4" />
                                    {isExporting ? 'Exporting...' : 'Export Data'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleExportData('pdf')}>
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportData('csv')}>
                                    Export as CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportData('excel')}>
                                    Export as Excel
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                        <Select value={exportFilter} onValueChange={setExportFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Export Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Today</SelectItem>
                                <SelectItem value="weekly">Last 7 Days</SelectItem>
                                <SelectItem value="monthly">This Month</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>

                        {exportFilter === 'custom' && (
                            <div className="flex gap-4 mt-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {customStartDate ? format(customStartDate, 'PPP') : 'Start Date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={customStartDate || undefined}
                                            onSelect={setCustomStartDate}
                                            max={customEndDate || new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {customEndDate ? format(customEndDate, 'PPP') : 'End Date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={customEndDate || undefined}
                                            onSelect={setCustomEndDate}
                                            min={customStartDate || undefined}
                                            max={new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={isExporting || (exportFilter === 'custom' && (!customStartDate || !customEndDate))} className="bg-blue-600 hover:bg-blue-700">
                                    <Download className="mr-2 h-4 w-4" />
                                    {isExporting ? 'Exporting...' : 'Export'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleExportData('pdf')}>Export PDF</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportData('csv')}>Export CSV</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportData('excel')}>Export Excel</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Expenses;