export interface ForgetPasswordProps {
    toggleModal: () => void;
}

export interface GoogleAuthProps {
    role: 'user' | 'advisor'
}

export interface otpProps {
    email: string
    purpose: string
    role: 'user' | 'advisor'
    redirect?:string|null
}

export interface PaymentFormProps {
    clientSecret: string;
    onSuccess: () => void;
}

export interface GroupExpense {
    id?: string;
    date: string;
    title: string;
    totalAmount: number;
    paidBy: string;
    splitMethod: string;
    splits?: {
        user: string;
        amountOwed: number;
        percentage: number;
        status: string;
        _id: string;
    }[];
    share?: Record<string, number>
}

export interface Member {
    email: string;
    name: string;
}

interface Split {
    user: string;
    amountOwed: number;
}

export interface Balance {
    email: string;
    name: string;
    balance: number;
}
export interface Errors {
    from: string;
    to: string;
    amount: string;
}
export interface Expense {
    paidBy: string;
    totalAmount: number;
    splits?: Split[];
}
export interface Group {
    members: Member[];
    expenses: Expense[];
    settlements?: Settlement[];
}

export interface SplitExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group|null;
    onSubmit: (expense: GroupExpense) => void;
    loading: boolean;
}
export interface Settlement {
    from: string;
    to: string;
    amount: number;
    date: string;
}
export interface SettleUpDialogProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    group: Group;
    onSubmit: (settlement: Settlement) => void;
    loading: boolean;
    currentUserEmail: string;
}