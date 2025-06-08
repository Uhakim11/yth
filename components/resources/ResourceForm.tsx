import React, { useState, useEffect } from 'react';
import { Resource, ResourceCategory, UploadedFile } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import FileInput from '../shared/FileInput'; // New
import { RESOURCE_CATEGORIES_LIST } from '../../constants';

interface ResourceFormProps {
  initialResource?: Resource | null;
  onSubmit: (resourceData: Omit<Resource, 'id' | 'createdAt' | 'addedByAdminId' | 'imageUrl'> | Resource) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ initialResource, onSubmit, onCancel, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState<ResourceCategory>(RESOURCE_CATEGORIES_LIST[0]);
  const [tags, setTags] = useState(''); 
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialResource) {
      setTitle(initialResource.title);
      setDescription(initialResource.description);
      setLink(initialResource.link);
      setCategory(initialResource.category);
      setTags(initialResource.tags?.join(', ') || '');
      setImageDataUrl(initialResource.imageDataUrl || initialResource.imageUrl || null);
    } else {
      setTitle(''); setDescription(''); setLink(''); setCategory(RESOURCE_CATEGORIES_LIST[0]); setTags(''); setImageDataUrl(null);
    }
  }, [initialResource]);

  const handleImageChange = (file: UploadedFile | null) => {
    setImageDataUrl(file ? file.dataUrl : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resourceDataPayload: any = {
      title,
      description,
      link,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      imageDataUrl: imageDataUrl,
    };
    if (!imageDataUrl && initialResource?.imageUrl) {
        resourceDataPayload.imageUrl = initialResource.imageUrl;
    }

    if (initialResource && initialResource.id) {
      onSubmit({ ...resourceDataPayload, id: initialResource.id, createdAt: initialResource.createdAt, addedByAdminId: initialResource.addedByAdminId } as Resource);
    } else {
      onSubmit(resourceDataPayload as Omit<Resource, 'id' | 'createdAt' | 'addedByAdminId' | 'imageUrl'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      <FileInput
        label="Resource Image (Optional)"
        onFileChange={handleImageChange}
        currentFileUrl={imageDataUrl || (initialResource?.imageDataUrl || initialResource?.imageUrl)}
        acceptedFileTypes="image/*"
        maxFileSizeMB={2}
      />
      <Input id="title" label="Resource Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea 
          id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        />
      </div>
      <Input id="link" label="Resource Link (URL)" value={link} onChange={e => setLink(e.target.value)} type="url" required placeholder="https://example.com/resource" />
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select 
          id="category" value={category} onChange={e => setCategory(e.target.value as ResourceCategory)} required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        >
          {RESOURCE_CATEGORIES_LIST.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <Input id="tags" label="Tags (comma-separated, optional)" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., free, tutorial, funding" />
      
      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 py-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500">
          {initialResource ? 'Save Changes' : 'Create Resource'}
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;