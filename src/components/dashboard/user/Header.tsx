import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {HeaderProps} from './types'


export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};


const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/api/placeholder/40/40" alt="User" />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {username}
          </h1>
          <p className="text-gray-600">Welcome back to your dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button> */}
        
      </div>
    </div>
  );
};

export default Header;