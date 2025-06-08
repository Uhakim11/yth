import React from 'react';
import { ShowcasedWinner } from '../../types';
import StarRating from '../shared/StarRating'; 
import { Award, DollarSign, Trophy, Star, Brain } from 'lucide-react';

const WinnerHighlightCard: React.FC<{ winner: ShowcasedWinner }> = ({ winner }) => {
  const PrizeIcon = winner.prizeIcon || Trophy;
  // Prioritize imageDataUrl if it exists (for future admin uploads), fallback to imageUrl
  const displayImageUrl = winner.talentImageDataUrl || winner.talentImageUrl || `https://picsum.photos/seed/${winner.id}/400/300`;


  return (
    <div className="group bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-primary-500/30">
      <div className="relative">
        <img 
          src={displayImageUrl} 
          alt={winner.talentName}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">{winner.talentName}</h3>
          <p className="text-xs text-gray-200 uppercase tracking-wider">{winner.competitionCategory}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Winner of: <strong className="text-gray-800 dark:text-white">{winner.competitionTitle}</strong>
        </p>
        <div className="flex items-center text-primary-500 dark:text-primary-400 my-2">
          <PrizeIcon size={20} className="mr-2" />
          <span className="font-semibold">{winner.prizeDescription}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
            <StarRating rating={winner.rating} totalStars={5} size={20} />
            {winner.judgesScore && (
                <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 rounded-full flex items-center">
                    <Star size={12} className="mr-1 fill-current"/> Score: {winner.judgesScore.toFixed(1)}/5.0
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default WinnerHighlightCard;