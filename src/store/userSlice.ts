import { StateCreator } from 'zustand';

export interface onlineUsers {
    id: string;
    socketId: string;
}

export type UserType = {
    _id: string;
    username:string
    email: string;
    phone: string;
    location: string;
    role: string;
    country: string;
    description: string;
    language: string;
    profilePic: string;
    users: onlineUsers[] | any;
    lastSeen?: string;
};

type State = {
    user: UserType;
};

type Actions = {
    setUser: (user: UserType) => void;
    updateUser: (key: keyof UserType, value: string | string[]) => void;
    clearUser: () => void;
    isProfileComplete: () => boolean;
};

const defaultUser: UserType = {
    _id: '',
    username: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    description: '',
    language: 'English',
    country: '',
    profilePic: '' || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    users: null
};

const loadUserFromLocalStorage = (): UserType => {
    try {
        const user = localStorage.getItem('userProfile');
        return user ? JSON.parse(user) : defaultUser;
    } catch (error) {
        console.error('Error loading user from localStorage', error);
        return defaultUser;
    }
};

const saveUserToLocalStorage = (user: UserType) => {
    localStorage.setItem('userProfile', JSON.stringify(user));
};

export const createUserSlice: StateCreator<State & Actions> = (set) => ({
    user: loadUserFromLocalStorage(),

    setUser: (user: UserType) => {
        set(() => {
            saveUserToLocalStorage(user);
            return { user: { ...user } };
        });
    },

    updateUser: (key: keyof UserType, value: string | string[]) => {
        set((state) => {
            const updatedUser = { ...state.user, [key]: value };
            saveUserToLocalStorage(updatedUser);
            return { user: updatedUser };
        });
    },

    clearUser: () => {
        set(() => {
            console.log('Clearing user data from localStorage');
            localStorage.removeItem('userProfile');
            return { user: { ...defaultUser } };
        });
    },
    
    isProfileComplete: () => {
        const user = loadUserFromLocalStorage();
        return (
            user.username !== '' &&
            user.email !== '' &&
            user.phone !== '' &&
            user.location !== '' &&
            user.country !== '' &&
            user.description !== '' &&
            user.profilePic !== ''
        );
    }
    
});