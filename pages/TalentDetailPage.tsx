import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTalent } from '../hooks/useTalent';
import { Talent, PortfolioItem } from '../../types'; 
import PortfolioItemCard from '../components/talent/PortfolioItemCard'; 
import { ArrowLeftIcon, BriefcaseIcon, EnvelopeIcon, GlobeAltIcon, LinkIcon, MapPinIcon, UserCircleIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

const TalentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTalentById, loading } = useTalent();
  const [talent, setTalent] = useState<Talent | null | undefined>(null);

  useEffect(() => {
    if (id) {
      const fetchTalent = async () => {
        const fetchedTalent = await getTalentById(id);
        setTalent(fetchedTalent ? {...fetchedTalent, portfolio: fetchedTalent.portfolio || []} : undefined);
      };
      fetchTalent();
    }
  }, [id, getTalentById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
        <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">Loading Talent Profile...</p>
      </div>
    );
  }

  if (talent === undefined) { 
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center">
        <UserCircleIcon className="h-24 w-24 text-red-400 mb-4" />
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Talent Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The talent profile you are looking for does not exist or may have been removed.</p>
        <Link to="/" className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Go to Homepage
        </Link>
      </div>
    );
  }
  
  if (!talent) { 
    return <div className="p-8 text-center dark:text-white">Profile not available.</div>;
  }

  const displayImageUrl = talent.profileImageDataUrl || talent.profileImageUrl || `https://picsum.photos/seed/${talent.id}/400/600`;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to={-1 as any} className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-6 group">
          <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </Link>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img 
                className="h-64 w-full object-cover md:w-64 md:h-full" 
                src={displayImageUrl} 
                alt={talent.name} 
              />
            </div>
            <div className="p-8 flex-1">
              <div className="uppercase tracking-wide text-sm text-primary-500 dark:text-primary-400 font-semibold">{talent.category}</div>
              <h1 className="block mt-1 text-4xl leading-tight font-bold text-black dark:text-white">{talent.name}</h1>
              {talent.location && (
                <p className="mt-2 text-gray-500 dark:text-gray-400 flex items-center"><MapPinIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500"/>{talent.location}</p>
              )}
            </div>
          </div>

          <div className="p-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">About {talent.name.split(' ')[0]}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{talent.description}</p>

            {talent.skills && talent.skills.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {talent.skills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full shadow-sm">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            
            {talent.portfolio && talent.portfolio.length > 0 && (
                 <div className="mt-10">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <BriefcaseIcon className="h-7 w-7 mr-2 text-indigo-500"/>
                        Portfolio
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {talent.portfolio.map(item => (
                            <PortfolioItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            )}
            {(!talent.portfolio || talent.portfolio.length === 0) && (
                <div className="mt-10 p-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-center">
                    <BuildingLibraryIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3"/>
                    <p className="text-gray-600 dark:text-gray-400">{talent.name.split(' ')[0]} has not added any portfolio items yet.</p>
                </div>
            )}


            {talent.portfolioLinks && talent.portfolioLinks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Other Links</h3>
                <ul className="space-y-3">
                  {talent.portfolioLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.startsWith('http') ? link : `http://${link}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 hover:underline transition-colors group"
                      >
                        <LinkIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-300" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact</h3>
              {talent.contactEmail ? (
                 <a href={`mailto:${talent.contactEmail}`} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
                    <EnvelopeIcon className="h-5 w-5 mr-2"/> Contact {talent.name.split(' ')[0]}
                </a>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Contact information not publicly available.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDetailPage;