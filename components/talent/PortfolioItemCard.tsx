import React, { useState } from 'react';
import { PortfolioItem } from '../../types';
import { PORTFOLIO_ITEM_ICONS } from '../../constants';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import { Edit3, Trash2, Maximize2, ExternalLink } from 'lucide-react';
import Markdown from 'react-markdown';
import { useAlert } from '../../hooks/useAlert'; // Added import

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (itemId: string) => void;
  showControls?: boolean;
}

const PortfolioItemCard: React.FC<PortfolioItemCardProps> = ({ item, onEdit, onDelete, showControls = false }) => {
  const IconComponent = PORTFOLIO_ITEM_ICONS[item.type] || PORTFOLIO_ITEM_ICONS.link;
  const [showFullBlogModal, setShowFullBlogModal] = useState(false);
  const { addAlert } = useAlert(); // Initialized addAlert

  const renderContentPreview = () => {
    const imageSrc = item.contentDataUrl || item.contentUrlOrText; // Fallback for old image URLs if needed
    const thumbSrc = item.thumbnailDataUrl;

    switch (item.type) {
      case 'image':
        return <img src={imageSrc} alt={item.title} className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition-opacity" />;
      case 'video':
        return (
          <div className="w-full h-48 bg-black rounded-t-lg flex items-center justify-center relative">
            {thumbSrc ? (
              <img src={thumbSrc} alt={item.title} className="max-h-full max-w-full object-contain opacity-80 group-hover:opacity-100" />
            ) : imageSrc && imageSrc.startsWith('data:image') ? ( // If contentDataUrl is an image (e.g. animated GIF used as video)
              <img src={imageSrc} alt={item.title} className="max-h-full max-w-full object-contain opacity-80 group-hover:opacity-100" />
            ): (
              <IconComponent size={64} className="text-gray-500" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
                <a 
                  href={item.contentDataUrl || item.contentUrlOrText} // Link to actual video file or external video page
                  target="_blank" rel="noopener noreferrer" 
                  className="p-3 bg-black/50 rounded-full text-white hover:bg-primary-500/80 transition-colors" 
                  title="Watch Video"
                  onClick={(e) => { // If it's a data URL for video, it won't play directly in new tab. Prevent if no real URL.
                    if(item.contentDataUrl && !(item.contentUrlOrText && item.contentUrlOrText.startsWith('http'))) {
                        e.preventDefault(); 
                        addAlert("Video playback from data URL is browser-dependent. External link preferred for videos, or ensure a direct playable source.", "info");
                    }
                  }}
                >
                    <PORTFOLIO_ITEM_ICONS.video size={32}/>
                </a>
            </div>
          </div>
        );
      case 'blog':
        return (
          <div className="p-4 h-48 overflow-hidden relative">
            <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-6">
                <Markdown components={{ p: ({node, ...props}) => <p className="mb-1" {...props} /> }}>
                    {item.contentUrlOrText}
                </Markdown>
            </div>
            <div className="absolute bottom-2 right-2">
                <Button variant="ghost" size="sm" onClick={() => setShowFullBlogModal(true)} leftIcon={<Maximize2 size={14}/>}>Read Full</Button>
            </div>
          </div>
        );
      case 'link':
         return (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg flex items-center justify-center p-4 relative">
            {thumbSrc ? (
                <img src={thumbSrc} alt={item.title} className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100" />
            ) : (
                <IconComponent size={64} className="text-gray-500" />
            )}
             <div className="absolute inset-0 flex items-center justify-center">
                <a href={item.contentUrlOrText} target="_blank" rel="noopener noreferrer" className="p-3 bg-black/50 rounded-full text-white hover:bg-primary-500/80 transition-colors" title="Open Link">
                    <ExternalLink size={32}/>
                </a>
            </div>
          </div>
        );
      default:
        return <div className="h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-t-lg"><IconComponent size={48} className="text-gray-400" /></div>;
    }
  };

  return (
    <>
      <div className="group bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative">
            {renderContentPreview()}
        </div>
        <div className="p-4">
          <div className="flex items-center mb-1">
            <IconComponent size={18} className="mr-2 text-primary-500 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={item.title}>{item.title}</h3>
          </div>
          {item.description && <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{item.description}</p>}
          <p className="text-xs text-gray-400 dark:text-gray-500">Added: {new Date(item.createdAt).toLocaleDateString()}</p>
          
          {showControls && onEdit && onDelete && (
            <div className="mt-3 pt-3 border-t dark:border-gray-700 flex justify-end space-x-2">
              <Button variant="secondary" size="sm" onClick={() => onEdit(item)} leftIcon={<Edit3 size={14}/>}>Edit</Button>
              <Button variant="danger_outline" size="sm" onClick={() => onDelete(item.id)} leftIcon={<Trash2 size={14}/>}>Delete</Button>
            </div>
          )}
        </div>
      </div>

      {item.type === 'blog' && (
        <Modal isOpen={showFullBlogModal} onClose={() => setShowFullBlogModal(false)} title={item.title} size="xl">
          <div className="prose dark:prose-invert max-w-none p-2 blog-content max-h-[70vh] overflow-y-auto">
            <Markdown>{item.contentUrlOrText}</Markdown>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PortfolioItemCard;