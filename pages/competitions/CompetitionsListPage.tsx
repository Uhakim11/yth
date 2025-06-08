

import React, { useState, useMemo, useEffect } from 'react';
import { useCompetition } from '../../hooks/useCompetition';
import CompetitionCard from '../../components/competitions/CompetitionCard';
import TalentCardSkeleton from '../../components/shared/TalentCardSkeleton'; 
import Button from '../../components/shared/Button';
import { CompetitionStatus, CompetitionCategory } from '../../types'; 
import { COMPETITION_CATEGORIES } from '../../constants'; 
import { Trophy, Filter, X, ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react'; // Added SearchIcon
import Input from '../../components/shared/Input'; 

const ITEMS_PER_PAGE = 9;

const CompetitionsListPage: React.FC = () => {
  const { competitions, loading, error, fetchCompetitions } = useCompetition();
  const [filterStatus, setFilterStatus] = useState<CompetitionStatus | ''>('');
  const [filterCategory, setFilterCategory] = useState<CompetitionCategory | ''>(''); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCompetitions(); 
  }, [fetchCompetitions]);

  const filteredCompetitions = useMemo(() => {
    return competitions
      .filter(comp => filterStatus ? comp.status === filterStatus : true)
      .filter(comp => filterCategory ? comp.category === filterCategory : true) 
      .filter(comp => 
        comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comp.category && comp.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [competitions, filterStatus, filterCategory, searchTerm]);

  const totalPages = Math.ceil(filteredCompetitions.length / ITEMS_PER_PAGE);
  const paginatedCompetitions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompetitions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCompetitions, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setFilterStatus('');
    setFilterCategory('');
    setSearchTerm('');
    setCurrentPage(1);
  }
  
  const competitionStatuses: CompetitionStatus[] = ['upcoming', 'open', 'judging', 'closed', 'archived'];

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md mx-auto max-w-lg mt-10">
        <h2 className="text-2xl font-semibold mb-2">Error Loading Competitions</h2>
        <p>{error}</p>
        <Button onClick={fetchCompetitions} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <header className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center space-x-3">
          <Trophy size={40} className="text-amber-500" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Competitions</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Discover challenges, showcase your skills, and win exciting prizes!</p>
          </div>
        </div>
      </header>

      <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="ghost" 
            className="w-full md:hidden mb-4 text-primary-600 dark:text-primary-400"
            leftIcon={<Filter size={18}/>}
        >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4`}>
            <Input
                label="Search Competitions"
                id="search-competitions"
                type="text"
                placeholder="Title, description, category..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
                leftIcon={<SearchIcon className="h-5 w-5 text-gray-400"/>} 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Filter by Status
                    </label>
                    <select
                        id="filter-status"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value as CompetitionStatus | ''); setCurrentPage(1);}}
                    >
                        <option value="">All Statuses</option>
                        {competitionStatuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Filter by Category
                    </label>
                    <select
                        id="filter-category"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                        value={filterCategory}
                        onChange={(e) => { setFilterCategory(e.target.value as CompetitionCategory | ''); setCurrentPage(1);}}
                    >
                        <option value="">All Categories</option>
                        {COMPETITION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            {(filterStatus || filterCategory || searchTerm) && (
                <Button onClick={resetFilters} variant="secondary" size="sm" leftIcon={<X size={18}/>} className="mt-2">
                    Reset Filters
                </Button>
            )}
        </div>
      </div>

      {loading && paginatedCompetitions.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(ITEMS_PER_PAGE > competitions.length && competitions.length > 0 ? competitions.length : ITEMS_PER_PAGE )].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && paginatedCompetitions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Trophy size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400">
                {competitions.length === 0 ? "No competitions available at the moment. Check back soon!" : "No competitions match your current filters."}
            </p>
            {competitions.length > 0 && (searchTerm || filterCategory || filterStatus) && (
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Try adjusting your search or <Button variant="ghost" onClick={resetFilters} className="hover:underline">reset filters</Button>.
                </p>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {paginatedCompetitions.map(comp => (
            <CompetitionCard key={comp.id} competition={comp} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            leftIcon={<ChevronLeft size={18}/>}
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
            rightIcon={<ChevronRight size={18}/>}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompetitionsListPage;