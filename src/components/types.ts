export interface MenuItem {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
export interface AppSidebarProps {
    menuItems: MenuItem[];
    role: "user" | "advisor" | "admin"
}
export interface FormInputProps {
    id: string;
    name: string;
    type: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    isPassword?: boolean;
    passwordVisible?: boolean;
    onPasswordVisibilityChange?: () => void;
    error?: string;
}
export interface ProgressProps {
    value: number;
    color?: string;
    className?: string;
}

export interface TransactionType {
    _id: string;
    amount: number;
    description: string;
    type: "credit" | "debit";
    createdAt: string;
};

export interface WalletType {
    balance: number;
};

export interface WalletComponentProps {
    transactions: TransactionType[];
    wallet: WalletType | null;
    loading: boolean;
};