import React, { useState, useMemo, useEffect } from 'react';
import { useCompetition } from '../../../hooks/useCompetition';
import { useAlert } from '../../../hooks/useAlert';
import CompetitionCard from '../../competitions/CompetitionCard';
import CompetitionForm from '../../competitions/CompetitionForm';
import TalentCardSkeleton from '../../shared/TalentCardSkeleton'; 
import Button from '../../shared/Button';
import Modal from '../../shared/Modal';
import RatingInput from '../../shared/RatingInput'; // New
import StarRating from '../../shared/StarRating'; // Import StarRating
import PortfolioItemCard from '../../talent/PortfolioItemCard'; // To preview portfolio items
import { useTalent } from '../../../hooks/useTalent'; // To fetch talent portfolio for preview
import { Competition, CompetitionSubmission, CompetitionStatus, PaymentStatus, CompetitionCategory, PortfolioItem, CompetitionTask } from '../../../types'; // Added CompetitionTask
import { COMPETITION_CATEGORIES } from '../../../constants';
import { Trophy, PlusCircle, Search, ChevronLeft, ChevronRight, ListChecks, Award, Edit3, Trash2, MessageSquare, Star as StarIcon, ListOrdered, FileText, Link2 } from 'lucide-react'; // Added icons for tasks
import Input from '../../shared/Input';

const ITEMS_PER_PAGE = 6;

const TaskTypeIconDisplay: React.FC<{type: CompetitionTask['type']}> = ({ type }) => {
  switch(type) {
    case 'text_response': return <FileText size={16} className="mr-1.5 text-blue-500 flex-shrink-0" />;
    case 'file_upload_mock': return <FileText size={16} className="mr-1.5 text-purple-500 flex-shrink-0" />;
    case 'external_link': return <Link2 size={16} className="mr-1.5 text-green-500 flex-shrink-0" />;
    default: return <ListOrdered size={16} className="mr-1.5 text-gray-500 flex-shrink-0" />;
  }
}

