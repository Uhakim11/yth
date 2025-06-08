import { Competition, CompetitionStatus, CompetitionSubmission, PaymentStatus, CompetitionCategory, PortfolioItem, CompetitionSubmissionRating, CompetitionTask } from '../types'; 
import { MOCK_COMPETITIONS } from '../constants';
import { getTalentById as getTalentProfileById } from './mockTalentService'; 

let competitionsStore: Competition[] = JSON.parse(JSON.stringify(MOCK_COMPETITIONS)); 

const MOCK_API_DELAY = 500;

export const getCompetitions = (): Promise<Competition[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedCompetitions = competitionsStore.map(comp => {
        const now = new Date();
        const startDate = new Date(comp.startDate);
        const endDate = new Date(comp.endDate);
        let newStatus = comp.status;

        if (comp.status !== 'archived' && comp.status !== 'closed' && !comp.winner) { 
            if (now < startDate) newStatus = 'upcoming';
            else if (now >= startDate && now <= endDate) newStatus = 'open';
            else if (now > endDate) newStatus = 'judging'; 
        } else if (comp.winner && comp.status !== 'archived') {
            newStatus = 'closed';
        }
        const submissionsWithRatings = (comp.submissions || []).map(s => ({...s, ratings: s.ratings || []}));
        return { ...comp, status: newStatus, submissions: submissionsWithRatings, tasks: comp.tasks || [] };
      });
      competitionsStore = updatedCompetitions;
      resolve([...competitionsStore]);
    }, MOCK_API_DELAY);
  });
};

export const getCompetitionById = (id: string): Promise<Competition | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const competition = competitionsStore.find(c => c.id === id);
      if (competition) {
        const submissionsWithRatings = (competition.submissions || []).map(s => ({...s, ratings: s.ratings || []}));
        resolve({ ...competition, submissions: submissionsWithRatings, tasks: competition.tasks || [] });
      } else {
        resolve(undefined);
      }
    }, MOCK_API_DELAY);
  });
};

export const addCompetition = (data: Omit<Competition, 'id' | 'submissions' | 'status' | 'bannerImageUrl'> & { bannerImageDataUrl?: string, tasks?: CompetitionTask[] }): Promise<Competition> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const startDate = new Date(data.startDate);
      let status: CompetitionStatus = 'upcoming';
      if (now >= startDate) status = 'open';

      const newCompetition: Competition = {
        ...data,
        id: `comp${Date.now()}`,
        submissions: [],
        status: status,
        category: data.category || 'Other',
        bannerImageDataUrl: data.bannerImageDataUrl, 
        bannerImageUrl: data.bannerImageDataUrl ? undefined : 'https://picsum.photos/seed/newcomp/800/400', 
        tasks: data.tasks || [],
      };
      competitionsStore.push(newCompetition);
      resolve({ ...newCompetition });
    }, MOCK_API_DELAY);
  });
};

export const updateCompetition = (data: Competition): Promise<Competition> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = competitionsStore.findIndex(c => c.id === data.id);
      if (index !== -1) {
        competitionsStore[index] = { 
            ...competitionsStore[index], // Keep existing fields not in data
            ...data, // Overwrite with new data
            bannerImageDataUrl: data.bannerImageDataUrl || competitionsStore[index].bannerImageDataUrl,
            bannerImageUrl: data.bannerImageDataUrl ? undefined : (data.bannerImageUrl || competitionsStore[index].bannerImageUrl),
            tasks: data.tasks || competitionsStore[index].tasks || [], // Ensure tasks are updated
        };
        resolve({ ...competitionsStore[index] });
      } else {
        reject(new Error('Competition not found for update.'));
      }
    }, MOCK_API_DELAY);
  });
};

export const deleteCompetition = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = competitionsStore.length;
      competitionsStore = competitionsStore.filter(c => c.id !== id);
      if (competitionsStore.length < initialLength) {
        resolve();
      } else {
        reject(new Error('Competition not found for deletion.'));
      }
    }, MOCK_API_DELAY);
  });
};

