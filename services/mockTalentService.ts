
import { Talent, PortfolioItem, UploadedFile } from '../types';
import { MOCK_TALENT_CATEGORIES, MOCK_TALENTS_DATA, MOCK_PORTFOLIO_ITEMS_ALICE } from '../constants';

// Initialize mockTalents with a deep copy from constants to allow in-memory modification
let mockTalents: Talent[] = JSON.parse(JSON.stringify(MOCK_TALENTS_DATA));
mockTalents = mockTalents.map(talent => {
    if (talent.id === 'talent1') { // Alice Wonderland
        return { ...talent, portfolio: JSON.parse(JSON.stringify(MOCK_PORTFOLIO_ITEMS_ALICE)) };
    }
    return talent;
});


const MOCK_API_DELAY = 300;

export const getTalents = (): Promise<Talent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTalents.map(t => ({...t, portfolio: t.portfolio || [] }))); 
    }, MOCK_API_DELAY);
  });
};

export const getTalentById = (id: string): Promise<Talent | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const talent = mockTalents.find(t => t.id === id);
      resolve(talent ? {...talent, portfolio: talent.portfolio || []} : undefined); 
    }, MOCK_API_DELAY);
  });
};

export const addTalent = (talentData: Omit<Talent, 'id' | 'userId' | 'portfolio' | 'profileImageUrl'> & { profileImageDataUrl?: string }, userId: string): Promise<Talent | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTalent: Talent = {
        ...talentData,
        id: `talent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // More unique ID
        userId: userId, // Assign the provided userId
        portfolio: [],
        profileImageDataUrl: talentData.profileImageDataUrl, 
        profileImageUrl: talentData.profileImageDataUrl ? undefined : 'https://picsum.photos/seed/newtalent/400/300', 
      };
      mockTalents.push(newTalent);
      resolve({...newTalent}); 
    }, MOCK_API_DELAY);
  });
};

export const updateTalent = (talentData: Talent): Promise<Talent | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTalents.findIndex(t => t.id === talentData.id);
      if (index !== -1) {
        mockTalents[index] = { 
            ...mockTalents[index], 
            ...talentData, 
            profileImageDataUrl: talentData.profileImageDataUrl || mockTalents[index].profileImageDataUrl,
            profileImageUrl: talentData.profileImageDataUrl ? undefined : (talentData.profileImageUrl || mockTalents[index].profileImageUrl), 
            portfolio: talentData.portfolio || mockTalents[index].portfolio || [] 
        };
        resolve({...mockTalents[index]}); 
      } else {
        reject(new Error('Talent not found for update.'));
      }
    }, MOCK_API_DELAY);
  });
};

export const deleteTalent = (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockTalents.length;
      mockTalents = mockTalents.filter(t => t.id !== id);
      if (mockTalents.length < initialLength) {
        resolve(true);
      } else {
        // To avoid error in UI if talent was already deleted, resolve true but log
        console.warn(`Attempted to delete talent ID ${id} but it was not found. It might have been deleted already.`);
        resolve(true); 
      }
    }, MOCK_API_DELAY);
  });
};

// --- Portfolio Item Functions ---
type PortfolioItemCreationData = Omit<PortfolioItem, 'id' | 'talentId' | 'createdAt' | 'contentUrlOrText'> & {
    contentUrlOrText?: string; // For blog/link
    contentDataUrl?: string; // For image/video
    thumbnailDataUrl?: string; // For image/video thumbnail
};


export const addPortfolioItem = (talentId: string, itemData: PortfolioItemCreationData): Promise<PortfolioItem | null> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const talentIndex = mockTalents.findIndex(t => t.id === talentId);
            if (talentIndex === -1) {
                return reject(new Error('Talent not found to add portfolio item.'));
            }
            const newItem: PortfolioItem = {
                ...itemData,
                id: `pf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // More unique ID
                talentId,
                createdAt: new Date().toISOString(),
                contentUrlOrText: itemData.type === 'blog' || itemData.type === 'link' ? itemData.contentUrlOrText || '' : '',
                contentDataUrl: (itemData.type === 'image' || itemData.type === 'video') ? itemData.contentDataUrl : undefined,
                thumbnailDataUrl: itemData.thumbnailDataUrl 
            };
            if (!mockTalents[talentIndex].portfolio) {
                mockTalents[talentIndex].portfolio = [];
            }
            mockTalents[talentIndex].portfolio!.push(newItem);
            resolve({...newItem});
        }, MOCK_API_DELAY);
    });
};

export const updatePortfolioItem = (talentId: string, itemData: PortfolioItem): Promise<PortfolioItem | null> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const talentIndex = mockTalents.findIndex(t => t.id === talentId);
            if (talentIndex === -1 || !mockTalents[talentIndex].portfolio) {
                return reject(new Error('Talent or portfolio not found for update.'));
            }
            const itemIndex = mockTalents[talentIndex].portfolio!.findIndex(p => p.id === itemData.id);
            if (itemIndex === -1) {
                return reject(new Error('Portfolio item not found for update.'));
            }
            mockTalents[talentIndex].portfolio![itemIndex] = {
                ...itemData, // Takes all fields from itemData
                contentUrlOrText: itemData.type === 'blog' || itemData.type === 'link' ? itemData.contentUrlOrText || '' : mockTalents[talentIndex].portfolio![itemIndex].contentUrlOrText,
                contentDataUrl: (itemData.type === 'image' || itemData.type === 'video') ? itemData.contentDataUrl : mockTalents[talentIndex].portfolio![itemIndex].contentDataUrl, // Preserve if new one is not set
                thumbnailDataUrl: itemData.thumbnailDataUrl // Keep new or existing (which could be undefined)
            };
            resolve({...mockTalents[talentIndex].portfolio![itemIndex]});
        }, MOCK_API_DELAY);
    });
};

export const deletePortfolioItem = (talentId: string, itemId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const talentIndex = mockTalents.findIndex(t => t.id === talentId);
            if (talentIndex === -1 || !mockTalents[talentIndex].portfolio) {
                return reject(new Error('Talent or portfolio not found for deletion.'));
            }
            const initialLength = mockTalents[talentIndex].portfolio!.length;
            mockTalents[talentIndex].portfolio = mockTalents[talentIndex].portfolio!.filter(p => p.id !== itemId);
            
            if (mockTalents[talentIndex].portfolio!.length < initialLength) {
                resolve(true);
            } else {
                 console.warn(`Attempted to delete portfolio item ID ${itemId} for talent ${talentId} but it was not found.`);
                resolve(true);
            }
        }, MOCK_API_DELAY);
    });
};
