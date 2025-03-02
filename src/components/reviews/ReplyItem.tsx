import React from 'react';
import { format } from 'date-fns';

interface User {
  _id: string;
  name: string;
  avatar?: string;
}

interface Reply {
  _id: string;
  userId: User;
  text: string;
  createdAt: string;
}

interface ReplyItemProps {
  reply: Reply;
  isOwnReply: boolean;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, isOwnReply }) => {
  return (
    <div className={`reply-item ${isOwnReply ? 'own-reply' : ''}`}>
      <div className="reply-header">
        <div className="user-info">
          {reply.userId.avatar && (
            <img 
              src={reply.userId.avatar} 
              alt={reply.userId.name} 
              className="avatar-small"
            />
          )}
          <span className="username">{reply.userId.name}</span>
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