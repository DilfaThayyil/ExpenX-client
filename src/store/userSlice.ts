import { StateCreator } from 'zustand';
import {UserType,State,Actions} from './types'


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
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    users: [], // Initialize as an empty array instead of null
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
    try {
        localStorage.setItem('userProfile', JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user to localStorage:', error);
    }
};


export const createUserSlice: StateCreator<State & Actions> = (set, get) => ({
    user: loadUserFromLocalStorage(),

    setUser: (user: UserType) => {
        try {
            saveUserToLocalStorage(user);
            set({ user });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    },

    updateUser: (key: keyof UserType, value: string | string[]) => {
        try {
            set((state) => {
                const updatedUser = { ...state.user, [key]: value };
                saveUserToLocalStorage(updatedUser);
                return { user: updatedUser };
            });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    },

    clearUser: () => {
        try {
            localStorage.removeItem('userProfile');
            set({ user: { ...defaultUser } });
        } catch (error) {
            console.error('Error clearing user:', error);
        }
    },

    isProfileComplete: () => {
        const user = get().user; // Use current state
        return (
            user.username !== '' &&
            user.email !== '' &&
            user.phone !== '' &&
            user.location !== '' &&
            user.country !== '' &&
            user.description !== '' &&
            user.profilePic !== ''
        );
    },
});
