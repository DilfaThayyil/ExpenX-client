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
    splits?: Record<string, number>;
}

export interface Member {
    email: string;
    name: string;
}

export interface Group {
    members: Member[];
}

export interface SplitExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group;
    onSubmit: (expense: GroupExpense) => void;
    loading: boolean;
}
