export interface Slot {
    id?: string;
    date: string;
    startTime: string;
    fee: number;
    duration: number;
    maxBookings: number;
    status: 'Available' | 'Booked' | 'Cancelled';
    location: "Virtual" | "Physical";
    locationDetails?: string;
    description?: string;
  }

  
export interface IAdvisorData {
    username: string
    email: string
    password: string
  }
  
  export interface ErrorResponse {
    error: string
  }
  