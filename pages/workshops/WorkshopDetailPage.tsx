import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkshop } from '../../hooks/useWorkshop';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../hooks/useAlert';
import { Workshop } from '../../types';
import Button from '../../components/shared/Button';
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, UserPlus, UserMinus, DollarSign, Edit3, Trash2 } from 'lucide-react';
import { ROUTES, generatePath } from '../../constants';
import Markdown from 'react-markdown';

const WorkshopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getWorkshopById, registerForWorkshop, unregisterFromWorkshop, deleteWorkshop, loading, error } = useWorkshop();
  const { user, isAdmin } = useAuth();
  const { addAlert } = useAlert();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchWorkshop = async () => {
        const fetchedWs = await getWorkshopById(id);
        if (fetchedWs) {
          setWorkshop(fetchedWs);
        } else {
          addAlert('Workshop not found.', 'error');
          navigate(ROUTES.WORKSHOPS_LIST);
        }
      };
      fetchWorkshop();
    }
  }, [id, getWorkshopById, addAlert, navigate]);

  const isUserRegistered = useMemo(() => {
    if (!user || !workshop) return false;
    return workshop.registeredTalents.some(rt => rt.talentId === user.id);
  }, [user, workshop]);

  const canRegister = useMemo(() => {
    if (!workshop) return false;
    if (workshop.capacity && workshop.registeredTalents.length >= workshop.capacity) return false; 
    return new Date(workshop.dateTime) > new Date(); 
  }, [workshop]);

  const handleRegisterToggle = async () => {
    if (!workshop || !user) return;
    setIsRegistering(true);
    let success;
    if (isUserRegistered) {
      success = await unregisterFromWorkshop(workshop.id);
      if (success) addAlert('Successfully unregistered from workshop.', 'success');
    } else {
      success = await registerForWorkshop(workshop.id);
      if (success) addAlert('Successfully registered for workshop!', 'success');
    }
    
    if (!success && !error) { 
        addAlert(`Failed to ${isUserRegistered ? 'unregister' : 'register'}. Please try again.`, 'error');
    }
    const updatedWs = await getWorkshopById(workshop.id);
    if (updatedWs) setWorkshop(updatedWs);
    setIsRegistering(false);
  };

  const handleDeleteWorkshop = async () => {
    if (!workshop || !isAdmin) return;
    if (window.confirm(`Are you sure you want to delete the workshop "${workshop.title}"? This action cannot be undone.`)) {
      const success = await deleteWorkshop(workshop.id);
      if (success) {
        addAlert('Workshop deleted successfully.', 'success');
        navigate(ROUTES.WORKSHOPS_LIST);
      } else {
        addAlert('Failed to delete workshop.', 'error');
      }
    }
  };


  if (loading && !workshop) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
        <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">Loading Workshop Details...</p>
      </div>
    );
  }

  if (error && !workshop) {
    return <div className="p-8 text-center text-red-500 dark:text-red-400">{error}</div>;
  }
  if (!workshop) {
    return <div className="p-8 text-center dark:text-gray-300">Workshop not found or failed to load.</div>;
  }
  
  const isPastWorkshop = new Date(workshop.dateTime) < new Date();
  const displayBannerUrl = workshop.bannerImageDataUrl || workshop.bannerImageUrl || `https://picsum.photos/seed/${workshop.id}/1200/400`;


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to={ROUTES.WORKSHOPS_LIST} className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:underline mb-6 group">
          <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Workshops
        </Link>

        <article className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
          {(workshop.bannerImageUrl || workshop.bannerImageDataUrl) && (
            <img 
              className="w-full h-64 md:h-80 object-cover" 
              src={displayBannerUrl} 
              alt={`${workshop.title} banner`}
            />
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">{workshop.title}</h1>
            
            {workshop.category && <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-4">{workshop.category}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 dark:text-gray-300 mb-6 text-sm">
              <p className="flex items-center"><CalendarDays size={18} className="mr-2 text-teal-500" /> <strong>Date & Time:</strong> {new Date(workshop.dateTime).toLocaleString()}</p>
              {workshop.durationMinutes && <p className="flex items-center"><Clock size={18} className="mr-2 text-teal-500" /> <strong>Duration:</strong> {workshop.durationMinutes} minutes</p>}
              <p className="flex items-center col-span-1 md:col-span-2"><MapPin size={18} className="mr-2 text-teal-500" /> <strong>Location/Link:</strong> {workshop.locationOrLink.startsWith('http') ? <a href={workshop.locationOrLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{workshop.locationOrLink}</a> : workshop.locationOrLink}</p>
              {workshop.facilitator && <p className="flex items-center"><strong>Facilitator:</strong> {workshop.facilitator}</p>}
              <p className="flex items-center"><DollarSign size={18} className="mr-2 text-yellow-500" /> <strong>Fee:</strong> {workshop.fee}</p>
              <p className="flex items-center"><Users size={18} className="mr-2 text-indigo-500" /> <strong>Registered:</strong> {workshop.registeredTalents.length}{workshop.capacity ? ` / ${workshop.capacity}` : ''}</p>
            </div>
            
            {isPastWorkshop && (
                <div className="my-4 p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-center">
                    This workshop has already passed.
                </div>
            )}


            <div className="prose dark:prose-invert max-w-none mb-8 blog-content">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white !mt-0 mb-2">About this Workshop</h2>
              <Markdown>{workshop.description}</Markdown>
            </div>
            
            {user && !isAdmin && !isPastWorkshop && (
              <Button 
                onClick={handleRegisterToggle} 
                variant={isUserRegistered ? "danger_outline" : "primary"}
                className="w-full sm:w-auto" 
                isLoading={isRegistering}
                leftIcon={isUserRegistered ? <UserMinus size={18}/> : <UserPlus size={18}/>}
                disabled={!isUserRegistered && (!canRegister || (workshop.capacity && workshop.registeredTalents.length >= workshop.capacity))}
              >
                {isRegistering ? (isUserRegistered ? 'Unregistering...' : 'Registering...') : (isUserRegistered ? 'Unregister from Workshop' : 'Register for Workshop')}
              </Button>
            )}
            {!isUserRegistered && !isPastWorkshop && workshop.capacity && workshop.registeredTalents.length >= workshop.capacity && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">This workshop is currently full.</p>
            )}
             {!user && !isPastWorkshop && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <Link to={ROUTES.LOGIN} className="text-blue-500 hover:underline">Log in</Link> or <Link to={ROUTES.REGISTER} className="text-blue-500 hover:underline">register</Link> to sign up for this workshop.
                </p>
            )}

            {isAdmin && (
              <div className="mt-8 pt-6 border-t dark:border-gray-700 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate(generatePath(ROUTES.ADMIN_DASHBOARD, {}) + `?tab=Workshops&edit=${workshop.id}`)}
                    leftIcon={<Edit3 size={18}/>}
                  >
                    Edit Workshop
                  </Button>
                  <Button variant="danger" onClick={handleDeleteWorkshop} leftIcon={<Trash2 size={18}/>}>
                    Delete Workshop
                  </Button>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;