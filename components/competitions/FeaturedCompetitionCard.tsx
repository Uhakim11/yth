import React from 'react';
import { Link } from 'react-router-dom';
import { Competition } from '../../types';
import Button from '../shared/Button';
import { generatePath, ROUTES } from '../../constants';
import { Trophy, CalendarCheck2, ArrowRight } from 'lucide-react';

interface FeaturedCompetitionCardProps {
  competition: Competition;
}

const FeaturedCompetitionCard: React.FC<FeaturedCompetitionCardProps> = ({ competition }) => {
  const { id, title, description, bannerImageUrl, bannerImageDataUrl, prize, endDate, status } = competition;
  const displayBannerUrl = bannerImageDataUrl || bannerImageUrl || `https://picsum.photos/seed/${id}/800/450`;
  
  const timeRemaining = () => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0 || status !== 'open') return "Not open for entries";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left to enter`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return "Closing soon!";
  };

  return (
    <div className="relative group bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 shadow-2xl rounded-2xl overflow-hidden p-8 text-white transition-all duration-500 hover:shadow-purple-500/50">
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <img 
          src={displayBannerUrl} 
          alt="" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <Trophy size={48} className="text-yellow-400" />
          {status === 'open' && (
            <span className="px-3 py-1.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full shadow-md animate-pulse">
                {timeRemaining()}
            </span>
          )}
           {status !== 'open' && (
            <span className="px-3 py-1.5 text-xs font-semibold bg-gray-500 text-white rounded-full shadow-md capitalize">
                {status}
            </span>
          )}
        </div>

        <h3 className="text-3xl font-bold mb-3 truncate" title={title}>{title}</h3>
        <p className="text-gray-200 text-sm mb-5 h-12 overflow-hidden text-ellipsis line-clamp-2">
          {description}
        </p>

        <div className="mb-6">
            <p className="text-lg font-semibold text-yellow-300">Prize: <span className="font-bold">{prize}</span></p>
        </div>
        
        <Link to={generatePath(ROUTES.COMPETITION_DETAIL, {id})}>
            <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50" 
                rightIcon={<ArrowRight size={20}/>}
                size="lg"
            >
                {status === 'open' ? 'Enter Now' : 'View Details'}
            </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCompetitionCard;