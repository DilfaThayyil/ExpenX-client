export interface Slot {
    _id: string;
    date: string;
    startTime: string;
    fee: number;
    duration: number;
    maxBookings: number;
    status: 'Available' | 'Booked' | 'Cancelled';
    bookedBy?: {
        _id: string;
        username: string;
        email: string
    };
    location: 'Virtual' | 'Physical';
    locationDetails?: string;
    description?: string;
}

export interface Booking {
    date: string;
    endTime: string;
    startTime: string;
    bookedBy: {
        profilePic: string | undefined;
        _id: string; username: string; email: string
    };
    _id: string;
    userName: string;
    userEmail: string;
    slotId: string;
    bookedDate: string;
    paymentStatus: "Paid" | "Pending";
    location: "Virtual" | "Physical";
    locationDetails: string;
    status: 'Available' | 'Booked' | 'Cancelled';
    description: string;
}

export interface BookedAppointmentsTableProps {
    appointments?: Booking | Booking[];
}
