
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import TalentForm from '../talent/TalentForm';
import PortfolioItemForm from '../talent/PortfolioItemForm';
import PortfolioItemCard from '../talent/PortfolioItemCard';
import { Talent, PortfolioItem } from '../../types';
import { useTalent } from '../../hooks/useTalent'; // To manage portfolio items
import { useAlert } from '../../hooks/useAlert';
import { PlusCircle, Briefcase, Edit3, Trash2 } from 'lucide-react';

interface TalentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  talent: Talent | null; // null for new talent
  onSubmit: (talentData: Omit<Talent, 'id' | 'userId' | 'portfolio'> | Talent) => Promise<void>;
  isSubmitting: boolean;
}

const TalentEditModal: React.FC<TalentEditModalProps> = ({
  isOpen,
  onClose,
  talent: initialTalent,
  onSubmit: onMainFormSubmit,
  isSubmitting: isMainFormSubmitting,
}) => {
  const { addPortfolioItem, updatePortfolioItem, deletePortfolioItem, getTalentById } = useTalent();
  const { addAlert } = useAlert();

  // Local state for the talent being edited, including its portfolio
  const [editableTalent, setEditableTalent] = useState<Talent | null>(initialTalent);
  
  // Portfolio form state
  const [showPortfolioItemForm, setShowPortfolioItemForm] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isPortfolioSubmitting, setIsPortfolioSubmitting] = useState(false);

  useEffect(() => {
    // When initialTalent changes (e.g., modal opens for a different talent),
    // reset editableTalent. If it's a new talent (initialTalent is null),
    // TalentForm will initialize with empty fields.
    setEditableTalent(initialTalent ? { ...initialTalent, portfolio: initialTalent.portfolio || [] } : null);
  }, [initialTalent]);

  // This function is passed to TalentForm for its submission.
  // It then calls the onMainFormSubmit passed from ManageTalentsSection.
  const handleTalentDetailsSubmit = async (talentDetails: Omit<Talent, 'id' | 'userId' | 'portfolio'> | Talent) => {
    // Merge with existing portfolio if editing
    const payload = editableTalent && 'id' in talentDetails
      ? { ...talentDetails, portfolio: editableTalent.portfolio || [] }
      : talentDetails;
    await onMainFormSubmit(payload);
    // If it was a new talent, after main submission, we might get an ID.
    // For simplicity, we assume onMainFormSubmit handles refreshing the talent list,
    // and the modal will be closed or re-opened with the updated/new talent.
    // If creating a new talent, and we want to add portfolio items immediately,
    // we'd need the new talent's ID from onMainFormSubmit's result.
    // For now, admin adds portfolio after talent is created/saved once.
  };

  const refreshEditableTalentPortfolio = async () => {
    if (editableTalent?.id) {
      const refreshedTalent = await getTalentById(editableTalent.id);
      if (refreshedTalent) {
        setEditableTalent({ ...refreshedTalent, portfolio: refreshedTalent.portfolio || [] });
      }
    }
  };

  const handlePortfolioItemFormSubmit = async (itemData: Omit<PortfolioItem, 'id' | 'talentId' | 'createdAt'> | PortfolioItem) => {
    if (!editableTalent?.id) {
      addAlert("Please save the main talent details first before adding portfolio items.", "warning");
      return;
    }
    setIsPortfolioSubmitting(true);
    let success = false;
    if ('id' in itemData) { // Editing existing portfolio item
      const result = await updatePortfolioItem(editableTalent.id, itemData as PortfolioItem);
      if (result) success = true;
    } else { // Adding new portfolio item
      const result = await addPortfolioItem(editableTalent.id, itemData);
      if (result) success = true;
    }

    if (success) {
      addAlert(`Portfolio item ${'id' in itemData ? 'updated' : 'added'} successfully!`, 'success');
      await refreshEditableTalentPortfolio(); // Refresh to show the new/updated item
      setShowPortfolioItemForm(false);
      setEditingPortfolioItem(null);
    } else {
      addAlert(`Failed to ${'id' in itemData ? 'update' : 'add'} portfolio item.`, 'error');
    }
    setIsPortfolioSubmitting(false);
  };

  const handleEditPortfolioItem = (item: PortfolioItem) => {
    setEditingPortfolioItem(item);
    setShowPortfolioItemForm(true);
  };

  const handleDeletePortfolioItem = async (itemId: string) => {
    if (!editableTalent?.id || !window.confirm("Are you sure you want to delete this portfolio item?")) return;
    const success = await deletePortfolioItem(editableTalent.id, itemId);
    if (success) {
      addAlert('Portfolio item deleted.', 'success');
      await refreshEditableTalentPortfolio();
    } else {
      addAlert('Failed to delete portfolio item.', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTalent ? `Edit Talent: ${initialTalent.name}` : 'Add New Talent'}
      size="xl"
    >
      <div className="max-h-[80vh] overflow-y-auto p-1 space-y-6">
        {/* Talent Details Form */}
        <TalentForm
          initialTalent={editableTalent} // Pass the local state here
          onSubmit={handleTalentDetailsSubmit}
          onCancel={onClose} // TalentForm's cancel button closes the main modal
          isSubmitting={isMainFormSubmitting}
        />

        {/* Portfolio Management Section - Only show if editing an existing talent */}
        {editableTalent && editableTalent.id && (
          <section className="mt-6 pt-6 border-t dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <Briefcase size={22} className="mr-2 text-indigo-500" />
                Manage Portfolio
              </h3>
              <Button
                onClick={() => { setEditingPortfolioItem(null); setShowPortfolioItemForm(true); }}
                variant="info"
                size="sm"
                leftIcon={<PlusCircle size={16} />}
                disabled={isMainFormSubmitting}
              >
                Add Portfolio Item
              </Button>
            </div>

            {(editableTalent.portfolio && editableTalent.portfolio.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editableTalent.portfolio.map(item => (
                  <PortfolioItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => handleEditPortfolioItem(item)}
                    onDelete={() => handleDeletePortfolioItem(item.id)}
                    showControls={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 border-2 border-dashed dark:border-gray-600 rounded-md">
                This talent has no portfolio items yet.
              </p>
            )}
          </section>
        )}
         {!editableTalent?.id && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-center">
                Save the main talent details first to enable portfolio management.
            </p>
        )}
      </div>

      {/* Nested Modal for Portfolio Item Form */}
      {showPortfolioItemForm && editableTalent?.id && (
        <Modal
          isOpen={showPortfolioItemForm}
          onClose={() => { setShowPortfolioItemForm(false); setEditingPortfolioItem(null); }}
          title={editingPortfolioItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}
          size="lg" // Potentially smaller than the main talent edit modal
        >
          <PortfolioItemForm
            initialItem={editingPortfolioItem}
            onSubmit={handlePortfolioItemFormSubmit}
            onCancel={() => { setShowPortfolioItemForm(false); setEditingPortfolioItem(null); }}
            isSubmitting={isPortfolioSubmitting}
            talentPortfolio={editableTalent.portfolio || []}
          />
        </Modal>
      )}
    </Modal>
  );
};

export default TalentEditModal;
