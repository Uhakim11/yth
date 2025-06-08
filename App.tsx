import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TalentDetailPage from './pages/TalentDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/layout/Navbar';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AlertContainer from './components/shared/AlertContainer';
import ScrollToTopButton from './components/shared/ScrollToTopButton';
import PublicTalentsPage from './pages/PublicTalentsPage';
import SettingsPage from './pages/SettingsPage';
// Removed AccentColorProvider import as it's in index.tsx

// New Page Imports
import CompetitionsListPage from './pages/competitions/CompetitionsListPage';
import CompetitionDetailPage from './pages/competitions/CompetitionDetailPage';
import CompetitionTaskDetailsPage from './pages/competitions/CompetitionTaskDetailsPage'; // Admin Task Management
import CompetitionUserTaskPage from './pages/competitions/CompetitionUserTaskPage'; // User Task Engagement
import WorkshopsListPage from './pages/workshops/WorkshopsListPage';
import WorkshopDetailPage from './pages/workshops/WorkshopDetailPage';
import ResourcesPage from './pages/resources/ResourcesPage';
// import ChatPage from './pages/ChatPage'; // Removed Chat Page
import ContactPage from './pages/ContactPage'; // New Contact Page

const App: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const showNavbar = location.pathname !== '/';

  return (
    // AccentColorProvider removed from here
    <div className="flex flex-col min-h-screen font-sans">
      {showNavbar && <Navbar />}
      <AlertContainer />
      <main 
        key={location.pathname}
        className={`flex-grow ${showNavbar ? 'md:ml-64' : ''} transition-all duration-300 animate-pageFadeIn`}
      >
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/talents" element={<PublicTalentsPage />} />
          <Route path="/contact" element={<ContactPage />} /> {/* New Contact Page Route */}
          
          {/* New Feature Routes */}
          <Route path="/competitions" element={<CompetitionsListPage />} />
          <Route path="/competitions/:id" element={<CompetitionDetailPage />} />
          <Route 
            path="/competitions/:id/tasks-details" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompetitionTaskDetailsPage />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/competitions/:id/do-tasks" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}> {/* Allow admin for testing */}
                <CompetitionUserTaskPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/workshops" element={<WorkshopsListPage />} />
          <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          {/* Chat Routes Removed */}
          <Route path="/talent/:id" element={<TalentDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <ScrollToTopButton />
    </div>
    // AccentColorProvider removed from here
  );
};

export default App;