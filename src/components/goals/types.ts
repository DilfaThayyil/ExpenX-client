
export interface GoalFormProps {
    onSubmit: (goal: Omit<Goal, '_id'>) => Promise<void>;
    onCancel: () => void;
    initialData ?: Goal;
}

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
