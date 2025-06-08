import React, { useState, useEffect } from 'react';
import { Workshop, UploadedFile } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import FileInput from '../shared/FileInput'; // New
import { useAlert } from '../../hooks/useAlert';

interface WorkshopFormProps {
  initialWorkshop?: Workshop | null;
  onSubmit: (workshopData: Omit<Workshop, 'id' | 'registeredTalents' | 'bannerImageUrl'> | Workshop) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const WorkshopForm: React.FC<WorkshopFormProps> = ({ initialWorkshop, onSubmit, onCancel, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState(''); 
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(undefined);
  const [locationOrLink, setLocationOrLink] = useState('');
  const [facilitator, setFacilitator] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [fee, setFee] = useState('Free');
  const [bannerImageDataUrl, setBannerImageDataUrl] = useState<string | null>(null);
  const { addAlert } = useAlert();

  useEffect(() => {
    if (initialWorkshop) {
      setTitle(initialWorkshop.title);
      setDescription(initialWorkshop.description);
      setDateTime(new Date(initialWorkshop.dateTime).toISOString().substring(0, 16));
      setDurationMinutes(initialWorkshop.durationMinutes);
      setLocationOrLink(initialWorkshop.locationOrLink);
      setFacilitator(initialWorkshop.facilitator || '');
      setCategory(initialWorkshop.category || '');
      setCapacity(initialWorkshop.capacity);
      setFee(initialWorkshop.fee);
      setBannerImageDataUrl(initialWorkshop.bannerImageDataUrl || initialWorkshop.bannerImageUrl || null);
    } else {
      const now = new Date();
      const defaultStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000); 
      setDateTime(defaultStart.toISOString().substring(0,16));
      setDurationMinutes(60);
      setFee('Free');
      setTitle(''); setDescription(''); setLocationOrLink(''); setFacilitator(''); setCategory(''); setCapacity(undefined); setBannerImageDataUrl(null);
    }
  }, [initialWorkshop]);

  const handleBannerImageChange = (file: UploadedFile | null) => {
    setBannerImageDataUrl(file ? file.dataUrl : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (new Date(dateTime) < new Date() && !initialWorkshop) {
        addAlert('Workshop date must be in the future for new workshops.', 'error');
        return;
    }
    const workshopDataPayload: any = {
      title,
      description,
      dateTime: new Date(dateTime).toISOString(),
      durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      locationOrLink,
      facilitator: facilitator || undefined,
      category: category || undefined,
      capacity: capacity ? Number(capacity) : undefined,
      fee,
      bannerImageDataUrl: bannerImageDataUrl,
    };
    if (!bannerImageDataUrl && initialWorkshop?.bannerImageUrl) {
        workshopDataPayload.bannerImageUrl = initialWorkshop.bannerImageUrl;
    }


    if (initialWorkshop && initialWorkshop.id) {
      onSubmit({ ...workshopDataPayload, id: initialWorkshop.id, registeredTalents: initialWorkshop.registeredTalents } as Workshop);
    } else {
      onSubmit(workshopDataPayload as Omit<Workshop, 'id' | 'registeredTalents' | 'bannerImageUrl'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      <FileInput
        label="Workshop Banner Image"
        onFileChange={handleBannerImageChange}
        currentFileUrl={bannerImageDataUrl || (initialWorkshop?.bannerImageDataUrl || initialWorkshop?.bannerImageUrl)}
        acceptedFileTypes="image/*"
        maxFileSizeMB={3}
      />
      <Input id="title" label="Workshop Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea 
          id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        />
      </div>
      <Input id="dateTime" label="Date & Time" value={dateTime} onChange={e => setDateTime(e.target.value)} type="datetime-local" required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="durationMinutes" label="Duration (minutes, optional)" value={durationMinutes || ''} onChange={e => setDurationMinutes(e.target.value ? parseInt(e.target.value) : undefined)} type="number" min="0" />
        <Input id="capacity" label="Capacity (optional, 0 for unlimited)" value={capacity || ''} onChange={e => setCapacity(e.target.value ? parseInt(e.target.value) : undefined)} type="number" min="0" />
      </div>
      <Input id="locationOrLink" label="Location or Virtual Link" value={locationOrLink} onChange={e => setLocationOrLink(e.target.value)} required placeholder="e.g., Community Hall Room 5 or https://zoom.us/..." />
      <Input id="facilitator" label="Facilitator (optional)" value={facilitator} onChange={e => setFacilitator(e.target.value)} />
      <Input id="category" label="Category (optional)" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Art, Tech, Music" />
      <Input id="fee" label="Fee" value={fee} onChange={e => setFee(e.target.value)} required placeholder="e.g., Free, $10, Donation-based" />
      
      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 py-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-500">
          {initialWorkshop ? 'Save Changes' : 'Create Workshop'}
        </Button>
      </div>
    </form>
  );
};

export default WorkshopForm;