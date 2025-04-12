export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    roomId: string;
    text: string;
    url?: string;
    fileUrl?: string;
    fileType?: string;
    fileName?: string;
    createdAt: string;
}

export interface ChatProps {
    receivers: { _id: string; username: string; email: string; profilePic: string }[]
}

export interface ContactProps {
    contact: {
        _id: string;
        username: string;
        email: string;
        profilePic: string;
        status?: string;
        lastMessage?: string;
        unread?: number;
        time?: string;
    };
    active: boolean;
    onClick: () => void;
    children?: React.ReactNode;
}

export interface MessageBubbleProps {
    message: Message;
}

export interface NewMessageIndicatorProps {
    count: number;
}