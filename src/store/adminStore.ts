import { create } from "zustand";
import {AdminState} from './types'

const loadAdminEmailFromLocalStorage = (): string => {
  try {
    const email = localStorage.getItem("adminEmail");
    return email || ""; 
  } catch (error) {
    console.error("Error loading admin email from localStorage", error);
    return "";
  }
};

const saveAdminEmailToLocalStorage = (email: string) => {
  localStorage.setItem("adminEmail", email);
};


const useAdminStore = create<AdminState>((set) => ({
  adminEmail: loadAdminEmailFromLocalStorage(),

  setAdminEmail: (email) => {
    set({ adminEmail: email });
    saveAdminEmailToLocalStorage(email);
  },

  clearAdminEmail: () => {
    set({ adminEmail: "" });
    localStorage.removeItem("adminEmail");
  },

}));

export default useAdminStore;