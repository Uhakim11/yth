
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  isAdminLogin?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isAdminLogin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, adminLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const authFn = isAdminLogin ? adminLogin : login;
      const user = await authFn(email, password);
      if (user) {
        navigate(isAdminLogin ? '/admin' : '/dashboard');
      } else {
        setError(isAdminLogin ? 'Admin login failed. Invalid credentials.' : 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        {isAdminLogin ? 'Admin Login' : 'Welcome Back!'}
      </h2>
      
      {error && <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
      
      <Input
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="you@example.com"
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        placeholder="••••••••"
      />
      <Button type="submit" variant="primary" className="w-full" isLoading={loading} size="lg">
        {loading ? 'Signing In...' : (isAdminLogin ? 'Login as Admin' : 'Sign In')}
      </Button>
      {!isAdminLogin && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Sign up
          </Link>
        </p>
      )}
       {isAdminLogin && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Not an admin?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            User Login
          </Link>
        </p>
      )}
    </form>
  );
};

export default LoginForm;
