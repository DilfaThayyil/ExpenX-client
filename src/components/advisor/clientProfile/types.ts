import { ReactNode, MouseEventHandler, ReactElement } from "react";
export interface DocumentsTabProps {
    clientId: string | undefined;
}
export interface IDocumentFile {
    _id: string;
    userId: string;
    advisorId: string;
    name: string;
    type: "PDF" | "XLSX" | "DOCX" | "CSV";
    url: string;
    uploadedAt: Date
}
export interface ActionButtonProps {
    icon: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
}
export interface DocumentsTableProps {
    documentsData: IDocumentFile[];
}
export interface IUser {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
}
export interface IMeeting {
    _id: string;
    advisorId: IUser;
    bookedBy: IUser | null;
    date: string;
    startTime: string;
    endTime: string;
    fee: number;
    duration: number;
    maxBookings: number;
    status: "Available" | "Booked" | "Cancelled";
    location: "Virtual" | "Physical";
    locationDetails: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
export interface TransactionProps {
    clientId: string | undefined;
}
export interface MeetingsTableProps {
    meetings: IMeeting[]
}


export interface ClientType {
    _id: string;
    username: string;
    email: string;
    profilePic?: string;
    [key: string]: any;
};
export interface DashboardCardProps {
    title: string;
    actions?: ReactNode
    children: ReactNode;
    className?: string;
}
export interface DocumentUploadCardProps {
    clientId?: string
}
export interface ExpenseData {
    name: string;
    value: number;
    color: string;
}
export interface ExpensesTabProps {
    expenseTimeframe: string;
    setExpenseTimeframe: React.Dispatch<React.SetStateAction<string>>;
    expenseData: ExpenseData[];
    setCustomDates: (start: string|null, end: string|null) => void;
}
export interface ExpenseItemProps {
    icon: ReactElement;
    name: string;
    amount: string;
    percentage: string;
}
export interface ExpenseBreakdownChartProps {
    timeframe: string
    setTimeframe: React.Dispatch<React.SetStateAction<string>>
    expenseData: ExpenseData[]
    setCustomDates: (start: string|null, end: string|null) => void
}
export interface ExpenseBreakdownLegendProps {
    expenseData: { name: string, value: number, color: string }[];
}
export interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
}
export interface Transaction {
    id: string;
    type: 'Income' | 'Expense' | 'Investment';
    description: string;
    category: string;
    date: string;
    amount: number;
}
export interface Meeting {
    id: string;
    date: string;
    description: string;
};
export interface MeetingCalendarProps {
    meetings: IMeeting[];
}
export interface ExpenseDataType {
    name: string;
    value: number;
    color: string
};