const ManageCompetitionsSection: React.FC = () => {
  const { 
    competitions, loading, error, fetchCompetitions, 
    addCompetition, updateCompetition, deleteCompetition, 
    markWinner, updatePaymentStatus, rateSubmission
  } = useCompetition();
  const { getTalentById } = useTalent(); // To fetch talent details for portfolio preview
  const { addAlert } = useAlert();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CompetitionStatus | ''>('');
  const [filterAdminCategory, setFilterAdminCategory] = useState<CompetitionCategory | ''>('');
  const [currentPage, setCurrentPage] = useState(1);

  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const [currentCompetitionForModal, setCurrentCompetitionForModal] = useState<Competition | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<CompetitionSubmission | null>(null);
  const [isDeclaringWinner, setIsDeclaringWinner] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  // For rating submissions
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmissionId, setRatingSubmissionId] = useState<string | null>(null);
  const [isLoadingTalentPortfolio, setIsLoadingTalentPortfolio] = useState(false);
  const [portfolioItemForPreview, setPortfolioItemForPreview] = useState<PortfolioItem | null>(null);


  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const sortedCompetitions = useMemo(() => {
    return [...competitions].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [competitions]);
  
  const filteredCompetitions = useMemo(() => {
    return sortedCompetitions
      .filter(comp => filterStatus ? comp.status === filterStatus : true)
      .filter(comp => filterAdminCategory ? comp.category === filterAdminCategory : true)
      .filter(comp => 
        comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comp.category && comp.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [sortedCompetitions, filterStatus, filterAdminCategory, searchTerm]);

  const totalPages = Math.ceil(filteredCompetitions.length / ITEMS_PER_PAGE);
  const paginatedCompetitions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompetitions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCompetitions, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleOpenFormModal = (competition?: Competition) => {
    setEditingCompetition(competition || null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingCompetition(null);
  };

  const handleFormSubmit = async (data: Omit<Competition, 'id' | 'submissions' | 'status'> | Competition) => {
    setIsSubmittingForm(true);
    let success = false;
    let resultComp: Competition | null = null;
    if (editingCompetition && 'id' in data) {
      resultComp = await updateCompetition(data as Competition);
    } else {
      resultComp = await addCompetition(data as Omit<Competition, 'id' | 'submissions' | 'status'>);
    }
    
    if (resultComp) {
      success = true;
      if (currentCompetitionForModal && currentCompetitionForModal.id === resultComp.id) {
        setCurrentCompetitionForModal(resultComp);
      }
    }
    
    if (success) {
      addAlert(`Competition ${editingCompetition ? 'updated' : 'created'} successfully!`, 'success');
      handleCloseFormModal();
    } else {
      addAlert(`Failed to ${editingCompetition ? 'update' : 'create'} competition.`, 'error');
    }
    setIsSubmittingForm(false);
  };

  const handleDeleteCompetition = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete competition: "${title}"?`)) {
      const success = await deleteCompetition(id);
      if (success) addAlert('Competition deleted successfully!', 'success');
      else addAlert('Failed to delete competition.', 'error');
    }
  };

  const openSubmissionsViewer = async (competition: Competition) => {
    setCurrentCompetitionForModal(competition);
    setSelectedWinner(null); 
    setSubmissionsModalOpen(true);
  };

  const handleViewPortfolioItem = async (talentId: string, portfolioItemId: string) => {
    setIsLoadingTalentPortfolio(true);
    setPortfolioItemForPreview(null);
    const talentProfile = await getTalentById(talentId);
    if (talentProfile && talentProfile.portfolio) {
      const item = talentProfile.portfolio.find(p => p.id === portfolioItemId);
      setPortfolioItemForPreview(item || null);
    }
    setIsLoadingTalentPortfolio(false);
  };
  
  const handleDeclareWinner = async () => {
    if (!currentCompetitionForModal || !selectedWinner) return;
    setIsDeclaringWinner(true);
    const updatedComp = await markWinner(currentCompetitionForModal.id, selectedWinner.talentId, selectedWinner.talentName, selectedWinner.submissionId);
    if (updatedComp) {
      addAlert(`Winner declared: ${selectedWinner.talentName}!`, 'success');
      setCurrentCompetitionForModal(updatedComp); 
      setSubmissionsModalOpen(false); 
    } else {
      addAlert('Failed to declare winner.', 'error');
    }
    setIsDeclaringWinner(false);
  };
  
  const handlePaymentUpdate = async (competitionId: string, status: PaymentStatus) => {
    setIsUpdatingPayment(true);
    const updatedComp = await updatePaymentStatus(competitionId, status);
     if (updatedComp) {
      addAlert(`Payment status for "${updatedComp.title}" updated to ${status}.`, 'success');
       if(currentCompetitionForModal?.id === competitionId) {
           setCurrentCompetitionForModal(updatedComp); 
       }
       fetchCompetitions(); 
    } else {
      addAlert('Failed to update payment status.', 'error');
    }
    setIsUpdatingPayment(false);
  };

  const handleSaveRating = async (submissionId: string) => {
    if (!currentCompetitionForModal || !submissionId || currentRating === 0) {
      addAlert("Please select a rating score.", "warning");
      return;
    }
    const updatedSub = await rateSubmission(currentCompetitionForModal.id, submissionId, currentRating, ratingComment);
    if (updatedSub) {
      addAlert("Rating saved successfully!", "success");
      // Update the submission in the modal
      setCurrentCompetitionForModal(prevComp => {
        if (!prevComp) return null;
        return {
          ...prevComp,
          submissions: prevComp.submissions.map(sub => sub.submissionId === submissionId ? updatedSub : sub)
        };
      });
      setRatingSubmissionId(null); // Close rating input for this item
      setCurrentRating(0);
      setRatingComment('');
    } else {
      addAlert("Failed to save rating.", "error");
    }
  };

  if (error) return <p className="text-red-500 p-4">Error loading competitions: {error}</p>;

  const competitionStatuses: CompetitionStatus[] = ['upcoming', 'open', 'judging', 'closed', 'archived'];
  const paymentStatusOptions: PaymentStatus[] = ['Pending', 'Processed', 'Not Applicable'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
          <Trophy size={28} className="mr-3 text-amber-500" /> Manage Competitions
        </h2>
        <Button onClick={() => handleOpenFormModal()} leftIcon={<PlusCircle size={18}/>} className="bg-primary-500 hover:bg-primary-600">
          Create Competition
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
            id="search-competitions-admin"
            type="text"
            placeholder="Search by title, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} className="text-gray-400"/>}
        />
        <select
            id="filter-status-admin"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value as CompetitionStatus | ''); setCurrentPage(1);}}
        >
            <option value="">All Statuses</option>
            {competitionStatuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <select
            id="filter-category-admin"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
            value={filterAdminCategory}
            onChange={(e) => { setFilterAdminCategory(e.target.value as CompetitionCategory | ''); setCurrentPage(1);}}
        >
            <option value="">All Categories</option>
            {COMPETITION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>


      {loading && paginatedCompetitions.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <TalentCardSkeleton key={i} />)}
        </div>
      ) : !loading && paginatedCompetitions.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <Trophy size={48} className="mx-auto mb-4 opacity-50"/>
          No competitions found{searchTerm || filterStatus || filterAdminCategory ? ' matching your criteria.' : '.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompetitions.map(comp => (
            <div key={comp.id} className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <CompetitionCard 
                competition={comp} 
              />
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 space-y-2">
                 <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenFormModal(comp)} 
                    leftIcon={<Edit3 size={16}/>}
                  >
                    Edit Details
                  </Button>
                {comp.submissions.length > 0 && comp.status !== 'upcoming' && (
                  <Button 
                    variant="info_outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => openSubmissionsViewer(comp)} 
                    leftIcon={<ListChecks size={16}/>}
                  >
                    View Submissions ({comp.submissions.length})
                  </Button>
                )}
                {comp.winner && (
                   <div className="text-xs p-2 bg-green-50 dark:bg-green-700/20 rounded-md">
                     <p className="font-semibold text-green-700 dark:text-green-300">Winner: {comp.winner.talentName}</p>
                     <label htmlFor={`payment-${comp.id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">Payment:</label>
                      <select
                        id={`payment-${comp.id}`}
                        value={comp.paymentProcessed || 'Pending'}
                        onChange={(e) => handlePaymentUpdate(comp.id, e.target.value as PaymentStatus)}
                        disabled={isUpdatingPayment && currentCompetitionForModal?.id === comp.id}
                        className="mt-0.5 block w-full pl-2 pr-7 py-1 text-xs border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                      >
                        {paymentStatusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                   </div>
                )}
                 <Button 
                    variant="danger_outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => handleDeleteCompetition(comp.id, comp.title)} 
                    leftIcon={<Trash2 size={16}/>}
                  >
                    Delete Competition
                  </Button>
              </div>
            </div>
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
          title={editingCompetition ? 'Edit Competition' : 'Create New Competition'}
          size="lg"
        >
          <CompetitionForm 
            initialCompetition={editingCompetition}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseFormModal}
            isSubmitting={isSubmittingForm}
          />
        </Modal>
      )}

      {submissionsModalOpen && currentCompetitionForModal && (
        <Modal 
            isOpen={submissionsModalOpen} 
            onClose={() => {setSubmissionsModalOpen(false); setPortfolioItemForPreview(null);}} 
            title={`Submissions for "${currentCompetitionForModal.title}"`} 
            size="xl"
        >
            {currentCompetitionForModal.tasks && currentCompetitionForModal.tasks.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-700">
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                  <ListOrdered size={20} className="mr-2 text-blue-600 dark:text-blue-400"/>
                  Competition Tasks for Reference:
                </h4>
                <ul className="space-y-1.5 list-inside text-sm text-gray-600 dark:text-gray-300">
                  {currentCompetitionForModal.tasks.map(task => (
                    <li key={task.id} className="flex items-start">
                      <TaskTypeIconDisplay type={task.type} />
                      <span><strong>{task.title}:</strong> {task.description} {task.points ? `(${task.points} pts)` : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {currentCompetitionForModal.submissions.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No submissions received yet.</p>
            ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {currentCompetitionForModal.submissions.map(sub => (
                    <div key={sub.submissionId} className={`p-3 border rounded-lg ${selectedWinner?.submissionId === sub.submissionId ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-500' : 'dark:border-gray-600'}`}>
                    <p className="font-semibold text-gray-800 dark:text-white">{sub.talentName} <span className="text-xs text-gray-500 dark:text-gray-400">(ID: {sub.talentId})</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Submitted: {new Date(sub.submissionDate).toLocaleString()}</p>
                    
                    {sub.submissionType === 'portfolio' && sub.portfolioItemId ? (
                        <>
                            <p className="text-sm text-gray-600 dark:text-gray-300 my-1">Submission Type: Portfolio Item</p>
                            <Button size="sm" variant="info_outline" onClick={() => handleViewPortfolioItem(sub.talentId, sub.portfolioItemId!)} className="my-1">
                                {isLoadingTalentPortfolio && portfolioItemForPreview?.id !== sub.portfolioItemId ? "Loading Preview..." : "View Submitted Work"}
                            </Button>
                            {portfolioItemForPreview && portfolioItemForPreview.talentId === sub.talentId && portfolioItemForPreview.id === sub.portfolioItemId && (
                                <div className="my-2 p-2 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700/30 max-w-md">
                                    <PortfolioItemCard item={portfolioItemForPreview} />
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap my-1 text-ellipsis overflow-hidden max-h-24">{sub.submissionContent}</p>
                    )}
                    
                    {/* Rating Section */}
                    <div className="mt-2 pt-2 border-t dark:border-gray-700/50">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Judge's Rating:</p>
                        {(sub.ratings && sub.ratings.length > 0) ? (
                            sub.ratings.map(r => (
                                <div key={r.judgeId} className="text-xs text-gray-500 dark:text-gray-400">
                                    <StarRating rating={r.score} size={14} />
                                    {r.comment && <p className="italic mt-0.5">"{r.comment}"</p>}
                                </div>
                            ))
                        ) : <p className="text-xs text-gray-400 dark:text-gray-500 italic">Not rated yet.</p>}

                        {ratingSubmissionId === sub.submissionId ? (
                            <div className="mt-2 space-y-1">
                                <RatingInput currentRating={currentRating} onRatingChange={setCurrentRating} />
                                <textarea 
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    placeholder="Optional comment..."
                                    rows={2}
                                    className="w-full text-xs p-1 border dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                />
                                <Button size="sm" onClick={() => handleSaveRating(sub.submissionId)} leftIcon={<StarIcon size={14}/>}>Save Rating</Button>
                                <Button size="sm" variant="ghost" onClick={() => setRatingSubmissionId(null)}>Cancel</Button>
                            </div>
                        ) : (
                            <Button size="sm" variant="outline" onClick={() => {setRatingSubmissionId(sub.submissionId); setCurrentRating(sub.ratings?.find(r=>r.judgeId === 'admin1')?.score || 0); setRatingComment(sub.ratings?.find(r=>r.judgeId === 'admin1')?.comment || '')}} className="mt-1" leftIcon={<MessageSquare size={14}/>}>
                                {sub.ratings && sub.ratings.length > 0 ? "Edit Rating" : "Rate Submission"}
                            </Button>
                        )}
                    </div>


                    {!currentCompetitionForModal.winner && (currentCompetitionForModal.status === 'judging' || currentCompetitionForModal.status === 'closed') && (
                        <Button 
                        variant={selectedWinner?.submissionId === sub.submissionId ? "success" : "outline"} 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => setSelectedWinner(sub)}
                        leftIcon={selectedWinner?.submissionId === sub.submissionId ? <Award size={16}/> : <Award size={16}/> }
                        >
                        {selectedWinner?.submissionId === sub.submissionId ? 'Selected as Winner' : 'Select as Winner'}
                        </Button>
                    )}
                    {currentCompetitionForModal.winner?.submissionId === sub.submissionId && (
                        <p className="mt-1 text-sm font-semibold text-green-600 dark:text-green-400 flex items-center"><Award size={16} className="mr-1"/>Declared Winner</p>
                    )}
                    </div>
                ))}
                </div>
            )}
            {selectedWinner && !currentCompetitionForModal.winner && (
                <div className="mt-4 pt-3 border-t dark:border-gray-600">
                <p className="mb-2 text-gray-700 dark:text-gray-200">You have selected <strong>{selectedWinner.talentName}</strong> as the winner.</p>
                <Button variant="success" onClick={handleDeclareWinner} isLoading={isDeclaringWinner} leftIcon={<Award size={18}/>}>
                    {isDeclaringWinner ? 'Declaring...' : 'Confirm & Declare Winner'}
                </Button>
                </div>
            )}
            {currentCompetitionForModal.winner && (
                 <div className="mt-4 pt-3 border-t dark:border-gray-600">
                    <p className="text-green-600 dark:text-green-400 font-semibold">Winner: {currentCompetitionForModal.winner.talentName}</p>
                    <label htmlFor={`modal-payment-${currentCompetitionForModal.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">Payment Status:</label>
                    <select
                        id={`modal-payment-${currentCompetitionForModal.id}`}
                        value={currentCompetitionForModal.paymentProcessed || 'Pending'}
                        onChange={(e) => handlePaymentUpdate(currentCompetitionForModal.id, e.target.value as PaymentStatus)}
                        disabled={isUpdatingPayment}
                        className="mt-0.5 block w-full md:w-1/2 pl-2 pr-7 py-1.5 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                    >
                        {paymentStatusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            )}
        </Modal>
      )}
    </div>
  );
};

export default ManageCompetitionsSection;