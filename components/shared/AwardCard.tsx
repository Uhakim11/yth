import React from 'react';
import { AwardItem } from '../../types';
import { Trophy, Medal, Award as AwardIconLucide, Sparkles } from 'lucide-react'; // Using AwardIconLucide to avoid naming conflict

interface AwardCardProps {
  award: AwardItem;
}

const AwardCard: React.FC<AwardCardProps> = ({ award }) => {
  const getCategoryIcon = (category: AwardItem['category']) => {
    switch(category) {
      case 'Championship': return <Trophy size={24} className="text-yellow-500" />;
      case 'Excellence': return <Medal size={24} className="text-blue-500" />;
      case 'Participation': return <AwardIconLucide size={24} className="text-green-500" />;
      case 'Special Recognition': return <Sparkles size={24} className="text-purple-500" />;
      default: return <Trophy size={24} className="text-gray-500" />;
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-primary-500/40 hover:-translate-y-1.5 flex flex-col">
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={award.imageUrl} 
          alt={award.title} 
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" 
        />
         <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
            {getCategoryIcon(award.category)}
            <span className="ml-1.5">{award.category}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate" title={award.title}>
          {award.title}
        </h3>
        {award.year && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Awarded: {award.year}</p>}
        <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-3">
          {award.description}
        </p>
      </div>
    </div>
  );
};

export default AwardCard;
