import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';         // Corrected path
import { useTalent } from '../hooks/useTalent';     // Corrected path
import { useCompetition } from '../hooks/useCompetition'; // Corrected path
import { useWorkshop } from '../hooks/useWorkshop';     // Corrected path
import TalentForm from '../components/talent/TalentForm';
import TalentCard from '../components/talent/TalentCard';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import PortfolioItemForm from '../components/talent/PortfolioItemForm';
import PortfolioItemCard from '../components/talent/PortfolioItemCard';
import { AISkillSuggester } from '../components/user/AISkillSuggester';
import { Talent, PortfolioItem } from '../types';
import { PencilIcon, UserCircleIcon, TrophyIcon as TrophyIconHero, CalendarDaysIcon as CalendarDaysIconHero, PlusCircleIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { Activity, Info, CheckCircle2 as CheckCircle, Lightbulb, Sparkles as SparklesLucide } from 'lucide-react';
import { useAlert } from '../hooks/useAlert';
import { ROUTES, generatePath } from '../constants';

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    talents, addTalent, updateTalent, loading: talentLoading, fetchTalentsList,
    addPortfolioItem, updatePortfolioItem, deletePortfolioItem
  } = useTalent();
  const { competitions, loading: competitionsLoading, fetchCompetitions } = useCompetition();
  const { workshops, loading: workshopsLoading, fetchWorkshops } = useWorkshop();
  const { addAlert } = useAlert();

  const [userTalent, setUserTalent] = useState<Talent | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isPortfolioSubmitting, setIsPortfolioSubmitting] = useState(false);

  useEffect(() => {
    if(user) {
        fetchTalentsList();
        fetchCompetitions();
        fetchWorkshops();
    }
  }, [user, fetchTalentsList, fetchCompetitions, fetchWorkshops]);


  useEffect(() => {
    if (user && talents.length > 0) {
      const foundTalent = talents.find(t => t.userId === user.id);
      setUserTalent(foundTalent ? {...foundTalent, portfolio: foundTalent.portfolio || []} : null);
      if (!foundTalent && !talentLoading) {
        setShowProfileForm(true);
      } else {
        setShowProfileForm(false);
      }
    } else if (user && talents.length === 0 && !talentLoading) {
        setUserTalent(null);
        setShowProfileForm(true);
    }
  }, [user, talents, talentLoading]);

  const myCompetitionEntries = useMemo(() => {
    if (!user) return [];
    return competitions.filter(comp => comp.submissions.some(sub => sub.talentId === user.id));
  }, [competitions, user]);

  const myRegisteredWorkshops = useMemo(() => {
    if (!user) return [];
    return workshops.filter(ws => ws.registeredTalents.some(reg => reg.talentId === user.id));
  }, [workshops, user]);

  const profileCompletion = useMemo(() => {
    if (!userTalent) return { percentage: 0, suggestions: ["Create your talent profile to get started!"] };

    let score = 0;
    const maxScore = 5;
    const suggestions: string[] = [];

    if (userTalent.name?.trim()) score++; else suggestions.push("Add your name or act name.");
    if (userTalent.category?.trim()) score++; else suggestions.push("Select a talent category.");
    if (userTalent.description?.trim() && userTalent.description.length > 30) score++; else suggestions.push("Write a compelling description (at least 30 characters).");
    if (userTalent.skills && userTalent.skills.length > 0) score++; else suggestions.push("List your key skills (comma-separated).");
    if (userTalent.portfolio && userTalent.portfolio.length > 0) score++; else suggestions.push("Showcase your work by adding at least one portfolio item.");

    const percentage = Math.round((score / maxScore) * 100);
    if (percentage === 100 && suggestions.length === 0) {
      suggestions.push("Your profile looks great! Keep it updated.");
    } else if (suggestions.length === 0 && percentage < 100) {
      suggestions.push("Consider adding more portfolio items or achievements to further enhance your profile.");
    }

    return { percentage, suggestions };
  }, [userTalent]);


  const handleProfileSubmit = async (data: Omit<Talent, 'id' | 'userId' | 'portfolio'> | Talent) => {
    if (!user) return;
    setIsProfileSubmitting(true);
    let success = false;
    let resultingTalent: Talent | null = null;
    if ('id' in data) {
      resultingTalent = await updateTalent(data as Talent);
    } else {
      resultingTalent = await addTalent(data, user.id);
    }
    if(resultingTalent) {
        success = true;
        setUserTalent({...resultingTalent, portfolio: resultingTalent.portfolio || [] });
    }
    setIsProfileSubmitting(false);

    if(success){
        addAlert( ('id' in data) ? 'Profile updated successfully!' : 'Profile created successfully!', 'success');
        setShowProfileForm(false);
    } else {
        addAlert('Failed to save profile. Please try again.', 'error');
    }
  };

  const handlePortfolioFormSubmit = async (itemData: Omit<PortfolioItem, 'id' | 'talentId' | 'createdAt'> | PortfolioItem) => {
    if (!userTalent) return;
    setIsPortfolioSubmitting(true);
    let success = false;
    let resultingItem: PortfolioItem | null = null;

    if ('id' in itemData) {
        resultingItem = await updatePortfolioItem(userTalent.id, itemData as PortfolioItem);
    } else {
        resultingItem = await addPortfolioItem(userTalent.id, itemData);
    }

    if(resultingItem){
        success = true;
        // Refetch the specific talent profile to get updated portfolio list
        const updatedTalentProfile = await fetchTalentsList().then(() => talents.find(t => t.id === userTalent.id));
        if (updatedTalentProfile) setUserTalent({...updatedTalentProfile, portfolio: updatedTalentProfile.portfolio || []});
    }
    setIsPortfolioSubmitting(false);

    if(success) {
        addAlert(`Portfolio item ${'id' in itemData ? 'updated' : 'added'} successfully!`, 'success');
        setShowPortfolioForm(false);
        setEditingPortfolioItem(null);
    } else {
        addAlert(`Failed to ${'id' in itemData ? 'update' : 'add'} portfolio item.`, 'error');
    }
  };

  const handleEditPortfolioItem = (item: PortfolioItem) => {
    setEditingPortfolioItem(item);
    setShowPortfolioForm(true);
  };

  const handleDeletePortfolioItem = async (itemId: string) => {
    if (!userTalent || !window.confirm("Are you sure you want to delete this portfolio item?")) return;
    const success = await deletePortfolioItem(userTalent.id, itemId);
    if (success) {
        addAlert('Portfolio item deleted.', 'success');
        // Refetch to update portfolio
        const updatedTalentProfile = await fetchTalentsList().then(() => talents.find(t => t.id === userTalent.id));
        if (updatedTalentProfile) setUserTalent({...updatedTalentProfile, portfolio: updatedTalentProfile.portfolio || []});

    } else {
        addAlert('Failed to delete portfolio item.', 'error');
    }
  };

  const pageLoading = talentLoading || competitionsLoading || workshopsLoading;

  if (pageLoading && !userTalent && !showProfileForm) {
    return <div className="p-8 text-center dark:text-white flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mr-3"></div>
        Loading your dashboard...
    </div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <header className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
            <UserCircleIcon className="h-16 w-16 text-primary-500 mb-3 sm:mb-0"/>
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center sm:text-left">
                {user ? `Welcome back, ${user.name?.split(' ')[0]}!` : 'User Dashboard'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-center sm:text-left">
                {userTalent ? 'Manage your public presence, activities, and showcase your skills.' : 'Let the world know about your amazing talents!'}
                </p>
            </div>
        </div>
      </header>

      {userTalent && !showProfileForm && (
        <div className="mb-6 animate-fadeIn">
            <TalentCard talent={userTalent} />
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-md font-semibold text-primary-700 dark:text-primary-300 flex items-center">
                    <Lightbulb size={20} className="mr-2"/> Profile Completion
                  </h3>
                  <span className="text-sm font-bold text-primary-700 dark:text-primary-300">{profileCompletion.percentage}%</span>
                </div>
                <div className="w-full bg-primary-200 dark:bg-primary-700 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${profileCompletion.percentage}%` }}
                  ></div>
                </div>
                {profileCompletion.percentage < 100 && profileCompletion.suggestions.length > 0 && (
                  <ul className="text-xs text-primary-600 dark:text-primary-400 space-y-1 list-disc list-inside pl-1">
                    {profileCompletion.suggestions.slice(0,2).map((suggestion, index) => ( // Show first 2 suggestions
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                )}
                 {profileCompletion.percentage === 100 && (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center"><CheckCircle size={14} className="mr-1"/> Your profile is complete and looks great!</p>
                )}
              </div>
            <Button onClick={() => setShowProfileForm(true)} variant="primary" className="mt-6" leftIcon={<PencilIcon className="h-5 w-5"/>}>
                Edit Your Profile
            </Button>
        </div>
      )}

      {(showProfileForm || (!userTalent && !pageLoading)) && user && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl animate-fadeIn mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-3 dark:border-gray-700">
            {userTalent ? 'Edit Your Profile Details' : 'Tell Us About Your Talent'}
          </h2>
          <TalentForm
            initialTalent={userTalent}
            onSubmit={handleProfileSubmit}
            onCancel={userTalent ? () => setShowProfileForm(false) : undefined}
            isSubmitting={isProfileSubmitting}
          />
        </div>
      )}

      {!user && !pageLoading && (
         <p className="text-gray-600 dark:text-gray-300 mt-2 text-center p-8">Please log in to manage your dashboard.</p>
      )}

      {userTalent && (
        <>
        {/* AI Skill Suggester */}
        <section className="mt-10 p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 dark:from-purple-800/30 dark:via-pink-800/30 dark:to-red-800/30 rounded-lg shadow-lg animate-fadeIn">
            <div className="flex items-center mb-4">
                <SparklesLucide className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3"/>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Grow Your Skills</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Get AI-powered suggestions for new skills to learn based on your current profile.
            </p>
            <AISkillSuggester talent={userTalent} />
        </section>

        {/* Manage My Portfolio Section */}
        <section className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                    <BriefcaseIcon className="h-7 w-7 mr-3 text-indigo-500"/>
                    Manage My Portfolio
                </h2>
                <Button
                    onClick={() => { setEditingPortfolioItem(null); setShowPortfolioForm(true); }}
                    variant="info"
                    leftIcon={<PlusCircleIcon className="h-5 w-5"/>}
                >
                    Add Portfolio Item
                </Button>
            </div>
            {(userTalent.portfolio && userTalent.portfolio.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userTalent.portfolio.map(item => (
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
                <div className="text-gray-600 dark:text-gray-400 text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"/>
                    <p>Your portfolio is empty.</p>
                    <Button variant="ghost" onClick={() => { setEditingPortfolioItem(null); setShowPortfolioForm(true); }} className="text-primary-600 dark:text-primary-400 hover:underline">Add items</Button> to showcase your work!
                </div>
            )}
        </section>

        {/* My Activities Quick Stats */}
        <section className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <Activity className="h-7 w-7 mr-3 text-green-500"/>
                My Activities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* My Competition Entries Section */}
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                    <TrophyIconHero className="h-6 w-6 mr-2 text-amber-500"/>
                    Competition Entries ({myCompetitionEntries.length})
                </h3>
                {competitionsLoading ? <p className="dark:text-gray-300 text-sm">Loading entries...</p> :
                myCompetitionEntries.length > 0 ? (
                    <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {myCompetitionEntries.map(comp => {
                        const mySubmission = comp.submissions.find(s => s.talentId === user?.id);
                        return (
                        <li key={comp.id} className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Link to={generatePath(ROUTES.COMPETITION_DETAIL, {id: comp.id})} className="font-medium text-primary-600 dark:text-primary-400 hover:underline">{comp.title}</Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Status: {comp.status}</p>
                            {mySubmission && <p className="text-xs text-gray-500 dark:text-gray-400">Submitted: {new Date(mySubmission.submissionDate).toLocaleDateString()}</p>}
                            {comp.winner?.talentId === user?.id && <p className="text-xs font-bold text-green-500">You won!</p>}
                        </li>
                        );
                    })}
                    </ul>
                ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                        <TrophyIconHero className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-1"/>
                        <p>You haven't entered any competitions yet.</p>
                        <Link to={ROUTES.COMPETITIONS_LIST} className="text-primary-500 hover:underline">Explore competitions</Link>.
                    </div>
                )}
                </div>

                {/* My Registered Workshops Section */}
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                    <CalendarDaysIconHero className="h-6 w-6 mr-2 text-teal-500"/>
                    Registered Workshops ({myRegisteredWorkshops.length})
                </h3>
                {workshopsLoading ? <p className="dark:text-gray-300 text-sm">Loading registrations...</p> :
                myRegisteredWorkshops.length > 0 ? (
                    <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {myRegisteredWorkshops.map(ws => (
                        <li key={ws.id} className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Link to={generatePath(ROUTES.WORKSHOP_DETAIL, {id: ws.id})} className="font-medium text-primary-600 dark:text-primary-400 hover:underline">{ws.title}</Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Date: {new Date(ws.dateTime).toLocaleString()}</p>
                        </li>
                    ))}
                    </ul>
                ) : (
                     <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                        <CalendarDaysIconHero className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-1"/>
                        <p>You are not registered for any workshops.</p>
                        <Link to={ROUTES.WORKSHOPS_LIST} className="text-primary-500 hover:underline">Find workshops</Link>.
                    </div>
                )}
                </div>
            </div>
        </section>
        </>
      )}

      {showPortfolioForm && userTalent && (
        <Modal
            isOpen={showPortfolioForm}
            onClose={() => { setShowPortfolioForm(false); setEditingPortfolioItem(null);}}
            title={editingPortfolioItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}
            size="lg"
        >
            <PortfolioItemForm
                initialItem={editingPortfolioItem}
                onSubmit={handlePortfolioFormSubmit}
                onCancel={() => { setShowPortfolioForm(false); setEditingPortfolioItem(null);}}
                isSubmitting={isPortfolioSubmitting}
                talentPortfolio={userTalent.portfolio || []}
            />
        </Modal>
      )}
    </div>
  );
};

export default UserDashboardPage;
