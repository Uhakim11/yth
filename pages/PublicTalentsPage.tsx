
import React, { useState, useEffect, useMemo } from 'react';
import { useTalent } from '../hooks/useTalent';
import TalentCard from '../components/talent/TalentCard';
import TalentCardSkeleton from '../components/shared/TalentCardSkeleton';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import { MOCK_TALENT_CATEGORIES } from '../constants';
import { UsersIcon, AdjustmentsHorizontalIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon as SearchIcon, XMarkIcon as X } from '@heroicons/react/24/outline';
import { LibraryBig } from 'lucide-react'; // Using Lucide for consistent empty state icon


const ITEMS_PER_PAGE = 9;

const PublicTalentsPage: React.FC = () => {
  const { talents, loading, error, fetchTalentsList } = useTalent();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTalentsList();
  }, [fetchTalentsList]);

  const filteredTalents = useMemo(() => {
    return talents
      .filter(talent => 
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(talent => filterCategory ? talent.category === filterCategory : true);
  }, [talents, searchTerm, filterCategory]);

  const totalPages = Math.ceil(filteredTalents.length / ITEMS_PER_PAGE);
  const paginatedTalents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTalents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTalents, currentPage]);

  const uniqueCategories = useMemo(() => Array.from(new Set(talents.map(t => t.category))).sort(), [talents]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setCurrentPage(1);
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md mx-auto max-w-lg mt-10">
        <h2 className="text-2xl font-semibold mb-2">Error Loading Talents</h2>
        <p>{error}</p>
        <Button onClick={() => fetchTalentsList()} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <header className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center space-x-3">
          <UsersIcon className="h-12 w-12 text-blue-500 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Explore Talents</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Discover amazing young individuals and their skills.</p>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="ghost" 
            className="w-full md:hidden mb-4 text-primary-600 dark:text-primary-400"
            leftIcon={<AdjustmentsHorizontalIcon className="h-5 w-5"/>}
        >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <Input
                    label="Search Talents"
                    id="search-talents"
                    type="text"
                    placeholder="Name, skill, keyword..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
                    className="md:col-span-2"
                    leftIcon={<SearchIcon className="h-5 w-5 text-gray-400"/>}
                />
                <div>
                    <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                    </label>
                    <select
                        id="filter-category"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        value={filterCategory}
                        onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1);}}
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        {MOCK_TALENT_CATEGORIES.filter(mc => !uniqueCategories.includes(mc)).map(cat => (
                            <option key={cat} value={cat} disabled className="text-gray-400">{cat} (No talents)</option>
                        ))}
                    </select>
                </div>
            </div>
            {(searchTerm || filterCategory) && (
                 <Button onClick={resetFilters} variant="secondary" size="sm" className="mt-4" leftIcon={<X className="h-4 w-4"/>}>Reset Filters</Button>
            )}
        </div>
      </div>

      {loading && paginatedTalents.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && paginatedTalents.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <LibraryBig size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400">
                {talents.length === 0 ? "No talents found on the platform yet." : "No talents match your current filters."}
            </p>
            {talents.length > 0 && (searchTerm || filterCategory) && (
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Try adjusting your search or <Button variant="ghost" onClick={resetFilters} className="hover:underline">reset filters</Button> to see all talents.
                </p>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {paginatedTalents.map(talent => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            leftIcon={<ChevronLeftIcon className="h-5 w-5" />}
          >
            Previous
          </Button>
          <span className="text-gray-700 dark:text-gray-300 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
            rightIcon={<ChevronRightIcon className="h-5 w-5" />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublicTalentsPage;
