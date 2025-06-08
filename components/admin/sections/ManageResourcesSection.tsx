import React, { useState, useMemo, useEffect } from 'react';
import { useResource } from '../../../hooks/useResource';
import { useAlert } from '../../../hooks/useAlert';
import ResourceCard from '../../resources/ResourceCard';
import ResourceForm from '../../resources/ResourceForm';
import TalentCardSkeleton from '../../shared/TalentCardSkeleton'; // Re-use for loading state
import Button from '../../shared/Button';
import Modal from '../../shared/Modal';
import { Resource, ResourceCategory } from '../../../types';
import { BookOpen, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Input from '../../shared/Input';
import { RESOURCE_CATEGORIES_LIST } from '../../../constants';


const ITEMS_PER_PAGE = 6;

const ManageResourcesSection: React.FC = () => {
  const { resources, loading, error, fetchResources, addResource, updateResource, deleteResource } = useResource();
  const { addAlert } = useAlert();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ResourceCategory | ''>('');
  const [currentPage, setCurrentPage] = useState(1);

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
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleOpenFormModal = (resource?: Resource) => {
    setEditingResource(resource || null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingResource(null);
  };

  const handleFormSubmit = async (data: Omit<Resource, 'id' | 'createdAt' | 'addedByAdminId'> | Resource) => {
    setIsSubmittingForm(true);
    let success = false;
    if (editingResource && 'id' in data) {
      const result = await updateResource(data as Resource);
      if (result) success = true;
    } else {
      const result = await addResource(data as Omit<Resource, 'id' | 'createdAt' | 'addedByAdminId'>);
      if (result) success = true;
    }
    
    if (success) {
      addAlert(`Resource ${editingResource ? 'updated' : 'created'} successfully!`, 'success');
      handleCloseFormModal();
    } else {
      addAlert(`Failed to ${editingResource ? 'update' : 'create'} resource.`, 'error');
    }
    setIsSubmittingForm(false);
  };

  const handleDeleteResource = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete resource: "${title}"?`)) {
      const success = await deleteResource(id);
      if (success) addAlert('Resource deleted successfully!', 'success');
      else addAlert('Failed to delete resource.', 'error');
    }
  };

  if (error) return <p className="text-red-500 p-4">Error loading resources: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
          <BookOpen size={28} className="mr-3 text-indigo-500" /> Manage Resources
        </h2>
        <Button onClick={() => handleOpenFormModal()} leftIcon={<PlusCircle size={18}/>} className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500">
          Create Resource
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
            id="search-resources-admin"
            type="text"
            placeholder="Search by title, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} className="text-gray-400"/>}
        />
        <select
            id="filter-category-admin"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value as ResourceCategory | ''); setCurrentPage(1);}}
        >
            <option value="">All Categories</option>
            {RESOURCE_CATEGORIES_LIST.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {loading && paginatedResources.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && paginatedResources.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50"/>
          No resources found{searchTerm || filterCategory ? ' matching your criteria.' : '.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedResources.map(res => (
            <ResourceCard 
                key={res.id} 
                resource={res} 
                showAdminControls={true}
                onEdit={() => handleOpenFormModal(res)}
                onDelete={() => handleDeleteResource(res.id, res.title)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="secondary" leftIcon={<ChevronLeft size={18}/>}>Prev</Button>
          <span className="text-gray-700 dark:text-gray-300 px-2">Page {currentPage} of {totalPages}</span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary" rightIcon={<ChevronRight size={18}/>}>Next</Button>
        </div>
      )}

      {isFormModalOpen && (
        <Modal 
          isOpen={isFormModalOpen} 
          onClose={handleCloseFormModal} 
          title={editingResource ? 'Edit Resource' : 'Create New Resource'}
          size="lg"
        >
          <ResourceForm 
            initialResource={editingResource}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseFormModal}
            isSubmitting={isSubmittingForm}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageResourcesSection;
