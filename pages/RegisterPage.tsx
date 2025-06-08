
import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-gray-900 dark:to-black px-4 py-12">
      <Link to="/" className="absolute top-6 left-6 text-blue-600 dark:text-blue-400 hover:underline">
        &larr; Back to Home
      </Link>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
    