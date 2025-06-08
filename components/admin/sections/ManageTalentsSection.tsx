
import React, { useState, useMemo, useEffect } from 'react';
import { useTalent } from '../../../hooks/useTalent';
import { useAlert } from '../../../hooks/useAlert';
import TalentCard from '../../talent/TalentCard';
import TalentCardSkeleton from '../../shared/TalentCardSkeleton';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Modal from '../../shared/Modal'; 
import TalentEditModal from '../TalentEditModal'; // New modal for add/edit
import { Talent } from '../../../types';
import { Users, Search, Trash2, ChevronLeft, ChevronRight, Info, PlusCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const ManageTalentsSection: React.FC = () => {
  const { talents, loading, error, deleteTalent, addTalent, updateTalent, fetchTalentsList } = useTalent(); // Added addTalent, updateTalent
  const { addAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [talentToDelete, setTalentToDelete] = useState<Talent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingTalent, setCurrentEditingTalent] = useState<Talent | null>(null);
  const [isSubmittingTalent, setIsSubmittingTalent] = useState(false);

  useEffect(() => {
    fetchTalentsList();
  }, [fetchTalentsList]);

  const filteredTalents = useMemo(() => {
    return talents.filter(talent =>
      talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [talents, searchTerm]);

  const totalPages = Math.ceil(filteredTalents.length / ITEMS_PER_PAGE);
  const paginatedTalents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTalents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTalents, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteInitiate = (talent: Talent) => {
    setTalentToDelete(talent);
  };

  const handleDeleteConfirm = async () => {
    if (!talentToDelete) return;
    const success = await deleteTalent(talentToDelete.id);
    if (success) {
      addAlert(`Talent profile for "${talentToDelete.name}" deleted successfully.`, 'success');
    } else {
      addAlert(`Failed to delete talent profile for "${talentToDelete.name}".`, 'error');
    }
    setTalentToDelete(null);
  };

  const handleOpenEditModal = (talent?: Talent | null) => {
    setCurrentEditingTalent(talent || null); // null for new talent
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setCurrentEditingTalent(null);
    setIsEditModalOpen(false);
  };

  const handleTalentFormSubmit = async (talentData: Omit<Talent, 'id' | 'userId' | 'portfolio'> | Talent) => {
    setIsSubmittingTalent(true);
    let success = false;
    if (currentEditingTalent && 'id' in talentData) { // Editing existing
      const result = await updateTalent(talentData as Talent);
      if(result) success = true;
    } else { // Adding new talent
      // For admin-created talents, let's make userId the same as talent.id for simplicity.
      // Or, ensure a unique ID is generated if the TalentForm doesn't provide one (which it shouldn't for userId).
      // The TalentContext's addTalent function should handle this.
      // The `talentData` from TalentForm won't have `id` or `userId`.
      // The `addTalent` context function needs `userId`.
      // Let's pass a placeholder or generate one. For this pass, we'll assume `addTalent` handles it.
      const newTalentId = `admin_talent_${Date.now()}`;
      const result = await addTalent({
        ...talentData,
        profileImageDataUrl: (talentData as any).profileImageDataUrl, // Ensure this is passed
      }, newTalentId + "_user"); // Pass a generated userId
      if(result) success = true;
    }

    if (success) {
      addAlert(`Talent profile ${currentEditingTalent ? 'updated' : 'created'} successfully.`, 'success');
      handleCloseEditModal();
    } else {
      addAlert(`Failed to ${currentEditingTalent ? 'update' : 'create'} talent profile.`, 'error');
    }
    setIsSubmittingTalent(false);
  };


  if (error) return <p className="text-red-500 p-4">Error loading talents: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
          <Users size={28} className="mr-3 text-blue-500" /> Manage Talents
        </h2>
        <Button onClick={() => handleOpenEditModal(null)} leftIcon={<PlusCircle size={18}/>} className="bg-green-600 hover:bg-green-700">
          Add New Talent
        </Button>
      </div>
      
      <Input
        id="search-talents-admin"
        type="text"
        placeholder="Search by name, category, user ID, skill..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leftIcon={<Search size={18} className="text-gray-400"/>}
      />

      {loading && paginatedTalents.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && paginatedTalents.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-50"/>
          No talents found{searchTerm ? ' matching your search.' : '.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTalents.map(talent => (
            <TalentCard 
              key={talent.id} 
              talent={talent} 
              showAdminControls={true}
              onEdit={() => handleOpenEditModal(talent)} 
              onDelete={() => handleDeleteInitiate(talent)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
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

      {talentToDelete && (
        <Modal
          isOpen={!!talentToDelete}
          onClose={() => setTalentToDelete(null)}
          title={`Confirm Deletion: ${talentToDelete.name}`}
        >
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the talent profile for <strong>{talentToDelete.name}</strong> (User ID: {talentToDelete.userId})? 
            This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setTalentToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm} leftIcon={<Trash2 size={18}/>}>
              Delete Talent Profile
            </Button>
          </div>
        </Modal>
      )}

      {isEditModalOpen && (
        <TalentEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          talent={currentEditingTalent}
          onSubmit={handleTalentFormSubmit}
          isSubmitting={isSubmittingTalent}
        />
      )}

       <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <Info size={18} className="inline mr-2"/> Admins can add, view, edit, and delete talent profiles.
        </div>
    </div>
  );
};

export default ManageTalentsSection;
