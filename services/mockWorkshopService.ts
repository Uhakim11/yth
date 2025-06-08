import { Workshop, UploadedFile } from '../types';
import { MOCK_WORKSHOPS } from '../constants';

let workshopsStore: Workshop[] = JSON.parse(JSON.stringify(MOCK_WORKSHOPS)); 

const MOCK_API_DELAY = 400;

export const getWorkshops = (): Promise<Workshop[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...workshopsStore]);
    }, MOCK_API_DELAY);
  });
};

export const getWorkshopById = (id: string): Promise<Workshop | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const workshop = workshopsStore.find(w => w.id === id);
      resolve(workshop ? { ...workshop } : undefined);
    }, MOCK_API_DELAY);
  });
};

export const addWorkshop = (data: Omit<Workshop, 'id' | 'registeredTalents' | 'bannerImageUrl'> & {bannerImageDataUrl?: string}): Promise<Workshop> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newWorkshop: Workshop = {
        ...data,
        id: `work${Date.now()}`,
        registeredTalents: [],
        bannerImageDataUrl: data.bannerImageDataUrl,
        bannerImageUrl: data.bannerImageDataUrl ? undefined : 'https://picsum.photos/seed/newws/600/300',
      };
      workshopsStore.push(newWorkshop);
      resolve({ ...newWorkshop });
    }, MOCK_API_DELAY);
  });
};

export const updateWorkshop = (data: Workshop): Promise<Workshop> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = workshopsStore.findIndex(w => w.id === data.id);
      if (index !== -1) {
        workshopsStore[index] = { 
            ...workshopsStore[index], 
            ...data,
            bannerImageDataUrl: data.bannerImageDataUrl || workshopsStore[index].bannerImageDataUrl,
            bannerImageUrl: data.bannerImageDataUrl ? undefined : (data.bannerImageUrl || workshopsStore[index].bannerImageUrl),
        };
        resolve({ ...workshopsStore[index] });
      } else {
        reject(new Error('Workshop not found for update.'));
      }
    }, MOCK_API_DELAY);
  });
};

export const deleteWorkshop = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = workshopsStore.length;
      workshopsStore = workshopsStore.filter(w => w.id !== id);
      if (workshopsStore.length < initialLength) {
        resolve();
      } else {
        reject(new Error('Workshop not found for deletion.'));
      }
    }, MOCK_API_DELAY);
  });
};

export const registerForWorkshop = (workshopId: string, talentId: string, talentName: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const workshopIndex = workshopsStore.findIndex(w => w.id === workshopId);
      if (workshopIndex === -1) {
        return reject(new Error('Workshop not found.'));
      }
      const workshop = workshopsStore[workshopIndex];
      if (workshop.capacity && workshop.registeredTalents.length >= workshop.capacity) {
        return reject(new Error('Workshop is full.'));
      }
      if (workshop.registeredTalents.some(t => t.talentId === talentId)) {
        return reject(new Error('You are already registered for this workshop.'));
      }
      workshop.registeredTalents.push({ talentId, talentName, registrationDate: new Date().toISOString() });
      resolve(true);
    }, MOCK_API_DELAY);
  });
};

export const unregisterFromWorkshop = (workshopId: string, talentId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const workshopIndex = workshopsStore.findIndex(w => w.id === workshopId);
      if (workshopIndex === -1) {
        return reject(new Error('Workshop not found.'));
      }
      const initialLength = workshopsStore[workshopIndex].registeredTalents.length;
      workshopsStore[workshopIndex].registeredTalents = workshopsStore[workshopIndex].registeredTalents.filter(
        t => t.talentId !== talentId
      );
      if (workshopsStore[workshopIndex].registeredTalents.length < initialLength) {
        resolve(true);
      } else {
        resolve(true); 
      }
    }, MOCK_API_DELAY);
  });
};