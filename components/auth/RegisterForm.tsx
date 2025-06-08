import React, { useState, useEffect } from 'react'; // Removed useContext
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { Link } from 'react-router-dom';
// Removed: import { AlertContext } from '../../contexts/AlertContext'; 
import { useAlert } from '../../hooks/useAlert'; 

const PasswordStrengthIndicator: React.FC<{ password?: string }> = ({ password = '' }) => {
  const [strength, setStrength] = useState({ score: 0, label: 'Too short', color: 'bg-red-500' });

  useEffect(() => {
    let score = 0;
    let label = 'Too short';
    let color = 'bg-red-500';

    if (password.length >= 8) {
      score += 1;
      label = 'Weak';
      color = 'bg-orange-500';
    }
    if (password.length >= 10 && /[A-Z]/.test(password)) {
      score += 1;
    }
    if (password.length >= 10 && /[a-z]/.test(password)) {
      score +=1;
    }
    if (password.length >= 10 && /\d/.test(password)) {
      score += 1;
    }
    if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }
    
    if (score >=4) {
        label = 'Strong';
        color = 'bg-green-500';
    } else if (score >=2 ) {
        label = 'Medium';
        color = 'bg-yellow-500';
    } else if (password.length > 0 && score < 2) {
        label = 'Weak'
        color = 'bg-orange-500'
    }


    setStrength({ score, label, color });
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Password Strength:</span>
        <span className={`text-xs font-medium ${
            strength.score >=4 ? 'text-green-600 dark:text-green-400' : 
            strength.score >=2 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-orange-600 dark:text-orange-400'}`
        }>{strength.label}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div 
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`} 
            style={{ width: `${Math.min(100, (strength.score / 5) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};


const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { addAlert } = useAlert(); // Using the global useAlert hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      addAlert("Passwords do not match.", 'error');
      return;
    }
    if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        addAlert("Password must be at least 8 characters long.", 'error');
        return;
    }

    try {
      const user = await register(name, email, password);
      if (user) {
        addAlert('Registration successful! Welcome!', 'success');
        navigate('/dashboard');
      } else {
        // The error might be set by the AuthContext, or we set a generic one.
        const authError = (localStorage.getItem('authError') || 'Registration failed. Please try again.'); // Check if AuthContext sets a specific error.
        setError(authError);
        addAlert(authError, 'error');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred during registration.';
      setError(errorMessage);
      addAlert(errorMessage, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Create Your Account</h2>
      
      {error && <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}

      <Input
        id="name"
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="John Doe"
        aria-describedby="name-error"
      />
      <Input
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="you@example.com"
        aria-describedby="email-error"
      />
      <div>
        <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            aria-describedby="password-error"
        />
        <PasswordStrengthIndicator password={password} />
      </div>
      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        placeholder="••••••••"
        aria-describedby="confirmPassword-error"
      />
      <Button type="submit" variant="primary" className="w-full" isLoading={loading} size="lg">
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;