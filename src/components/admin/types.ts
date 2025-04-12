export interface DataTableProps<T> {
    type: "user" | "advisor" | "category";
    onEdit?: (item: any) => void
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked:boolean
}

export interface Report {
  _id: string;
  userId: User;
  advisorId: User;
  reason: string;
  customReason?: string;
  createdAt: string;
}

