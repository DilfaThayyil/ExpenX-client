import React, { useState } from 'react';
import { createReview } from '@/services/review/reviewServices';
import StarRating from './StarRating';
import Store from '@/store/store'
import {ReviewFormProps} from './types'


const  ReviewForm: React.FC<ReviewFormProps> = ({ advisorId, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const user = Store((state)=>state.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (reviewText.trim() === '') {
      setError('Please enter a review');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await createReview(advisorId,user._id,rating,reviewText);
      setRating(0);
      setReviewText('');
      onReviewAdded();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Leave a Review</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="rating-container">
          <label>Your Rating:</label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating} 
          />
        </div>
        
        <div className="review-input-container">
          <label htmlFor="review">Your Review:</label>
          <textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            placeholder="Share your experience with this financial advisor..."
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;