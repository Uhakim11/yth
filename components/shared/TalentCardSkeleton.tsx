import React from 'react';

const TalentCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6 mb-4"></div>
        
        <div className="mb-4">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <div className="h-10 bg-blue-300 dark:bg-blue-700 rounded-lg flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default TalentCardSkeleton;