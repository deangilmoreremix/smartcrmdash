import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Brain, Zap, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import ParticleBackground from '../../components/Landing/ParticleBackground';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { register, error, isLoading, isAuthenticated, clearError } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    setPasswordError('');
    await register(email, password);
  };
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Particle background */}
      <ParticleBackground color="#4f46e5" particleCount={30} speed={0.5} />
      
      {/* Floating icons */}
      <div className="absolute top-20 right-20 opacity-10 animate-float">
        <div className="p-4 bg-white rounded-full shadow-lg">
          <Brain size={30} className="text-indigo-600" />
        </div>
      </div>
      <div className="absolute bottom-20 left-20 opacity-10 animate-float" style={{animationDelay: '1s'}}>
        <div className="p-4 bg-white rounded-full shadow-lg">
          <Shield size={30} className="text-blue-600" />
        </div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg transform transition-all duration-300 hover:scale-110">
              <User size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {(error || passwordError) && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md animate-fade-in">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error || passwordError}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPasswordError('');
                    setPassword(e.target.value);
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    clearError();
                    setPasswordError('');
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-px bg-gray-300 w-12"></div>
            <span className="text-sm text-gray-500">Powered by AI</span>
            <div className="h-px bg-gray-300 w-12"></div>
          </div>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle size={16} className="text-green-500 mr-1" />
              <span>Secure Signup</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle size={16} className="text-green-500 mr-1" />
              <span>Free Trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;