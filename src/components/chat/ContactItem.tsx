import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {ContactProps} from './types'


const UnreadBadge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  
  return (
    <AnimatePresence>
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 1],
          opacity: 1
        }}
        transition={{ 
          duration: 0.4,
          ease: "easeOut"
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-red-400 rounded-full blur-sm opacity-70 transform scale-110"></div>
        <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full h-5 min-w-5 flex items-center justify-center text-xs font-medium px-1.5 shadow-md border border-red-200">
          {count > 99 ? '99+' : count}
        </div>
      </motion.span>
    </AnimatePresence>
  );
};

export const ContactItem: React.FC<ContactProps> = ({ contact, active, onClick, children }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: active ? 'rgb(243 244 246)' : 'rgb(243 244 246)' }}
      transition={{ duration: 0.2 }}
      className={`flex items-center p-3 cursor-pointer border-b border-gray-100 ${active ? 'bg-gray-100' : ''} relative`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={contact.profilePic} 
          alt={contact.username} 
          className="rounded-full w-10 h-10 object-cover border border-gray-200" 
        />
        {contact.status === 'online' && (
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          ></motion.div>
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold truncate">{contact.username}</h3>
          <span className="text-xs text-gray-500">{contact.time}</span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
          <UnreadBadge count={contact.unread ?? 0} />
        </div>
      </div>
      {children}
    </motion.div>
  );
};