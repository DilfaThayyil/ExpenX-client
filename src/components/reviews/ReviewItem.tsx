import React, { useState } from 'react';
import { format } from 'date-fns';
import StarRating from './StarRating';
import ReplyForm from './ReplyForm';
import ReplyItem from './ReplyItem';
import { addReplyToReview, deleteReview, updateReview } from '@/services/review/reviewServices';
import {ReviewItemProps} from './types'

const ReviewItem: React.FC<ReviewItemProps> = ({ 
  review, 
  currentUserId, 
  advisorId,
  onReviewUpdated 
}) => {
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedRating, setEditedRating] = useState<number>(review.rating);
  const [editedReview, setEditedReview] = useState<string>(review.review);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const isOwnReview = currentUserId === review.userId._id;
  
  const handleReplySubmit = async (text: string) => {
    try {
      await addReplyToReview(advisorId,review._id, text);
      setShowReplyForm(false);
      onReviewUpdated();
    } catch (err) {
      console.error(err);
      setError('Failed to submit reply');
    }
  };
  
  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateReview(review._id, editedRating, editedReview);
      setIsEditing(false);
      onReviewUpdated();
    } catch (err) {
      console.error(err);
      setError('Failed to update review');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteReview = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(review._id);
        onReviewUpdated();
      } catch (err) {
        console.error(err);
        setError('Failed to delete review');
      }
    }
  };
  
  return (
    <div className="review-item">
      {error && <div className="error-message">{error}</div>}
      
      <div className="review-header">
        <div className="user-info">
          {review.userId.avatar && (
            <img 
              src={review.userId.avatar} 
              alt={review.userId.name} 
              className="avatar"
            />
          )}
          <span className="username">{review.userId.name}</span>
        </div>
        
        <div className="review-date">
          {format(new Date(review.createdAt), 'MMM d, yyyy')}
        </div>
      </div>
      
      {isEditing ? (
        <div className="edit-review-form">
          <div className="rating-edit">
            <StarRating 
              rating={editedRating} 
              onRatingChange={setEditedRating} 
            />
          </div>
          
          <textarea
            value={editedReview}
            onChange={(e) => setEditedReview(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
          
          <div className="edit-buttons">
            <button 
              onClick={handleEditSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="review-rating">
            <StarRating rating={review.rating} readonly />
          </div>
          
          <div className="review-content">
            {review.review}
          </div>
          
          <div className="review-actions">
            {(advisorId || isOwnReview) && (
              <button 
                className="reply-button"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </button>
            )}
            
            {isOwnReview && (
              <>
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={handleDeleteReview}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
      
      {/* Replies section */}
      {review.replies && review.replies.length > 0 && (
        <div className="replies-section">
          <h4>Replies</h4>
          {review.replies.map((reply) => (
            <ReplyItem 
              key={reply._id} 
              reply={reply}
              isOwnReply={currentUserId === reply.advisorId._id}
            />
          ))}
        </div>
      )}
      
      {showReplyForm && (
        <ReplyForm 
          onSubmit={handleReplySubmit}
          onCancel={() => setShowReplyForm(false)}
        />
      )}
    </div>
  );
};

export default ReviewItem;
