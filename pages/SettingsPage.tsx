
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../hooks/useAlert';
import { useAccentColor } from '../hooks/useAccentColor'; 
import { ACCENT_COLORS } from '../constants'; 
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import FileInput from '../components/shared/FileInput'; // New
import { UserCircleIcon, EnvelopeIcon, KeyIcon, Cog8ToothIcon, CameraIcon } from '@heroicons/react/24/outline';
import { Palette as PaletteIcon } from 'lucide-react'; 
import { UploadedFile } from '../types';

const SettingsPage: React.FC = () => {
  const { user, loading: authLoading, updateUserAvatar } = useAuth(); 
  const { addAlert } = useAlert();
  const { accentColor, setAccentColorByName } = useAccentColor(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [avatarFile, setAvatarFile] = useState<UploadedFile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);


  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [selectedAccent, setSelectedAccent] = useState(accentColor.name);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarPreview(user.avatarDataUrl || user.avatarUrl || null);
    }
  }, [user]);

  useEffect(() => {
    setSelectedAccent(accentColor.name);
  }, [accentColor]);

  const handleAvatarFileChange = (file: UploadedFile | null) => {
    setAvatarFile(file);
    setAvatarPreview(file ? file.dataUrl : (user?.avatarDataUrl || user?.avatarUrl || null));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSubmitting(true);

    if (avatarFile && avatarFile.dataUrl) {
        try {
            await updateUserAvatar(avatarFile.dataUrl);
            addAlert('Avatar updated successfully!', 'success');
        } catch (error) {
            addAlert('Failed to update avatar. Please try again.', 'error');
        }
    }
    // Mock other profile info update
    await new Promise(resolve => setTimeout(resolve, 500)); 
    addAlert('Profile information updated successfully (mock update for name/email).', 'success');
    setIsProfileSubmitting(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      addAlert('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addAlert('New password must be at least 8 characters long.', 'error');
      return;
    }
    setIsPasswordSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    addAlert('Password changed successfully (mock). Please re-login for changes to take full effect in a real app.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsPasswordSubmitting(false);
  };

  const handleAccentChange = (newAccentName: string) => {
    setAccentColorByName(newAccentName);
    setSelectedAccent(newAccentName);
    // addAlert(`Accent color changed to ${newAccentName}.`, 'success'); // Alert can be noisy for this
  };

  if (authLoading && !user) {
    return <div className="p-8 text-center dark:text-white flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mr-3"></div>
        Loading settings...
    </div>;
  }

  if (!user) {
    return <div className="p-8 text-center dark:text-white">Please log in to access settings.</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <header className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
         <div className="flex items-center space-x-3">
            <Cog8ToothIcon className="h-12 w-12 text-primary-500" />
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Account Settings</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your profile, security, and appearance preferences.</p>
            </div>
        </div>
      </header>

      {/* Profile Information Form */}
      <section className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-3 dark:border-gray-700 flex items-center">
          <UserCircleIcon className="h-7 w-7 mr-3 text-primary-500" />
          Profile Information
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="relative group">
                <img 
                    src={avatarPreview || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=random&color=fff&size=128`} 
                    alt="Profile Avatar" 
                    className="h-32 w-32 rounded-full object-cover shadow-md border-4 border-gray-200 dark:border-gray-700 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => document.getElementById('avatar-upload-input')?.click()}>
                    <CameraIcon className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
            <FileInput
                id="avatar-upload-input"
                label="Change Avatar"
                onFileChange={handleAvatarFileChange}
                acceptedFileTypes="image/*"
                maxFileSizeMB={2}
                currentFileUrl={avatarPreview} // Pass current preview to FileInput for its own preview logic
                className="flex-grow" // hidden input, label makes it accessible
            />
          </div>

          <Input
            id="name"
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your full name"
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your.email@example.com"
            disabled // Typically email is not changed easily
            inputClassName="disabled:bg-gray-100 dark:disabled:bg-gray-700"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={isProfileSubmitting || authLoading}>
              {isProfileSubmitting || authLoading ? 'Saving Profile...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </section>

      {/* Change Password Form */}
      <section className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-3 dark:border-gray-700 flex items-center">
            <KeyIcon className="h-7 w-7 mr-3 text-red-500" />
            Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <Input
            id="currentPassword"
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="••••••••"
            inputClassName="tracking-wider"
          />
          <Input
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
            inputClassName="tracking-wider"
          />
          <Input
            id="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            placeholder="••••••••"
            inputClassName="tracking-wider"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="danger" isLoading={isPasswordSubmitting}>
              {isPasswordSubmitting ? 'Changing Password...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </section>

       {/* Appearance Settings Form */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-3 dark:border-gray-700 flex items-center">
            <PaletteIcon className="h-7 w-7 mr-3 text-green-500" />
            Appearance
        </h2>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accent Color</label>
                <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map(color => (
                        <button
                            key={color.name}
                            type="button"
                            title={color.name}
                            onClick={() => handleAccentChange(color.name)}
                            className={`w-10 h-10 rounded-full focus:outline-none transition-all duration-150 transform hover:scale-110
                                        ${selectedAccent === color.name ? 'ring-4 ring-offset-2 dark:ring-offset-gray-800' : 'ring-1 ring-gray-300 dark:ring-gray-600'}`}
                            style={{ backgroundColor: color.primary500, borderColor: selectedAccent === color.name ? color.primary700 : 'transparent' }} 
                        >
                           {selectedAccent === color.name && <span className="sr-only">Selected</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
