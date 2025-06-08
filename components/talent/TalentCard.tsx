import React from 'react';
import { Link } from 'react-router-dom';
import { Talent } from '../../types';
import Button from '../shared/Button';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TalentCardProps {
  talent: Talent;
  onEdit?: (talent: Talent) => void;
  onDelete?: (talentId: string) => void;
  showAdminControls?: boolean;
}

const TalentCard: React.FC<TalentCardProps> = ({ talent, onEdit, onDelete, showAdminControls = false }) => {
  const displayImageUrl = talent.profileImageDataUrl || talent.profileImageUrl || `https://picsum.photos/seed/${talent.id}/400/300`;
  
  return (
    <div className="group bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl dark:hover:shadow-primary-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-700">
      <div className="overflow-hidden h-56">
        <img 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" 
          src={displayImageUrl} 
          alt={`${talent.name}'s profile picture`}
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" title={talent.name}>{talent.name}</h3>
        <p className="text-sm text-blue-500 dark:text-blue-400 font-medium mb-3">{talent.category}</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 h-20 overflow-hidden text-ellipsis line-clamp-4">
          {talent.description}
        </p>
        {talent.skills && talent.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Top Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {talent.skills.slice(0, 3).map(skill => (
                <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full shadow-sm group-hover:bg-primary-100 dark:group-hover:bg-primary-700/50 transition-colors">{skill}</span>
              ))}
              {talent.skills.length > 3 && <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full shadow-sm group-hover:bg-primary-100 dark:group-hover:bg-primary-700/50 transition-colors">+{talent.skills.length - 3} more</span>}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <Link to={`/talent/${talent.id}`} className="flex-1">
                <Button variant="primary" className="w-full" leftIcon={<EyeIcon className="h-5 w-5"/>}>View Profile</Button>
            </Link>
            {showAdminControls && onEdit && onDelete && (
                <>
                    <Button variant="secondary" onClick={() => onEdit(talent)} className="w-full sm:w-auto" leftIcon={<PencilIcon className="h-5 w-5"/>} title={`Edit ${talent.name}`}>Edit</Button>
                    <Button variant="danger_outline" onClick={() => onDelete(talent.id)} className="w-full sm:w-auto" leftIcon={<TrashIcon className="h-5 w-5"/>} title={`Delete ${talent.name}`}>Delete</Button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default TalentCard;