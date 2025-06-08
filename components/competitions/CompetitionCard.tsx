import React from 'react';
import { Link } from 'react-router-dom';
import { Competition, CompetitionStatus } from '../../types';
import Button from '../shared/Button';
import { generatePath, ROUTES } from '../../constants';
import { CalendarDays, Trophy, Clock, Users, Eye, Edit3, Trash2, ClipboardList, Settings2, ListChecks } from 'lucide-react'; // Added ListChecks
import { useAuth } from '../../hooks/useAuth'; // To check user login status


interface CompetitionCardProps {
  competition: Competition;
  onEdit?: (competition: Competition) => void; // For admin
  onDelete?: (competitionId: string) => void; // For admin
  showAdminControls?: boolean;
}

const getStatusColor = (status: CompetitionStatus) => {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 ring-1 ring-green-500/50';
    case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 ring-1 ring-blue-500/50';
    case 'judging': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 ring-1 ring-yellow-500/50';
    case 'closed': return 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 ring-1 ring-red-500/50';
    case 'archived': return 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 ring-1 ring-gray-500/50';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 ring-1 ring-gray-500/50';
  }
};

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, onEdit, onDelete, showAdminControls = false }) => {
  const { id, title, description, bannerImageUrl, bannerImageDataUrl, prize, startDate, endDate, status, submissions, tasks } = competition;
  const { user, isAuthenticated } = useAuth(); // Get current user state
  
  const formattedStartDate = new Date(startDate).toLocaleDateString();
  const formattedEndDate = new Date(endDate).toLocaleDateString();
  const displayBannerUrl = bannerImageDataUrl || bannerImageUrl || `https://picsum.photos/seed/${id}/600/300`;


  return (
    <div className="group bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.01] hover:border-primary-500/30 border-2 border-transparent dark:hover:border-primary-600/40">
      <div className="relative">
        <img 
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
          src={displayBannerUrl} 
          alt={`${title} banner`}
        />
        <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)} capitalize shadow-sm`}>
          {status}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" title={title}>{title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <CalendarDays size={16} className="mr-2" />
          <span>{formattedStartDate} - {formattedEndDate}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 h-16 overflow-hidden text-ellipsis line-clamp-3">
          {description}
        </p>

        <div className="mb-4 space-y-2">
            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                <Trophy size={16} className="mr-2 flex-shrink-0" />
                <span className="font-semibold">Prize:</span>&nbsp;<span className="truncate">{prize}</span>
            </div>
            {status === 'open' && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Users size={16} className="mr-2 flex-shrink-0" />
                    <span>{submissions?.length || 0} Entries</span>
                </div>
            )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <Link to={generatePath(ROUTES.COMPETITION_DETAIL, {id})} className="flex-1">
                <Button variant="primary" className="w-full" leftIcon={<Eye size={18}/>}>View Details</Button>
            </Link>
            {!showAdminControls && isAuthenticated && status === 'open' && tasks && tasks.length > 0 && (
              <Link to={generatePath(ROUTES.COMPETITION_USER_TASK_PAGE, {id})} className="flex-1">
                <Button variant="success" className="w-full" leftIcon={<ListChecks size={18}/>}>View Tasks</Button>
              </Link>
            )}
        </div>
        {showAdminControls && onEdit && onDelete && (
            <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-3 border-t border-gray-200 dark:border-gray-700/50">
                {tasks && tasks.length > 0 && (
                  <Link to={generatePath(ROUTES.COMPETITION_TASKS_DETAILS, {id})} className="flex-1 sm:flex-initial">
                      <Button variant="info_outline" className="w-full" leftIcon={<Settings2 size={18}/>} title={`Manage Task Content for ${title}`}>Manage Task Content</Button>
                  </Link>
                )}
                <Button variant="secondary" onClick={() => onEdit(competition)} className="flex-1 sm:flex-initial" leftIcon={<Edit3 size={18}/>} title={`Edit ${title}`}>Edit Details</Button>
                <Button variant="danger_outline" onClick={() => onDelete(id)} className="flex-1 sm:flex-initial" leftIcon={<Trash2 size={18}/>} title={`Delete ${title}`}>Delete</Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionCard;