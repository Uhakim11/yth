

import React, { useState, useMemo, useEffect } from 'react';
import { useWorkshop } from '../../hooks/useWorkshop';
import WorkshopCard from '../../components/workshops/WorkshopCard';
import TalentCardSkeleton from '../../components/shared/TalentCardSkeleton'; 
import Button from '../../components/shared/Button';
import { Workshop } from '../../types';
import { CalendarDays, Filter, X, ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react'; // Added SearchIcon
import Input from '../../components/shared/Input'; 

const ITEMS_PER_PAGE = 9;

const WorkshopsListPage: React.FC = () => {
  const { workshops, loading, error, fetchWorkshops } = useWorkshop();
  const [filterTime, setFilterTime] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const filteredWorkshops = useMemo(() => {
    const now = new Date();
    return workshops
      .filter(ws => {
        if (filterTime === 'upcoming') return new Date(ws.dateTime) >= now;
        if (filterTime === 'past') return new Date(ws.dateTime) < now;
        return true;
      })
      .filter(ws => 
        ws.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ws.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ws.category && ws.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ws.facilitator && ws.facilitator.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()); 
  }, [workshops, filterTime, searchTerm]);

  const totalPages = Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE);
  const paginatedWorkshops = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorkshops.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWorkshops, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setFilterTime('all');
    setSearchTerm('');
    setCurrentPage(1);
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md mx-auto max-w-lg mt-10">
        <h2 className="text-2xl font-semibold mb-2">Error Loading Workshops</h2>
        <p>{error}</p>
        <Button onClick={fetchWorkshops} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <header className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center space-x-3">
          <CalendarDays size={40} className="text-teal-500" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Workshops & Events</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Learn new skills, connect with experts, and grow your talent.</p>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="ghost" 
            className="w-full md:hidden mb-4 text-blue-600 dark:text-blue-400"
            leftIcon={<Filter size={18}/>}
        >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4`}>
            <Input
                label="Search Workshops"
                id="search-workshops"
                type="text"
                placeholder="Title, category, facilitator..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
                leftIcon={<SearchIcon className="h-5 w-5 text-gray-400"/>}
            />
            <div>
                <label htmlFor="filter-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Filter by Time
                </label>
                <select
                    id="filter-time"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    value={filterTime}
                    onChange={(e) => { setFilterTime(e.target.value as 'all' | 'upcoming' | 'past'); setCurrentPage(1);}}
                >
                    <option value="all">All Workshops</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                </select>
            </div>
            {(filterTime !== 'all' || searchTerm) && (
                <Button onClick={resetFilters} variant="secondary" size="sm" leftIcon={<X size={18}/>} className="mt-2">
                    Reset Filters
                </Button>
            )}
        </div>
      </div>

      {loading && paginatedWorkshops.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && paginatedWorkshops.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <CalendarDays size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400">
                {workshops.length === 0 ? "No workshops scheduled yet. Stay tuned!" : "No workshops match your current filters."}
            </p>
             {workshops.length > 0 && (searchTerm || filterTime !== 'all') && (
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Try broadening your search or <Button variant="ghost" onClick={resetFilters} className="hover:underline">reset filters</Button>.
                </p>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {paginatedWorkshops.map(ws => (
            <WorkshopCard key={ws.id} workshop={ws} />
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
            leftIcon={<ChevronLeft size={18} />}
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
            rightIcon={<ChevronRight size={18} />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkshopsListPage;