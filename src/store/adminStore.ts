import { create } from "zustand";

interface AdminState {
  adminEmail: string;
  adminName: string;  
  setAdminEmail: (email: string) => void;
  setAdminName: (name: string) => void; 
  clearAdminEmail: () => void;
  clearAdminName: () => void; 
}

const loadAdminEmailFromLocalStorage = (): string => {
  try {
    const email = localStorage.getItem("adminEmail");
    return email || ""; 
  } catch (error) {
    console.error("Error loading admin email from localStorage", error);
    return "";
  }
};

const loadAdminNameFromLocalStorage = (): string => {
  try {
    const name = localStorage.getItem("adminName");
    return name || ""; 
  } catch (error) {
    console.error("Error loading admin name from localStorage", error);
    return "";
  }
};

const saveAdminEmailToLocalStorage = (email: string) => {
  localStorage.setItem("adminEmail", email);
};

const saveAdminNameToLocalStorage = (name: string) => {
  localStorage.setItem("adminName", name);
};

const useAdminStore = create<AdminState>((set) => ({
  adminEmail: loadAdminEmailFromLocalStorage(),
  adminName: loadAdminNameFromLocalStorage(),  // Added adminName initialization

  setAdminEmail: (email) => {
    set({ adminEmail: email });
    saveAdminEmailToLocalStorage(email);
  },

  setAdminName: (name) => {
    set({ adminName: name });
    saveAdminNameToLocalStorage(name);  // Save admin name to localStorage
  },

  clearAdminEmail: () => {
    set({ adminEmail: "" });
    localStorage.removeItem("adminEmail");
  },

  clearAdminName: () => {
    set({ adminName: "" });
    localStorage.removeItem("adminName");  // Remove admin name from localStorage
  },
}));

export default useAdminStore;






// import { create } from "zustand";


// interface AdminState {
//   adminEmail: string;
//   setAdminEmail: (email: string) => void;
//   clearAdminEmail: () => void;
// }

// const loadAdminEmailFromLocalStorage = (): string => {
//   try {
//     const email = localStorage.getItem("adminEmail");
//     return email || ""; 
//   } catch (error) {
//     console.error("Error loading admin email from localStorage", error);
//     return "";
//   }
// };

// const saveAdminEmailToLocalStorage = (email: string) => {
//   localStorage.setItem("adminEmail", email);
// };

// const useAdminStore = create<AdminState>((set) => ({
//   adminEmail: loadAdminEmailFromLocalStorage(),

//   setAdminEmail: (email) => {
//     set({ adminEmail: email });
//     saveAdminEmailToLocalStorage(email);
//   },

//   clearAdminEmail: () => {
//     set({ adminEmail: "" });
//     localStorage.removeItem("adminEmail"); 
//   },
// }));

// export default useAdminStore;
