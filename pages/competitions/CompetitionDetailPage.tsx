import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../hooks/useAlert';
import { Competition, CompetitionSubmission, Talent, PaymentStatus, CompetitionTask } from '../../types';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { ArrowLeft, Trophy, CalendarDays, Users, Send, Award, DollarSign, Edit3, Trash2, ListChecks, CheckCircle, Clock, Info, ListOrdered, FileText, Link2 } from 'lucide-react'; 
import { ROUTES, generatePath } from '../../constants';
import Markdown from 'react-markdown'; 

const TaskTypeIcon: React.FC<{type: CompetitionTask['type']}> = ({ type }) => {
  switch(type) {
    case 'text_response': return <FileText size={18} className="mr-2 text-blue-500" />;
    case 'file_upload_mock': return <FileText size={18} className="mr-2 text-purple-500" />; 
    case 'external_link': return <Link2 size={18} className="mr-2 text-green-500" />;
    default: return <ListOrdered size={18} className="mr-2 text-gray-500" />;
  }
}

const CompetitionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getCompetitionById, 
    submitToCompetition, 
    markWinner, 
    updatePaymentStatus, 
    deleteCompetition,
    loading, 
    error 
  } = useCompetition();
  const { user, isAdmin } = useAuth();
  const { addAlert } = useAlert();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<CompetitionSubmission | null>(null);
  const [isDeclaringWinner, setIsDeclaringWinner] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCompetition = async () => {
        const fetchedComp = await getCompetitionById(id);
        if (fetchedComp) {
          setCompetition(fetchedComp);
        } else {
          addAlert('Competition not found.', 'error');
          navigate(ROUTES.COMPETITIONS_LIST);
        }
      };
      fetchCompetition();
    }
  }, [id, getCompetitionById, addAlert, navigate]);

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competition || !submissionContent.trim() || !user) return;
    setIsSubmittingEntry(true);
    const result = await submitToCompetition(competition.id, 'text', submissionContent);
    if (result) {
      addAlert('Entry submitted successfully!', 'success');
      setSubmissionContent('');
      const updatedComp = await getCompetitionById(competition.id); 
      if (updatedComp) setCompetition(updatedComp);
    } else {
      addAlert(localStorage.getItem('competitionError') || 'Failed to submit entry. Please try again.', 'error');
      localStorage.removeItem('competitionError'); 
    }
    setIsSubmittingEntry(false);
  };

  const handleDeclareWinner = async () => {
    if (!competition || !selectedWinner || !isAdmin) return;
    setIsDeclaringWinner(true);
    const updatedComp = await markWinner(competition.id, selectedWinner.talentId, selectedWinner.talentName, selectedWinner.submissionId);
    if (updatedComp) {
      setCompetition(updatedComp);
      addAlert(`Winner declared: ${selectedWinner.talentName}!`, 'success');
      setShowSubmissionsModal(false);
      setSelectedWinner(null);
    } else {
      addAlert('Failed to declare winner.', 'error');
    }
    setIsDeclaringWinner(false);
  };
  
  const handlePaymentUpdate = async (status: PaymentStatus) => {
    if (!competition || !isAdmin || !competition.winner) return;
    setIsUpdatingPayment(true);
    const updatedComp = await updatePaymentStatus(competition.id, status);
     if (updatedComp) {
      setCompetition(updatedComp);
      addAlert(`Payment status updated to "${status}".`, 'success');
    } else {
      addAlert('Failed to update payment status.', 'error');
    }
    setIsUpdatingPayment(false);
  };

  const handleDeleteCompetition = async () => {
    if (!competition || !isAdmin) return;
    if (window.confirm(`Are you sure you want to delete the competition "${competition.title}"? This action cannot be undone.`)) {
      const success = await deleteCompetition(competition.id);
      if (success) {
        addAlert('Competition deleted successfully.', 'success');
        navigate(ROUTES.COMPETITIONS_LIST);
      } else {
        addAlert('Failed to delete competition.', 'error');
      }
    }
  };


  const userHasSubmitted = useMemo(() => {
    if (!user || !competition) return false;
    return competition.submissions.some(sub => sub.talentId === user.id);
  }, [user, competition]);
  
  const canSubmit = useMemo(() => {
    if (!user || !competition || competition.status !== 'open') return false;
    return !userHasSubmitted;
  }, [user, competition, userHasSubmitted]);


  if (loading && !competition) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
        <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">Loading Competition Details...</p>
      </div>
    );
  }

  if (error && !competition) {
    return <div className="p-8 text-center text-red-500 dark:text-red-400">{error}</div>;
  }
  if (!competition) {
    return <div className="p-8 text-center dark:text-gray-300">Competition not found or failed to load.</div>;
  }

  const paymentStatusOptions: PaymentStatus[] = ['Pending', 'Processed', 'Not Applicable'];
  const showTasks = competition.tasks && competition.tasks.length > 0;
  const displayBannerUrl = competition.bannerImageDataUrl || competition.bannerImageUrl || `https://picsum.photos/seed/${competition.id}/1200/400`;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to={ROUTES.COMPETITIONS_LIST} className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-6 group">
          <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Competitions
        </Link>

        <article className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
          <img 
            className="w-full h-64 md:h-80 object-cover" 
            src={displayBannerUrl} 
            alt={`${competition.title} banner`}
          />
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">{competition.title}</h1>
              <span className={`px-4 py-1.5 text-sm font-semibold rounded-full shadow-md capitalize ${
                competition.status === 'open' ? 'bg-green-500 text-white animate-pulse' : 
                competition.status === 'upcoming' ? 'bg-primary-500 text-white' :
                competition.status === 'judging' ? 'bg-yellow-500 text-gray-900' :
                competition.status === 'closed' ? 'bg-red-500 text-white' :
                'bg-gray-500 text-white' 
              }`}>
                {competition.status}
              </span>
            </div>
             {competition.category && <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3">Category: {competition.category}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <p className="flex items-center"><CalendarDays size={18} className="mr-2 text-primary-500" /> <strong>Start:</strong> {new Date(competition.startDate).toLocaleString()}</p>
              <p className="flex items-center"><CalendarDays size={18} className="mr-2 text-red-500" /> <strong>End:</strong> {new Date(competition.endDate).toLocaleString()}</p>
              <p className="flex items-center md:col-span-2"><Trophy size={18} className="mr-2 text-amber-500" /> <strong>Prize:</strong> {competition.prize}</p>
              {competition.status !== 'upcoming' && <p className="flex items-center"><Users size={18} className="mr-2 text-indigo-500" /> <strong>Submissions:</strong> {competition.submissions.length}</p>}
            </div>

            <div className="prose dark:prose-invert max-w-none mb-6 blog-content">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white !mt-0 mb-2">Description</h2>
              <p>{competition.description}</p>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4 mb-2">Rules</h2>
              <Markdown>{competition.rules}</Markdown>
            </div>
            
            {showTasks && (
              <section className="my-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <ListOrdered size={24} className="mr-2 text-blue-600 dark:text-blue-400"/>
                  Competition Tasks
                </h3>
                <ul className="space-y-4">
                  {(competition.tasks || []).map((task, index) => (
                    <li key={task.id} className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                      <div className="flex items-center mb-1">
                        <TaskTypeIcon type={task.type} />
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200">{index + 1}. {task.title}</h4>
                        {task.points && <span className="ml-auto text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-700/50 px-2 py-0.5 rounded-full">{task.points} pts</span>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">{task.description}</p>
                    </li>
                  ))}
                </ul>
                {competition.status === 'open' && !userHasSubmitted && (
                    <p className="mt-4 text-sm text-blue-700 dark:text-blue-300">
                    Please address all tasks above in your single submission entry below. 
                    For 'file_upload_mock' tasks, mention the name of your (mock) uploaded file in your text response.
                    For 'external_link' tasks, please provide the direct URL.
                    </p>
                )}
              </section>
            )}

            {competition.winner && (
              <div className="my-6 p-4 bg-green-50 dark:bg-green-800/30 border border-green-400 dark:border-green-600 rounded-lg">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 flex items-center mb-2"><Award size={24} className="mr-2"/>Winner Announced!</h3>
                <p className="text-green-600 dark:text-green-200">Congratulations to <strong>{competition.winner.talentName}</strong>!</p>
                <p className={`mt-1 text-sm ${competition.paymentProcessed === 'Processed' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    Payment Status: <strong>{competition.paymentProcessed || 'Pending'}</strong>
                </p>
                {isAdmin && (
                  <div className="mt-3">
                    <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Update Payment Status:</label>
                    <div className="flex items-center gap-2">
                        <select
                        id="paymentStatus"
                        value={competition.paymentProcessed || 'Pending'}
                        onChange={(e) => handlePaymentUpdate(e.target.value as PaymentStatus)}
                        disabled={isUpdatingPayment}
                        className="mt-1 block w-full md:w-1/2 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                        {paymentStatusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                        </select>
                        {isUpdatingPayment && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500"></div>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user && !isAdmin && competition.status === 'open' && (
              canSubmit ? (
                <form onSubmit={handleEntrySubmit} className="my-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Submit Your Entry</h3>
                  <textarea
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Enter your submission details here. If tasks are listed above, please address all of them in this single entry. For links, paste them directly. For mock file uploads, mention the file name."
                    rows={8}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <Button type="submit" variant="primary" className="mt-4 w-full sm:w-auto" isLoading={isSubmittingEntry} leftIcon={<Send size={18}/>}>
                    {isSubmittingEntry ? 'Submitting...' : 'Submit Entry'}
                  </Button>
                </form>
              ) : userHasSubmitted ? (
                <div className="my-8 p-4 bg-yellow-50 dark:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-center flex items-center gap-2 justify-center">
                  <Info size={18}/> You have already submitted an entry for this competition.
                </div>
              ) : null 
            )}
             {user && !isAdmin && competition.status !== 'open' && competition.status !== 'upcoming' && (
                <div className="my-8 p-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-center flex items-center gap-2 justify-center">
                    <Clock size={18}/> This competition is not currently open for submissions.
                </div>
             )}


            {isAdmin && (
              <div className="mt-8 pt-6 border-t dark:border-gray-700 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate(generatePath(ROUTES.ADMIN_DASHBOARD, {}) + `?tab=Competitions&edit=${competition.id}`)} 
                    leftIcon={<Edit3 size={18}/>}
                  >
                    Edit Competition
                  </Button>
                  {competition.submissions.length > 0 && competition.status !== 'upcoming' && (
                     <Button variant="info" onClick={() => setShowSubmissionsModal(true)} leftIcon={<ListChecks size={18}/>}>
                        View Submissions ({competition.submissions.length})
                     </Button>
                  )}
                  {competition.status !== 'upcoming' && !competition.winner && competition.submissions.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">No submissions yet to declare a winner.</p>
                  )}
                  <Button variant="danger" onClick={handleDeleteCompetition} leftIcon={<Trash2 size={18}/>}>
                    Delete Competition
                  </Button>
                </div>
              </div>
            )}
          </div>
        </article>

        {isAdmin && competition && (
            <Modal isOpen={showSubmissionsModal} onClose={() => {setShowSubmissionsModal(false); setSelectedWinner(null);}} title={`Submissions for "${competition.title}"`} size="xl">
                {competition.submissions.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No submissions received yet.</p>
                ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {competition.submissions.map(sub => (
                        <div key={sub.submissionId} className={`p-4 border rounded-lg ${selectedWinner?.submissionId === sub.submissionId ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-500' : 'dark:border-gray-600'}`}>
                        <p className="font-semibold text-gray-800 dark:text-white">{sub.talentName} <span className="text-xs text-gray-500 dark:text-gray-400">(ID: {sub.talentId})</span></p>
                        <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap my-2 blog-content"><Markdown>{sub.submissionContent}</Markdown></div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Submitted: {new Date(sub.submissionDate).toLocaleString()}</p>
                        {!competition.winner && (competition.status === 'judging' || competition.status === 'closed') && (
                            <Button 
                            variant={selectedWinner?.submissionId === sub.submissionId ? "success" : "outline"} 
                            size="sm" 
                            className="mt-2" 
                            onClick={() => setSelectedWinner(sub)}
                            leftIcon={selectedWinner?.submissionId === sub.submissionId ? <CheckCircle size={16} /> : <Award size={16}/>}
                            >
                            {selectedWinner?.submissionId === sub.submissionId ? 'Selected as Winner' : 'Select as Winner'}
                            </Button>
                        )}
                        {competition.winner?.submissionId === sub.submissionId && (
                            <p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400 flex items-center"><Award size={16} className="mr-1"/>Declared Winner</p>
                        )}
                        </div>
                    ))}
                    </div>
                )}
                {selectedWinner && !competition.winner && (
                    <div className="mt-6 pt-4 border-t dark:border-gray-600">
                    <p className="mb-2 text-gray-700 dark:text-gray-200">You have selected <strong>{selectedWinner.talentName}</strong> as the winner.</p>
                    <Button variant="success" onClick={handleDeclareWinner} isLoading={isDeclaringWinner} leftIcon={<Award size={18}/>}>
                        {isDeclaringWinner ? 'Declaring...' : 'Confirm & Declare Winner'}
                    </Button>
                    </div>
                )}
                 {competition.winner && (
                    <p className="mt-4 text-green-600 dark:text-green-400 font-semibold">Winner has already been declared for this competition.</p>
                 )}
            </Modal>
        )}
      </div>
    </div>
  );
};

export default CompetitionDetailPage;