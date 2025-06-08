import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AlertType } from '../../types';

interface AlertMessageItemProps {
  id: string;
  message: string;
  type: AlertType;
  onDismiss: (id: string) => void;
}

const alertStyles = {
  success: {
    bgColor: 'bg-green-50 dark:bg-green-700/30',
    textColor: 'text-green-700 dark:text-green-300',
    iconColor: 'text-green-500 dark:text-green-400',
    IconComponent: CheckCircleIcon,
  },
  error: {
    bgColor: 'bg-red-50 dark:bg-red-700/30',
    textColor: 'text-red-700 dark:text-red-300',
    iconColor: 'text-red-500 dark:text-red-400',
    IconComponent: XCircleIcon,
  },
  warning: {
    bgColor: 'bg-yellow-50 dark:bg-yellow-700/30',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    IconComponent: ExclamationTriangleIcon,
  },
  info: {
    bgColor: 'bg-blue-50 dark:bg-blue-700/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-500 dark:text-blue-400',
    IconComponent: InformationCircleIcon,
  },
};

const AlertMessageItem: React.FC<AlertMessageItemProps> = ({ id, message, type, onDismiss }) => {
  const { bgColor, textColor, iconColor, IconComponent } = alertStyles[type];
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
  };
  
  useEffect(() => {
    if(isExiting) {
        const timer = setTimeout(() => {
            onDismiss(id);
        }, 300); // Corresponds to toastOutRight animation duration
        return () => clearTimeout(timer);
    }
  }, [isExiting, id, onDismiss]);


  return (
    <div
      role="alert"
      className={`p-4 rounded-lg shadow-xl w-full max-w-sm pointer-events-auto overflow-hidden
                  ${bgColor} ${isExiting ? 'animate-toastOutRight' : 'animate-toastInRight'}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleDismiss}
                className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-opacity-50 hover:bg-gray-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconColor === 'text-green-500' ? 'focus:ring-offset-green-50 dark:focus:ring-offset-green-600 focus:ring-green-600' : 
                                iconColor === 'text-red-500' ? 'focus:ring-offset-red-50 dark:focus:ring-offset-red-600 focus:ring-red-600' :
                                iconColor === 'text-yellow-500' ? 'focus:ring-offset-yellow-50 dark:focus:ring-offset-yellow-600 focus:ring-yellow-600' :
                                'focus:ring-offset-blue-50 dark:focus:ring-offset-blue-600 focus:ring-blue-600'
                            }`}
                aria-label="Dismiss notification"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertMessageItem;