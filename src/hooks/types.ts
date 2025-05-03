export interface Slot {
    _id: string;
    advisorId: {
        _id: string;
        username: string;
        email: string;
        profilePic: string;
      };
    date: string;
    startTime: string;
    duration: number;
    fee: number;
    location: string;
    status: 'Available' | 'Booked' | 'Cancelled';
    description?: string;
    bookedBy?: string;
  }