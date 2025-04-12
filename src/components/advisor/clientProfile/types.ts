export interface DocumentsTabProps {
    clientId: string | undefined;
}

export interface IDocumentFile {
    _id: string;
    userId: string;
    advisorId: string;
    name: string;
    type: "PDF" | "XLSX" | "DOCX" | "CSV";
    url: string;
    uploadedAt: Date
}


export interface DocumentsTableProps {
    documentsData: IDocumentFile[];
}

export interface IUser {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
}

export interface IMeeting {
    _id: string;
    advisorId: IUser;
    bookedBy: IUser | null;
    date: string;
    startTime: string;
    endTime: string;
    fee: number;
    duration: number;
    maxBookings: number;
    status: "Available" | "Booked" | "Cancelled";
    location: "Virtual" | "Physical";
    locationDetails: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionProps {
    clientId: string | undefined;
}


export interface MeetingsTableProps {
    meetings: IMeeting[]
}
