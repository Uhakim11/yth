import React, { useState, useEffect } from 'react';
import { PortfolioItem, PortfolioItemType, UploadedFile } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import FileInput from '../shared/FileInput'; // New
import { useAlert } from '../../hooks/useAlert';

interface PortfolioItemFormProps {
  initialItem?: PortfolioItem | null;
  onSubmit: (itemData: Omit<PortfolioItem, 'id' | 'talentId' | 'createdAt'> | PortfolioItem) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  talentPortfolio: PortfolioItem[]; 
}

const portfolioTypes: PortfolioItemType[] = ['image', 'video', 'blog', 'link'];

const PortfolioItemForm: React.FC<PortfolioItemFormProps> = ({
  initialItem,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [type, setType] = useState<PortfolioItemType>(initialItem?.type || 'image');
  const [title, setTitle] = useState(initialItem?.title || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  
  // Handles URL for link, text for blog
  const [contentUrlOrText, setContentUrlOrText] = useState(
    (initialItem?.type === 'link' || initialItem?.type === 'blog') ? initialItem?.contentUrlOrText || '' : ''
  );
  // Handles data URL for image/video
  const [contentDataUrl, setContentDataUrl] = useState<string | null>(initialItem?.contentDataUrl || null);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(initialItem?.thumbnailDataUrl || null);
  
  const { addAlert } = useAlert();

  useEffect(() => {
    if (initialItem) {
      setType(initialItem.type);
      setTitle(initialItem.title);
      setDescription(initialItem.description || '');
      if (initialItem.type === 'image' || initialItem.type === 'video') {
        setContentDataUrl(initialItem.contentDataUrl || initialItem.contentUrlOrText || null); // Handle old contentUrlOrText for images/videos
        setThumbnailDataUrl(initialItem.thumbnailDataUrl || null);
        setContentUrlOrText(''); // Clear text/link field
      } else {
        setContentUrlOrText(initialItem.contentUrlOrText || '');
        setContentDataUrl(null); // Clear data fields
        setThumbnailDataUrl(null);
      }
    } else {
      // Reset for new item
      setType('image');
      setTitle('');
      setDescription('');
      setContentUrlOrText('');
      setContentDataUrl(null);
      setThumbnailDataUrl(null);
    }
  }, [initialItem]);

  const handleContentFileChange = (file: UploadedFile | null) => {
    setContentDataUrl(file ? file.dataUrl : null);
  };
  
  const handleThumbnailFileChange = (file: UploadedFile | null) => {
    setThumbnailDataUrl(file ? file.dataUrl : null);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        addAlert('Title is required.', 'error');
        return;
    }

    let itemData: any = {
      type,
      title,
      description: description || undefined,
    };

    if (type === 'blog') {
        if (!contentUrlOrText.trim()) {
            addAlert('Blog content is required.', 'error');
            return;
        }
        itemData.contentUrlOrText = contentUrlOrText;
    } else if (type === 'link') {
        if (!contentUrlOrText.trim() || !contentUrlOrText.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
            addAlert('A valid Link URL is required.', 'error');
            return;
        }
        itemData.contentUrlOrText = contentUrlOrText;
        itemData.thumbnailDataUrl = thumbnailDataUrl || undefined; // Keep if provided
    } else if (type === 'image' || type === 'video') {
        if (!contentDataUrl) {
             addAlert(`${type === 'image' ? 'Image' : 'Video'} file is required.`, 'error');
             return;
        }
        itemData.contentDataUrl = contentDataUrl;
        itemData.thumbnailDataUrl = thumbnailDataUrl || undefined;
    }


    if (initialItem && initialItem.id) {
      onSubmit({ ...itemData, id: initialItem.id, talentId: initialItem.talentId, createdAt: initialItem.createdAt });
    } else {
      onSubmit(itemData as Omit<PortfolioItem, 'id' | 'talentId' | 'createdAt'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      <div>
        <label htmlFor="portfolioItemType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
        <select
          id="portfolioItemType"
          value={type}
          onChange={(e) => {
            setType(e.target.value as PortfolioItemType);
            // Reset fields when type changes to avoid carrying over incompatible data
            setContentUrlOrText('');
            setContentDataUrl(null);
            setThumbnailDataUrl(null);
          }}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        >
          {portfolioTypes.map(pt => <option key={pt} value={pt} className="capitalize">{pt}</option>)}
        </select>
      </div>

      <Input id="portfolioItemTitle" label="Title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., My Awesome Painting, Demo Reel 2024" />
      
      <div>
        <label htmlFor="portfolioItemDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
        <textarea
          id="portfolioItemDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          placeholder="Briefly describe this item..."
        />
      </div>

      {type === 'blog' && (
        <div>
          <label htmlFor="portfolioItemContentBlog" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blog Content (Markdown supported)</label>
          <textarea
            id="portfolioItemContentBlog" value={contentUrlOrText} onChange={e => setContentUrlOrText(e.target.value)} required rows={10}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm font-mono"
            placeholder="Write your blog post here..."
          />
        </div>
      )}
      {type === 'link' && (
         <Input 
            id="portfolioItemContentUrlLink" 
            label="Link URL" 
            value={contentUrlOrText} 
            onChange={e => setContentUrlOrText(e.target.value)} 
            type="url" 
            required 
            placeholder="https://example.com/my-article"
        />
      )}
      {(type === 'image' || type === 'video') && (
        <FileInput
            label={type === 'image' ? "Image File" : "Video File (Upload a small clip or link to external video)"}
            onFileChange={handleContentFileChange}
            currentFileUrl={contentDataUrl}
            acceptedFileTypes={type === 'image' ? "image/*" : "video/*"}
            maxFileSizeMB={type === 'image' ? 5 : 10} // Example sizes
        />
      )}


      {(type === 'video' || type === 'link') && (
         <FileInput
            label="Thumbnail Image (Optional)"
            onFileChange={handleThumbnailFileChange}
            currentFileUrl={thumbnailDataUrl}
            acceptedFileTypes="image/*"
            maxFileSizeMB={2}
        />
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 py-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500">
          {initialItem ? 'Save Changes' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default PortfolioItemForm;