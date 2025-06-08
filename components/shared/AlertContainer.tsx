import React from 'react';
import { useAlert } from '../../hooks/useAlert';
import AlertMessageItem from './AlertMessageItem';

const AlertContainer: React.FC = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-[100]" // z-index ensures it's on top
    >
      <div className="w-full max-w-sm space-y-3">
        {alerts.map((alert) => (
          <AlertMessageItem
            key={alert.id}
            id={alert.id}
            message={alert.message}
            type={alert.type}
            onDismiss={removeAlert}
          />
        ))}
      </div>
    </div>
  );
};

export default AlertContainer;