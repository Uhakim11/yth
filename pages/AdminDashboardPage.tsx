
import React, { useState, useEffect, useMemo } from 'react';
import { useTalent } from '../hooks/useTalent';
import { useAuth } from '../hooks/useAuth';
import { useCompetition } from '../hooks/useCompetition';
import { useWorkshop } from '../hooks/useWorkshop';
import { useResource } from '../hooks/useResource';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import { useAlert } from '../hooks/useAlert';
import StatisticCard from '../components/admin/StatisticCard';
import { MOCK_ADMIN_STATISTICS_CONFIG } from '../constants'; // Updated to MOCK_ADMIN_STATISTICS_CONFIG
import TalentCardSkeleton from '../components/shared/TalentCardSkeleton';
import { Tab } from '@headlessui/react' 
import { CogIcon, UserGroupIcon as UserGroupIconHero, ServerIcon as ServerIconLucide } from '@heroicons/react/24/outline'; // Changed ServerIcon to ServerIconLucide
import { Trophy, CalendarDays, BookOpen, BarChart3, Users } from 'lucide-react'; 

import ManageTalentsSection from '../components/admin/sections/ManageTalentsSection';
import ManageCompetitionsSection from '../components/admin/sections/ManageCompetitionsSection';
import ManageWorkshopsSection from '../components/admin/sections/ManageWorkshopsSection';
import ManageResourcesSection from '../components/admin/sections/ManageResourcesSection';
import PlatformSettingsSection from '../components/admin/sections/PlatformSettingsSection'; 
import PlatformAnalyticsSection from '../components/admin/sections/PlatformAnalyticsSection';
import ManageUsersSection from '../components/admin/sections/ManageUsersSection'; 


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const AdminDashboardPage: React.FC = () => {
  const { talents, loading: talentsLoading, error: talentsError, fetchTalentsList } = useTalent();
  const { competitions, loading: competitionsLoading, fetchCompetitions } = useCompetition();
  const { workshops, loading: workshopsLoading, fetchWorkshops } = useWorkshop();
  const { resources, loading: resourcesLoading, fetchResources } = useResource();
  const { fetchAllUsers } = useAuth(); 
  
  const { user } = useAuth(); // Current admin user
  const { addAlert } = useAlert();
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  useEffect(() => {
    fetchTalentsList();
    fetchCompetitions();
    fetchWorkshops();
    fetchResources();
    fetchAllUsers().then(allUsers => setTotalUsersCount(allUsers.length));
  }, [fetchTalentsList, fetchCompetitions, fetchWorkshops, fetchResources, fetchAllUsers]);


  const overallLoading = talentsLoading || competitionsLoading || workshopsLoading || resourcesLoading || totalUsersCount === 0;

  const statisticsData = useMemo(() => {
     return MOCK_ADMIN_STATISTICS_CONFIG.map(stat => {
        if (stat.id === 'admin_s0') return { ...stat, value: `${totalUsersCount}` }; 
        if (stat.id === 'admin_s1') return { ...stat, value: `${talents.length}` };
        if (stat.id === 'admin_s2') return { ...stat, value: `${competitions.length}` };
        if (stat.id === 'admin_s3') return { ...stat, value: `${workshops.length}` };
        if (stat.id === 'admin_s4') return { ...stat, value: `${resources.length}` };
        if (stat.id === 'admin_s5') return { ...stat, value: 'Configure' }; // Example for settings
        return { ...stat, value: 'N/A'};
    });
  }, [talents.length, competitions.length, workshops.length, resources.length, totalUsersCount]); // Updated dependencies
  
  const adminTabs = [
    { name: 'Talents', component: <ManageTalentsSection />, icon: UserGroupIconHero },
    { name: 'Users', component: <ManageUsersSection />, icon: Users }, 
    { name: 'Competitions', component: <ManageCompetitionsSection />, icon: Trophy },
    { name: 'Workshops', component: <ManageWorkshopsSection />, icon: CalendarDays },
    { name: 'Resources', component: <ManageResourcesSection />, icon: BookOpen },
    { name: 'Analytics', component: <PlatformAnalyticsSection />, icon: BarChart3 }, 
    { name: 'Settings', component: <PlatformSettingsSection />, icon: ServerIconLucide }, // Use ServerIconLucide
  ];


  if (talentsError) { 
    return <div className="p-8 text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md mx-auto max-w-lg mt-10">
        <h2 className="text-2xl font-semibold mb-2">Error Loading Data</h2>
        <p>{talentsError}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
    </div>;
  }
  
  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
                <CogIcon className="h-10 w-10 text-primary-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
            </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage all talent profiles, activities, and platform content.</p>
      </header>

      {/* Statistics Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Platform Overview</h2>
        {overallLoading && statisticsData.every(s => s.value === 'N/A' || s.value === '0' || s.value === 'Configure') ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[...Array(MOCK_ADMIN_STATISTICS_CONFIG.length)].map((_, i) => (
                    <div key={i} className="p-6 rounded-xl shadow-lg bg-gray-200 dark:bg-gray-700 animate-pulse h-28"></div>
                 ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statisticsData.map(stat => <StatisticCard key={stat.id} {...stat} />)}
            </div>
        )}
      </section>

      {/* Management Sections with Tabs */}
      <section>
        <Tab.Group>
          <Tab.List className="flex flex-wrap space-x-1 rounded-xl bg-primary-900/20 dark:bg-gray-800 p-1 mb-6 shadow">
            {adminTabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full sm:w-auto flex-grow sm:flex-none rounded-lg py-2.5 px-3 text-sm font-medium leading-5 flex items-center justify-center space-x-2',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 dark:ring-offset-gray-900 ring-white dark:ring-gray-300 ring-opacity-60',
                    selected
                      ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow'
                      : 'text-gray-100 hover:bg-white/[0.12] dark:text-gray-300 dark:hover:bg-gray-700/[0.5] hover:text-white'
                  )
                }
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {adminTabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white dark:bg-gray-800 p-3 md:p-6 shadow-lg', 
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 dark:ring-offset-gray-900 ring-white dark:ring-gray-300 ring-opacity-60'
                )}
              >
                {tab.component}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
