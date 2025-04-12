import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {NewMessageIndicatorProps} from './types'


export const NewMessageIndicator: React.FC<NewMessageIndicatorProps> = ({ count }) => {
  if (count <= 0) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 1],
          opacity: 1
        }}
        transition={{ 
          duration: 0.4,
          ease: "easeOut"
        }}
        className="absolute -top-1 -right-1 flex items-center justify-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-red-400 rounded-full blur-sm transform scale-110"></div>
          <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-medium rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 shadow-md border border-red-200">
            {count > 99 ? '99+' : count}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};