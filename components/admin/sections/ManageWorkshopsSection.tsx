import React, { useState, useMemo, useEffect } from 'react';
import { useWorkshop } from '../../../hooks/useWorkshop';
import { useAlert } from '../../../hooks/useAlert';
import WorkshopCard from '../../workshops/WorkshopCard';
import WorkshopForm from '../../workshops/WorkshopForm';
import TalentCardSkeleton from '../../shared/TalentCardSkeleton'; // Re-use for loading state
import Button from '../../shared/Button';
import Modal from '../../shared/Modal';
import { Workshop } from '../../../types';
import { CalendarDays, PlusCircle, Search, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import Input from '../../shared/Input';

const ITEMS_PER_PAGE = 6;

const ManageWorkshopsSection: React.FC = () => {
  const { workshops, loading, error, fetchWorkshops, addWorkshop, updateWorkshop, deleteWorkshop } = useWorkshop();
  const { addAlert } = useAlert();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTime, setFilterTime] = useState<'all' | 'upcoming' | 'past'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [registrantsModalOpen, setRegistrantsModalOpen] = useState(false);
  const [currentWorkshopForModal, setCurrentWorkshopForModal] = useState<Workshop | null>(null);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const sortedWorkshops = useMemo(() => {
    return [...workshops].sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [workshops]);

  const filteredWorkshops = useMemo(() => {
    const now = new Date();
    return sortedWorkshops
      .filter(ws => {
        if (filterTime === 'upcoming') return new Date(ws.dateTime) >= now;
        if (filterTime === 'past') return new Date(ws.dateTime) < now;
        return true;
      })
      .filter(ws => 
        ws.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ws.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ws.category && ws.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [sortedWorkshops, filterTime, searchTerm]);

  const totalPages = Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE);
  const paginatedWorkshops = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorkshops.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWorkshops, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleOpenFormModal = (workshop?: Workshop) => {
    setEditingWorkshop(workshop || null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingWorkshop(null);
  };

  const handleFormSubmit = async (data: Omit<Workshop, 'id' | 'registeredTalents'> | Workshop) => {
    setIsSubmittingForm(true);
    let success = false;
    if (editingWorkshop && 'id' in data) {
      const result = await updateWorkshop(data as Workshop);
      if (result) success = true;
    } else {
      const result = await addWorkshop(data as Omit<Workshop, 'id' | 'registeredTalents'>);
      if (result) success = true;
    }
    
    if (success) {
      addAlert(`Workshop ${editingWorkshop ? 'updated' : 'created'} successfully!`, 'success');
      handleCloseFormModal();
    } else {
      addAlert(`Failed to ${editingWorkshop ? 'update' : 'create'} workshop.`, 'error');
    }
    setIsSubmittingForm(false);
  };

  const handleDeleteWorkshop = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete workshop: "${title}"?`)) {
      const success = await deleteWorkshop(id);
      if (success) addAlert('Workshop deleted successfully!', 'success');
      else addAlert('Failed to delete workshop.', 'error');
    }
  };

  const openRegistrantsViewer = (workshop: Workshop) => {
    setCurrentWorkshopForModal(workshop);
    setRegistrantsModalOpen(true);
  };


  if (error) return <p className="text-red-500 p-4">Error loading workshops: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
          <CalendarDays size={28} className="mr-3 text-teal-500" /> Manage Workshops
        </h2>
        <Button onClick={() => handleOpenFormModal()} leftIcon={<PlusCircle size={18}/>} className="bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-500">
          Create Workshop
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
            id="search-workshops-admin"
            type="text"
            placeholder="Search by title, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} className="text-gray-400"/>}
        />
        <select
            id="filter-time-admin"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={filterTime}
            onChange={(e) => { setFilterTime(e.target.value as 'all' | 'upcoming' | 'past'); setCurrentPage(1);}}
        >
            <option value="all">All Workshops</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
        </select>
      </div>

      {loading && paginatedWorkshops.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && paginatedWorkshops.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <CalendarDays size={48} className="mx-auto mb-4 opacity-50"/>
          No workshops found{searchTerm || filterTime !== 'all' ? ' matching your criteria.' : '.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedWorkshops.map(ws => (
            <WorkshopCard 
                key={ws.id} 
                workshop={ws} 
                showAdminControls={true}
                onEdit={() => handleOpenFormModal(ws)}
                onDelete={() => handleDeleteWorkshop(ws.id, ws.title)}
            />
            // Additional admin actions specific to this view can be added here or inside WorkshopCard via props
            // For example, a button to view registrants if not directly on the card:
            // {ws.registeredTalents.length > 0 && 
            //   <Button size="sm" onClick={() => openRegistrantsViewer(ws)} className="mt-1 w-full" leftIcon={<Users size={16}/>}>
            //       View Registrants ({ws.registeredTalents.length})
            //   </Button>}
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
          title={editingWorkshop ? 'Edit Workshop' : 'Create New Workshop'}
          size="lg"
        >
          <WorkshopForm 
            initialWorkshop={editingWorkshop}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseFormModal}
            isSubmitting={isSubmittingForm}
          />
        </Modal>
      )}

      {registrantsModalOpen && currentWorkshopForModal && (
         <Modal 
            isOpen={registrantsModalOpen} 
            onClose={() => setRegistrantsModalOpen(false)} 
            title={`Registrants for "${currentWorkshopForModal.title}"`} 
            size="md"
        >
            {currentWorkshopForModal.registeredTalents.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No talents registered for this workshop yet.</p>
            ) : (
                <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {currentWorkshopForModal.registeredTalents.map(reg => (
                    <li key={reg.talentId} className="p-2 border-b dark:border-gray-700">
                      <p className="font-medium text-gray-800 dark:text-white">{reg.talentName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">User ID: {reg.talentId}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Registered: {new Date(reg.registrationDate).toLocaleDateString()}</p>
                    </li>
                ))}
                </ul>
            )}
        </Modal>
      )}
    </div>
  );
};

export default ManageWorkshopsSection;
