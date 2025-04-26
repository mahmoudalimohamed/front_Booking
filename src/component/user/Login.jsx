import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use auth context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setMessage(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="font-mono min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <LogIn className="h-12 w-12 text-[#A62C2C] mx-auto" />
        <h2 className="mt-6 text-3xl font-extrabold text-[#A62C2C] font-mono">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-[#A62C2C] font-mono">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium font-mono text-lg"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            id="email"
            name="email"
            label=""
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            id="password"
            name="password"
            label=""
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            togglePassword={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg bg-[#A62C2C] text-white hover:bg-[#8B2525] font-mono text-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-2 text-center text-sm font-mono text-[#A62C2C]">
          Forgot your password?{" "}
          <Link
            to="/forgot-password"
            className="text-indigo-600 hover:text-indigo-500 font-medium font-mono text-lg"
          >
            Reset it
          </Link>
        </p>

        {message && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({
  id,
  label,
  icon: Icon,
  type,
  placeholder,
  name,
  value,
  onChange,
  togglePassword,
  showPassword,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
      />
      {name === "password" && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={togglePassword}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      )}
    </div>
  </div>
);

export default Login;
