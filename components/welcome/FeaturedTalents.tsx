import React from 'react';
import { Link } from 'react-router-dom';
import { Talent } from '../../types';
import TalentCard from '../talent/TalentCard';
import TalentCardSkeleton from '../shared/TalentCardSkeleton';
import Button from '../shared/Button';
import { UsersIcon, SparklesIcon } from '@heroicons/react/24/outline'; 
import { Award } from 'lucide-react'; // Correctly imported from lucide-react

interface FeaturedTalentsProps {
  talents: Talent[];
  loading: boolean;
  displayCount?: number;
}

const FeaturedTalents: React.FC<FeaturedTalentsProps> = ({ talents, loading, displayCount = 12 }) => {
  const talentsToDisplay = talents.slice(0, displayCount);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10 md:mb-12">
        <SparklesIcon className="h-12 w-12 text-yellow-500 dark:text-yellow-400 mx-auto mb-2" />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Showcased Talents
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Discover some of the brightest individuals on our platform, their skills, and achievements.
        </p>
      </div>

      {loading && talentsToDisplay.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(displayCount > 4 ? 4 : displayCount)].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && talentsToDisplay.length === 0 ? (
         <div className="text-center py-10">
            <UsersIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400">No talents to feature at the moment.</p>
            <p className="text-gray-500 dark:text-gray-400">Check back soon or explore all talents!</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {talentsToDisplay.map(talent => (
            <div key={talent.id} className="flex flex-col">
              <TalentCard talent={talent} />
              <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-b-xl mt-[-1px] flex-grow">
                {talent.achievements && talent.achievements.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center">
                      <Award className="h-4 w-4 mr-1.5 text-amber-500"/> Rewards & Achievements
                    </h4>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
                      {talent.achievements.slice(0,2).map((ach, i) => <li key={i} className="truncate" title={ach}>{ach}</li>)}
                      {talent.achievements.length > 2 && <li className="text-gray-400 dark:text-gray-500 italic">+{talent.achievements.length - 2} more</li>}
                    </ul>
                  </div>
                )}
                 {(!talent.achievements || talent.achievements.length === 0) && (
                     <div className="mb-3">
                         <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center">
                           <Award className="h-4 w-4 mr-1.5 text-gray-400"/> Rewards & Achievements
                         </h4>
                         <p className="text-xs text-gray-400 dark:text-gray-500 italic">No achievements listed yet.</p>
                     </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center mt-12">
        <Link to="/talents">
          <Button variant="primary" size="lg" rightIcon={<UsersIcon className="h-5 w-5"/>}>
            Explore All Talents
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedTalents;