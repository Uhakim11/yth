

import React, { useState, useMemo, useEffect } from 'react';
import { useResource } from '../../hooks/useResource';
import ResourceCard from '../../components/resources/ResourceCard';
import TalentCardSkeleton from '../../components/shared/TalentCardSkeleton'; 
import Button from '../../components/shared/Button';
import { Resource, ResourceCategory } from '../../types';
import { BookOpen, Filter, X, ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react'; // Added SearchIcon
import Input from '../../components/shared/Input';
import { RESOURCE_CATEGORIES_LIST } from '../../constants';

const ITEMS_PER_PAGE = 10;

const ResourcesPage: React.FC = () => {
  const { resources, loading, error, fetchResources } = useResource();
  const [filterCategory, setFilterCategory] = useState<ResourceCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = useMemo(() => {
    return resources
      .filter(res => filterCategory ? res.category === filterCategory : true)
      .filter(res => 
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (res.tags && res.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
  }, [resources, filterCategory, searchTerm]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const resetFilters = () => {
    setFilterCategory('');
    setSearchTerm('');
    setCurrentPage(1);
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md mx-auto max-w-lg mt-10">
        <h2 className="text-2xl font-semibold mb-2">Error Loading Resources</h2>
        <p>{error}</p>
        <Button onClick={fetchResources} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <header className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center space-x-3">
          <BookOpen size={40} className="text-indigo-500" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Resource Hub</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Find tools, articles, and guides to help you grow your talent.</p>
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
                label="Search Resources"
                id="search-resources"
                type="text"
                placeholder="Title, keyword, tag..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
                leftIcon={<SearchIcon className="h-5 w-5 text-gray-400"/>}
            />
            <div>
                <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Filter by Category
                </label>
                <select
                    id="filter-category"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    value={filterCategory}
                    onChange={(e) => { setFilterCategory(e.target.value as ResourceCategory | ''); setCurrentPage(1);}}
                >
                    <option value="">All Categories</option>
                    {RESOURCE_CATEGORIES_LIST.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
             {(filterCategory || searchTerm) && (
                <Button onClick={resetFilters} variant="secondary" size="sm" leftIcon={<X size={18}/>} className="mt-2">
                    Reset Filters
                </Button>
            )}
        </div>
      </div>

      {loading && paginatedResources.length === 0 ? (
        <div className="space-y-4">
          {[...Array(ITEMS_PER_PAGE / 2)].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && paginatedResources.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <BookOpen size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400">
                {resources.length === 0 ? "No resources have been added yet. We're working on it!" : "No resources match your current filters."}
            </p>
            {resources.length > 0 && (searchTerm || filterCategory) && (
                 <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Try different keywords or <Button variant="ghost" onClick={resetFilters} className="hover:underline">reset filters</Button>.
                </p>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {paginatedResources.map(res => (
            <ResourceCard key={res.id} resource={res} />
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

export default ResourcesPage;