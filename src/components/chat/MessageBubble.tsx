import React from 'react';
import Store from '@/store/store';
import { format } from 'date-fns';


interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const sender = Store((state) => state.user);

  const isSender = message.senderId === sender._id;

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`p-3 max-w-xs rounded-lg shadow-md ${
          isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        <p>{message.text}</p>
        <span className="text-xs text-gray-600 block mt-1">
          {format(new Date(message.createdAt), 'hh:mm a')}
        </span>
      </div>
    </div>
  );
};
