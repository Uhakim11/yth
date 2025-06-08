import React from 'react';
import { Star } from 'lucide-react';

interface RatingInputProps {
  currentRating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: number;
  className?: string;
  starClassName?: string;
  disabled?: boolean;
}

const RatingInput: React.FC<RatingInputProps> = ({
  currentRating,
  onRatingChange,
  maxRating = 5,
  size = 24,
  className = '',
  starClassName = '',
  disabled = false,
}) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={ratingValue}
            type="button"
            disabled={disabled}
            className={`p-0.5 rounded-full transition-colors focus:outline-none ${starClassName} ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
            } ${
              ratingValue <= currentRating
                ? 'text-yellow-400 dark:text-yellow-300'
                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300/70 dark:hover:text-yellow-200/70'
            }`}
            onClick={() => !disabled && onRatingChange(ratingValue)}
            aria-label={`Rate ${ratingValue} out of ${maxRating} stars`}
            title={`Rate ${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
          >
            <Star 
                size={size} 
                fill={ratingValue <= currentRating ? 'currentColor' : 'none'} 
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingInput;