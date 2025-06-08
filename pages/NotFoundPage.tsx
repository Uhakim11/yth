
import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-50 dark:bg-gray-900">
      <ExclamationTriangleIcon className="h-24 w-24 text-yellow-500 dark:text-yellow-400 mb-6 animate-bounce" />
      <h1 className="text-6xl font-extrabold text-gray-800 dark:text-white mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Page Not Found</h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Oops! The page you're looking for doesn't seem to exist. It might have been moved, deleted, or maybe you just mistyped the URL.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
    