import React from 'react';
import { Link } from 'react-router-dom';
import { Workshop } from '../../types';
import Button from '../shared/Button';
import { generatePath, ROUTES } from '../../constants';
import { CalendarCheck2, ArrowRight } from 'lucide-react';

interface UpcomingWorkshopCardProps {
  workshop: Workshop;
}

const UpcomingWorkshopCard: React.FC<UpcomingWorkshopCardProps> = ({ workshop }) => {
  const { id, title, dateTime, category, bannerImageUrl, bannerImageDataUrl } = workshop;
  const displayBannerUrl = bannerImageDataUrl || bannerImageUrl || `https://picsum.photos/seed/uws${id}/400/200`;
  
  const formattedDate = new Date(dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' });
  const formattedTime = new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="group bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-teal-500/30 hover:scale-[1.03]">
      <div className="relative">
        <img 
          className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity duration-300" 
          src={displayBannerUrl} 
          alt={`${title} banner`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
            {category && <span className="text-xs px-2 py-0.5 bg-teal-500 text-white rounded-full mb-1 inline-block">{category}</span>}
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-teal-300 transition-colors" title={title}>{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <CalendarCheck2 size={18} className="mr-2 text-teal-500" />
          <span>{formattedDate} at {formattedTime}</span>
        </div>
        
        <Link to={generatePath(ROUTES.WORKSHOP_DETAIL, {id})} className="block">
            <Button 
                variant="secondary" 
                className="w-full !bg-teal-50 hover:!bg-teal-100 dark:!bg-teal-800/50 dark:hover:!bg-teal-700/70 !text-teal-700 dark:!text-teal-300"
                rightIcon={<ArrowRight size={16}/>}
            >
                Learn More
            </Button>
        </Link>
      </div>
    </div>
  );
};

export default UpcomingWorkshopCard;