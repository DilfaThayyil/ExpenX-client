export interface Booking {
    date: string;
    endTime: string;
    startTime: string;
    bookedBy: {
        _id: string;
        username: string;
        email: string;
        profilePic: string;
    };
    _id: string;
    userName: string;
    userEmail: string;
    slotId: string;
    bookedDate: string;
    paymentStatus: "Paid" | "Pending";
    location: "Virtual" | "Physical";
    status: "Available" | "Booked" | "Cancelled";
    locationDetails: string;
    description: string;
}

export interface Stats {
    totalRevenue: number
    activeClients: number
    completedGoals: number
    slotUtilization: number
}


export interface Feedback {
    _id: string;
    advisorId: string;
    userId: {
        _id: string
        username: string
        profilePic: string
    }
    username: string;
    profilePic: string;
    rating: number;
    review: string;
    replies: FeedbackReply[];
    createdAt: string;
}

export interface FeedbackReply {
    _id: string;
    advisorId: string;
    text: string;
    createdAt: string;
}

export interface Slot {
    _id: string;
    advisorId?: {
        id: string;
        username: string;
        email: string;
        profilePic: string
    },
    date: string;
    startTime: string;
    fee: number;
    duration: number;
    maxBookings: number;
    status: 'Available' | 'Booked' | 'Cancelled';
    location: 'Virtual' | 'Physical';
    locationDetails?: string;
    description?: string;
}