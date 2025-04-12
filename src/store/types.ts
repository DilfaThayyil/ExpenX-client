export interface AdminState {
    adminEmail: string;
    setAdminEmail: (email: string) => void;
    clearAdminEmail: () => void;
}

export interface onlineUsers {
    id: string;
    socketId: string;
}

export type UserType = {
    _id: string;
    username: string
    email: string;
    phone: string;
    location: string;
    role: string;
    country: string;
    description: string;
    language: string;
    profilePic: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: onlineUsers[] | any;
    lastSeen?: string;
};

export type State = {
    user: UserType;
};

export type Actions = {
    setUser: (user: UserType) => void;
    updateUser: (key: keyof UserType, value: string | string[]) => void;
    clearUser: () => void;
    isProfileComplete: () => boolean;
};
