export interface advisorData {
  _id: string
  username: string
  profilePic: string
  bio: string
  specialties: string[]
  experience: number
}

export interface Expense {
  id?: number;
  date: Date;
  amount: number;
  category: string;
  description: string;
}

export interface Group {
  _id: string;
  name: string;
  createdBy: string;
  totalExpenses: number;
  memberCount: number;
  balance: number;
  lastActivity: string;
  members: GroupMember[];
  expenses: GroupExpense[];
  settlements: Settlement[];
}
export interface GroupMember {
  name: string;
  email: string;
  avatar: string;
  paid: number;
  owed: number;
}
export interface GroupExpense {
  id?: string;
  date: string;
  title: string;
  totalAmount: number;
  paidBy: string;
  splitMethod: string;
  splits?: {
    user: string;
    amountOwed: number;
    percentage: number;
    status: string;
    _id: string;
  }[];
  share?: {}
}
export interface Group1 {
  name: string;
  members: string[];
}

export interface Slot {
  advisorId: {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  };
  _id: string;
  date: string;
  startTime: string;
  fee: number;
  duration: number;
  maxBookings: number;
  status: 'Available' | 'Booked' | 'Cancelled';
  bookedBy: string;
  location: 'Virtual' | 'Physical';
  locationDetails?: string;
  description?: string;
}


//currently not using anywhere
export interface TranslationContent {
  nav: {
    features: string;
    pricing: string;
    about: string;
    startAdvisor: string;
    login: string;
    signup: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  features: {
    title: string;
    groupExpenses: string;
    groupExpensesDesc: string;
    smartCalc: string;
    smartCalcDesc: string;
    billScan: string;
    billScanDesc: string;
    groupChat: string;
    groupChatDesc: string;
  };
  chat: {
    title: string
    advisor: string
    user: string
  };
  benefits: {
    title: string;
    secure: string;
    secureDes: string;
    save: string;
    saveDes: string;
    overview: string;
    overviewDes: string;
  }

}

export interface Translations {
  [key: string]: TranslationContent;
}

export interface WalletType {
  balance: number;
};

export interface Settlement {
  from: string;
  to: string;
  amount: number;
  date: string;
}