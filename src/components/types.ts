
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
}

export interface ProgressProps {
    value: number;
    color?: string;
    className?: string;
}