import React from 'react';
import { Resource } from '../../types';
import Button from '../shared/Button';
import { BookOpen, Tag, Calendar, Edit3, Trash2, ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onEdit?: (resource: Resource) => void; 
  onDelete?: (resourceId: string) => void;
  showAdminControls?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onEdit, onDelete, showAdminControls = false }) => {
  const { id, title, description, link, category, tags, createdAt, imageUrl, imageDataUrl } = resource;
  const displayImageUrl = imageDataUrl || imageUrl || `https://picsum.photos/seed/res${id}/500/250`;

  return (
    <div className="group bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl dark:hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.01] border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-700">
      {(imageUrl || imageDataUrl) && (
         <div className="overflow-hidden h-48">
            <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
            src={displayImageUrl} 
            alt={`${title} banner`}
            />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase flex items-center">
                <Tag size={14} className="mr-1.5"/>{category}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar size={14} className="mr-1.5"/>Added: {new Date(createdAt).toLocaleDateString()}
            </p>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={title}>{title}</h3>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 h-20 overflow-hidden text-ellipsis line-clamp-4">
          {description}
        </p>

        {tags && tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full shadow-sm group-hover:bg-indigo-100 dark:group-hover:bg-indigo-700/50 transition-colors">{tag}</span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500" leftIcon={<ExternalLink size={18}/>}>
                    Access Resource
                </Button>
            </a>
            {showAdminControls && onEdit && onDelete && (
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => onEdit(resource)} className="flex-1 sm:flex-initial" leftIcon={<Edit3 size={18}/>} title={`Edit ${title}`}>Edit</Button>
                    <Button variant="danger_outline" onClick={() => onDelete(id)} className="flex-1 sm:flex-initial" leftIcon={<Trash2 size={18}/>} title={`Delete ${title}`}>Delete</Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;