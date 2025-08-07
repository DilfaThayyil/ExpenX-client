export interface DataTableProps<T = any> {
  type: "user" | "advisor" | "category";
  fetchFunction: (page: number, limit: number, search: string) => Promise<any>;
  manageFunction: (action: string, identifier: string, extraData?: string) => Promise<any>;
  columns: { header: string; accessor: (item: T) => any }[];
  actions: (item: T) => React.ReactNode;
  onEdit?: (item: T) => void;
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

