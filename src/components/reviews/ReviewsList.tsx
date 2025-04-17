import React, { useState, useEffect } from 'react';
import { getReviewsForAdvisor } from '@/services/review/reviewServices';
import Pagination from "@/components/admin/Pagination";
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import {ReviewsListProps} from './types'


const ReviewsList: React.FC<ReviewsListProps> = ({ 
  advisorId, 
  currentUserId,
  isAdvisor 
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentPage,setCurrentPage] = useState<number>(1)
  const [totalPages,setTotalPages] = useState<number>(1)
  const limit = 1

  const fetchReviews = async () => {
    setLoading(true);
  try {
    const response = await getReviewsForAdvisor(advisorId, currentPage, limit);
    if (Array.isArray(response.data.reviews)) {
      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages || 1);
    } else {
      setReviews([]); 
    }
    setError(null);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    setError('Failed to load reviews');
    setReviews([]); 
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchReviews();
  }, [advisorId,currentPage]);

  const handleReviewAdded = () => {
    fetchReviews();
    setShowReviewForm(false);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2>Client Reviews</h2>
        
        <div className="reviews-summary">
          <div className="average-rating">
            <span>{averageRating.toFixed(1)}</span> out of 5
          </div>
          <div className="reviews-count">
            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {!isAdvisor && !showReviewForm && (
          <button 
            className="write-review-button"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        )}
      </div>
      
      {showReviewForm && (
        <ReviewForm 
          advisorId={advisorId} 
          onReviewAdded={handleReviewAdded} 
        />
      )}
      
      {loading ? (
        <div className="loading">Loading reviews...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">
          No reviews yet. Be the first to leave a review!
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              currentUserId={currentUserId}
              advisorId={advisorId}
              onReviewUpdated={fetchReviews}
            />
          ))}
        </div>
      )}
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} />
    </div>
  );
};

export default ReviewsList;