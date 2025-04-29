import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordApi } from '../../api/auth'; 

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get both token and uid from URL parameters
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  useEffect(() => {
    // Check for both token and uid
    if (!token || !uid) {
      setMessage('Invalid or missing reset parameters');
    }
  }, [token, uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await resetPasswordApi(token, uid, password); 
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-mono min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Lock className="h-12 w-12 font-mono text-[#A62C2C] mx-auto" />
        <h2 className="mt-6 text-3xl font-extrabold text-[#A62C2C]">Set new password</h2>
        <p className="mt-2 text-sm text-[#A62C2C]">Enter your new password below.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
                minLength="8" // Add minimum length requirement
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !token || !uid} // Add uid to disable condition
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg bg-[#A62C2C] text-white hover:bg-[#8B2525] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;