import React from 'react';
import { format } from 'date-fns';
import {ReplyItemProps} from './types'


const ReplyItem: React.FC<ReplyItemProps> = ({ reply, isOwnReply }) => {
  return (
    <div className={`reply-item ${isOwnReply ? 'own-reply' : ''}`}>
      <div className="reply-header">
        <div className="user-info">
          {reply.advisorId.avatar && (
            <img 
              src={reply.advisorId.avatar} 
              alt={reply.advisorId.name} 
              className="avatar-small"
            />
          )}
          <span className="username">{reply.advisorId.name}</span>
        </div>
        
        <div className="reply-date">
          {format(new Date(reply.createdAt), 'MMM d, yyyy')}
        </div>
      </div>
      
      <div className="reply-content">
        {reply.text}
      </div>
    </div>
  );
};

export default ReplyItem;