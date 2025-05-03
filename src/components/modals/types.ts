export interface Category {
    _id?: string;
    name: string;
}

export interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    category?: Category | null;
    onCategoryUpdate: (updatedCategory: Category) => void;
    onCategoryAdd: (newCategory: Category) => void;
}

export interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    slot: string;
}

export interface LogoutDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export interface IReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    advisorId: string | null;
    userId: string;
    setReport: (report: IReportData) => void;
    slotId: string
    advisorReport: IReportData|null
}

export interface IReportData {
    userId: string;
    advisorId: string;
    reason: "Spam" | "Inappropriate Content" | "Harassment" | "Other";
    status: "pending" | "reviewed" | "resolved";
    customReason?: string;
    createdAt?: string;
}