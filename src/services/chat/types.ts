

export interface Message {
    id: string
    sender: string
    receiver: string
    text: string
}

export interface Notification {
    _id: string;
    userId: string;
    senderId: {
        _id: string;
        username: string;
        profilePic: string;
    };
    message: string;
    type: 'message' | 'system';
    read: boolean;
    createdAt: string;
}