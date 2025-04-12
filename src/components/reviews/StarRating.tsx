import React from 'react';
import { FaStar } from 'react-icons/fa';
import {StarRatingProps} from './types'

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  readonly = false 
}) => {
  const handleStarClick = (selectedRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className={`star ${starValue <= rating ? 'filled' : 'empty'}`}
            onClick={() => handleStarClick(starValue)}
            style={{ 
              cursor: readonly ? 'default' : 'pointer',
              color: starValue <= rating ? '#FFD700' : '#e4e5e9'
            }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
