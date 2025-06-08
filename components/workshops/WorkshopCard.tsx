import React from 'react';
import { Link } from 'react-router-dom';
import { Workshop } from '../../types';
import Button from '../shared/Button';
import { generatePath, ROUTES } from '../../constants';
import { CalendarDays, Clock, Users, MapPin, Edit3, Trash2, Eye } from 'lucide-react';

interface WorkshopCardProps {
  workshop: Workshop;
  onEdit?: (workshop: Workshop) => void; 
  onDelete?: (workshopId: string) => void;
  showAdminControls?: boolean;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, onEdit, onDelete, showAdminControls = false }) => {
  const { id, title, description, dateTime, facilitator, locationOrLink, category, registeredTalents, capacity, fee, bannerImageUrl, bannerImageDataUrl } = workshop;
  
  const formattedDateTime = new Date(dateTime).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const isPast = new Date(dateTime) < new Date();
  const displayBannerUrl = bannerImageDataUrl || bannerImageUrl || `https://picsum.photos/seed/ws${id}/500/250`;

  return (
    <div className={`group bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl dark:hover:shadow-teal-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.01] ${isPast ? 'opacity-70 grayscale-[50%]' : ''} border-2 border-transparent hover:border-teal-300 dark:hover:border-teal-700`}>
      { (bannerImageUrl || bannerImageDataUrl) && (
        <div className="overflow-hidden h-48">
            <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
            src={displayBannerUrl} 
            alt={`${title} banner`}
            />
        </div>
      )}
      <div className="p-6">
        {category && <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase mb-1">{category}</p>}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" title={title}>{title}</h3>
        
        <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 mb-3">
          <p className="flex items-center"><CalendarDays size={14} className="mr-2 flex-shrink-0" /> {formattedDateTime}</p>
          {facilitator && <p className="truncate">Facilitator: {facilitator}</p>}
          <p className="flex items-center"><MapPin size={14} className="mr-2 flex-shrink-0" /> <span className="truncate">{locationOrLink}</span></p>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 h-12 overflow-hidden text-ellipsis line-clamp-2">
          {description}
        </p>

        <div className="flex justify-between items-center text-sm mb-4">
            <span className="font-semibold text-green-600 dark:text-green-400">{fee}</span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <Users size={14} className="mr-1.5"/> {registeredTalents.length}{capacity ? `/${capacity}` : ''} registered
            </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <Link to={generatePath(ROUTES.WORKSHOP_DETAIL, {id})} className="flex-1">
                <Button variant="primary" className="w-full !bg-teal-600 hover:!bg-teal-700 focus-visible:!ring-teal-500" leftIcon={<Eye size={18}/>}>View Details</Button>
            </Link>
            {showAdminControls && onEdit && onDelete && (
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => onEdit(workshop)} className="flex-1 sm:flex-initial" leftIcon={<Edit3 size={18}/>} title={`Edit ${title}`}>Edit</Button>
                    <Button variant="danger_outline" onClick={() => onDelete(id)} className="flex-1 sm:flex-initial" leftIcon={<Trash2 size={18}/>} title={`Delete ${title}`}>Delete</Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;