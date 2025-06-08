import { Resource, UploadedFile } from '../types';
import { MOCK_RESOURCES } from '../constants';

let resourcesStore: Resource[] = JSON.parse(JSON.stringify(MOCK_RESOURCES)); 

const MOCK_API_DELAY = 300;

export const getResources = (): Promise<Resource[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...resourcesStore].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); 
    }, MOCK_API_DELAY);
  });
};

export const addResource = (data: Omit<Resource, 'id' | 'createdAt' | 'addedByAdminId' | 'imageUrl'> & { imageDataUrl?: string }, adminId: string): Promise<Resource> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newResource: Resource = {
        ...data,
        id: `res${Date.now()}`,
        addedByAdminId: adminId,
        createdAt: new Date().toISOString(),
        imageDataUrl: data.imageDataUrl,
        imageUrl: data.imageDataUrl ? undefined : 'https://picsum.photos/seed/newres/400/200',
      };
      resourcesStore.unshift(newResource); 
      resolve({ ...newResource });
    }, MOCK_API_DELAY);
  });
};

export const updateResource = (data: Resource): Promise<Resource> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = resourcesStore.findIndex(r => r.id === data.id);
      if (index !== -1) {
        resourcesStore[index] = { 
            ...resourcesStore[index], 
            ...data,
            imageDataUrl: data.imageDataUrl || resourcesStore[index].imageDataUrl,
            imageUrl: data.imageDataUrl ? undefined : (data.imageUrl || resourcesStore[index].imageUrl),
        }; 
        resolve({ ...resourcesStore[index] });
      } else {
        reject(new Error('Resource not found for update.'));
      }
    }, MOCK_API_DELAY);
  });
};

export const deleteResource = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = resourcesStore.length;
      resourcesStore = resourcesStore.filter(r => r.id !== id);
      if (resourcesStore.length < initialLength) {
        resolve();
      } else {
        reject(new Error('Resource not found for deletion.'));
      }
    }, MOCK_API_DELAY);
  });
};