export const addSubmissionToCompetition = async (
  competitionId: string, 
  talentId: string, 
  talentName: string, 
  submissionType: 'text' | 'portfolio',
  content: string, 
  portfolioItemId?: string 
): Promise<CompetitionSubmission> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => { 
      const competitionIndex = competitionsStore.findIndex(c => c.id === competitionId);
      if (competitionIndex === -1) {
        localStorage.setItem('competitionError', 'Competition not found.');
        return reject(new Error('Competition not found.'));
      }
      const currentCompetition = competitionsStore[competitionIndex];
      if (currentCompetition.status !== 'open') {
        localStorage.setItem('competitionError', 'This competition is not open for submissions.');
        return reject(new Error('This competition is not open for submissions.'));
      }
      if (currentCompetition.submissions.some(sub => sub.talentId === talentId)) {
        localStorage.setItem('competitionError', 'You have already submitted an entry for this competition.');
        return reject(new Error('You have already submitted an entry for this competition.'));
      }

      let submissionContentForStorage = content;
      if (submissionType === 'portfolio' && portfolioItemId) {
        submissionContentForStorage = `Portfolio Item ID: ${portfolioItemId}`; 
      } else if (submissionType === 'portfolio' && !portfolioItemId) {
        localStorage.setItem('competitionError', 'Portfolio item ID is required for portfolio submission type.');
        return reject(new Error('Portfolio item ID is required for portfolio submission type.'));
      }

      const newSubmission: CompetitionSubmission = {
        submissionId: `sub${Date.now()}_${talentId}`,
        talentId,
        talentName,
        submissionType,
        submissionContent: submissionContentForStorage, 
        portfolioItemId: submissionType === 'portfolio' ? portfolioItemId : undefined,
        submissionDate: new Date().toISOString(),
        ratings: [], 
      };
      currentCompetition.submissions.push(newSubmission);
      competitionsStore[competitionIndex] = currentCompetition; 
      localStorage.removeItem('competitionError');
      resolve({ ...newSubmission });
    }, MOCK_API_DELAY);
  });
};

export const rateSubmission = (
  competitionId: string,
  submissionId: string,
  judgeId: string, 
  score: number,
  comment?: string
): Promise<CompetitionSubmission | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const compIndex = competitionsStore.findIndex(c => c.id === competitionId);
      if (compIndex === -1) return reject(new Error("Competition not found."));
      
      const subIndex = competitionsStore[compIndex].submissions.findIndex(s => s.submissionId === submissionId);
      if (subIndex === -1) return reject(new Error("Submission not found."));

      let submission = competitionsStore[compIndex].submissions[subIndex];
      if (!submission.ratings) submission.ratings = [];

      submission.ratings = submission.ratings.filter(r => r.judgeId !== judgeId);
      submission.ratings.push({ judgeId, score, comment });
      
      competitionsStore[compIndex].submissions[subIndex] = submission;
      resolve({...submission});
    }, MOCK_API_DELAY);
  });
};


export const markWinner = (
  competitionId: string, 
  talentId: string, 
  talentName: string, 
  submissionId: string
): Promise<Competition> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const competitionIndex = competitionsStore.findIndex(c => c.id === competitionId);
      if (competitionIndex === -1) {
        return reject(new Error('Competition not found.'));
      }
      competitionsStore[competitionIndex].winner = { talentId, talentName, submissionId };
      competitionsStore[competitionIndex].status = 'closed'; 
      competitionsStore[competitionIndex].paymentProcessed = 'Pending'; 
      resolve({ ...competitionsStore[competitionIndex] });
    }, MOCK_API_DELAY);
  });
};

export const updatePaymentStatus = (
  competitionId: string, 
  paymentStatus: PaymentStatus | undefined
): Promise<Competition> => {
   return new Promise((resolve, reject) => {
    setTimeout(() => {
      const competitionIndex = competitionsStore.findIndex(c => c.id === competitionId);
      if (competitionIndex === -1) {
        return reject(new Error('Competition not found.'));
      }
      if (!competitionsStore[competitionIndex].winner) {
        return reject(new Error('Cannot update payment status before a winner is declared.'));
      }
      competitionsStore[competitionIndex].paymentProcessed = paymentStatus;
      resolve({ ...competitionsStore[competitionIndex] });
    }, MOCK_API_DELAY);
  });
};