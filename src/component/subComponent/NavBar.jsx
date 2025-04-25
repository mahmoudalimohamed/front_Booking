// Updated NavBar.jsx for better mobile handling
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut, UserRoundPen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import royallineLogo from '../../assets/logo.svg';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {await logout(); setIsMenuOpen(false);};

  const navLinks = [
    { to: '/', label: 'Home',  },
    { to: '/Destinations', label: 'Destinations', },
    { to: '/about', label: 'About',  },
    { to: '/privacy', label: 'Privacy',  },
    { to: '/contact', label: 'Contact', },
  ];

  if (loading) {
    return (
      <nav className="bg-white shadow-md font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                <img src={royallineLogo} alt="Royal Line Logo" className="h-10 w-auto" />
              </Link>
            </div>
            <div className="flex items-center">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md font-mono text-lg font-bold text-[#A62C2C] p-2">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - Adjusted for mobile */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={royallineLogo} alt="Royal Line Logo" className="h-18 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
            <div className="flex space-x-6">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="border-transparent text-[#A62C2C] hover:border-[#A62C2C] hover:text-[#8B2525] inline-flex items-center px-1 pt-1 border-b-2 text-base font-bold font-mono transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1 bg-[#A62C2C] text-white hover:bg-[#8B2525] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1 bg-[#A62C2C] text-white hover:bg-[#8B2525] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1 bg-[#A62C2C] text-white hover:bg-[#8B2525] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>

                <Link
                  to="/profile"
                  className="inline-flex items-center space-x-1 bg-[#A62C2C] text-white hover:bg-[#8B2525] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <UserRoundPen className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Updated color to match theme */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#A62C2C] hover:text-[#8B2525] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#A62C2C]"
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Fixed positioning for better overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className="block text-[#A62C2C] hover:bg-gray-50 hover:text-[#8B2525] py-2 text-base font-bold font-mono transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="pt-4 pb-3 border-t border-gray-200 px-4">
            <div className="space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-2 px-4 text-center bg-[#A62C2C] text-white rounded-md hover:bg-[#8B2525]"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <UserPlus className="h-5 w-5" />
                      <span>Register</span>
                    </div>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-2 px-4 text-center bg-[#A62C2C] text-white rounded-md hover:bg-[#8B2525]"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogout}
                    className="block w-full py-2 px-4 text-center bg-[#A62C2C] text-white rounded-md hover:bg-[#8B2525]"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </div>
                  </button>

                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-2 px-4 text-center bg-[#A62C2C] text-white rounded-md hover:bg-[#8B2525]"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <UserRoundPen className="h-5 w-5" />
                      <span>Profile</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}