import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  filledColor?: string; // Tailwind color class e.g., 'text-yellow-400'
  emptyColor?: string;  // Tailwind color class e.g., 'text-gray-300'
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 20,
  className = '',
  filledColor = 'text-yellow-400 dark:text-yellow-300',
  emptyColor = 'text-gray-300 dark:text-gray-500',
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0; // Not implementing half star visuals for simplicity, just rounds down
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className={`${filledColor} fill-current animate-starFill`} style={{animationDelay: `${i * 0.05}s`}} />
      ))}
      {/* For simplicity, half stars are not visually distinct but can be added */}
      {[...Array(totalStars - fullStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className={`${emptyColor}`} />
      ))}
    </div>
  );
};

export default StarRating;