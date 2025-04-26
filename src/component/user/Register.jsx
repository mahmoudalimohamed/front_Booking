import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Phone, Lock, User, Loader2 } from 'lucide-react';
import {registerApi} from '../../api/auth'; // Adjust the import path as necessary
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      password: '',
    },
  });

  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await registerApi(data);
      setMessage('Registration successful!');
      navigate('/login');
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data);
      if (error.response?.data) {
        Object.keys(error.response.data).forEach((field) => {
          setError(field, {
            type: 'server',
            message: error.response.data[field][0],
          });
        });
        setMessage('Registration failed.');
      } else {
        setMessage('Error: Something went wrong.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ id, label, icon: Icon, type = 'text', placeholder, validation, error }) => (
    <div className='font-mono'>
      <label htmlFor={id} className="block text-sm font-medium text-[#A62C2C]">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-[#A62C2C]" aria-hidden="true" />
        </div>
        <input
          id={id}
          type={type}
          className={`block w-full pl-10 pr-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
          } focus:border-transparent transition duration-150 ease-in-out sm:text-sm`}
          placeholder={placeholder}
          {...register(id, validation)}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 font-mono text-[#A62C2C]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-mono text-[#A62C2C]">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm font-mono text-[#A62C2C] ">
          Already have an account?{' '}
          <Link to="/login" className="font-medium font-mono  text-indigo-600 hover:text-indigo-500 text-lg">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              id="name"
              label=""
              icon={User}
              placeholder="Your name"
              validation={{ required: 'Name is required' }}
              error={errors.name}
            />

            <InputField
              id="email"
              label=""
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              validation={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              }}
              error={errors.email}
            />

            <InputField
              id="phone_number"
              label=""
              icon={Phone}
              placeholder="11-digit phone number"
              validation={{
                required: 'Phone number is required',
                pattern: {
                  value: /^\d{11}$/,
                  message: 'Phone number must be exactly 11 digits',
                },
              }}
              error={errors.phone_number}
            />

            <InputField
              id="password"
              label=""
              icon={Lock}
              type="password"
              placeholder="••••••••"
              validation={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
              error={errors.password}
            />

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg bg-[#A62C2C] text-white hover:bg-[#8B2525] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                message.includes('successful')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;