export interface Goal {
    _id?: string;
    userId?: string;
    title: string;
    description?: string;
    target: number;
    current: number;
    deadline: Date | string;
    category?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
