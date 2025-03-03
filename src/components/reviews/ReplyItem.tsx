import React from 'react';
import { format } from 'date-fns';


interface FeedbackReply {
  _id: string;
  advisorId: string;
  text: string;
  createdAt: string;
}

interface ReplyItemProps {
  reply: FeedbackReply;
  isOwnReply: boolean;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, isOwnReply }) => {
  return (
    <div className={`reply-item ${isOwnReply ? 'own-reply' : ''}`}>
      <div className="reply-header">
        <div className="user-info">
          {reply.advisorId.profilePic && (
            <img 
              src={reply.advisorId.profilePic} 
              alt={reply.advisorId.username} 
              className="avatar-small"
            />
          )}
          <span className="username">{reply.advisorId.username}</span>
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