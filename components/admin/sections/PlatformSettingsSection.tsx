import React, { useState } from 'react';
import Button from '../../shared/Button';
import { useAlert } from '../../../hooks/useAlert';
import { Server, AlertTriangle, Power } from 'lucide-react';

const PlatformSettingsSection: React.FC = () => {
  const { addAlert } = useAlert();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to reset all mock platform data? This action is for demonstration purposes and will only show an alert.")) {
      setIsResetting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      addAlert('All mock platform data has been reset (Simulated). In a real application, data would be cleared and defaults reloaded.', 'success');
      setIsResetting(false);
    }
  };

  const toggleMaintenanceMode = () => {
    setIsMaintenanceMode(!isMaintenanceMode);
    addAlert(`Maintenance mode ${!isMaintenanceMode ? 'enabled' : 'disabled'} (Simulated). A banner would typically appear for users.`, 'info');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center mb-4">
          <Server size={28} className="mr-3 text-red-500" /> Data Management
        </h2>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-300 dark:border-red-700">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-700 dark:text-red-300">Reset Platform Data</h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                This action will simulate clearing all mock talents, competitions, workshops, and resources. 
                This is a destructive operation in a real system.
              </p>
            </div>
          </div>
          <Button 
            variant="danger" 
            onClick={handleResetData} 
            className="mt-4"
            isLoading={isResetting}
          >
            {isResetting ? 'Resetting Data...' : 'Reset All Mock Data'}
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center mb-4">
          <Power size={28} className="mr-3 text-orange-500" /> Platform Status
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-300">Maintenance Mode</h3>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 mb-3">
            Simulate putting the platform into maintenance mode. Users would typically see a notification banner.
          </p>
          <div className="flex items-center space-x-3">
            <label htmlFor="maintenance-toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="maintenance-toggle" 
                  className="sr-only" 
                  checked={isMaintenanceMode}
                  onChange={toggleMaintenanceMode}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${isMaintenanceMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isMaintenanceMode ? 'translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-gray-700 dark:text-gray-200 font-medium">
                {isMaintenanceMode ? 'Maintenance Mode ON' : 'Maintenance Mode OFF'}
              </div>
            </label>
          </div>
        </div>
      </div>
       <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
          <strong>Note:</strong> All settings here are for demonstration purposes and simulate actions that would occur on a live backend system. Changes are not persistent beyond the current session unless explicitly handled by other mock services (e.g. theme/accent color).
      </div>
    </div>
  );
};

export default PlatformSettingsSection;