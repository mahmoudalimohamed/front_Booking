import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import royallineLogo from '../../assets/logo.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  const quickLinks = [
    { to: '/Destinations', label: 'Destinations' },
    { to: '/about', label: 'About' },
    { to: '/privacy', label: 'Privacy' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#A62C2C] font-mono">
        <div className="flex flex-col items-center space-y-6 md:flex-row md:justify-between md:items-center md:space-y-0">

          {/* Logo and Social Links */}
          <div className="flex flex-col items-center md:items-start space-y-4 w-full md:w-auto">
            <Link to="/" className="flex items-center justify-center md:justify-start">
              <img src={royallineLogo} alt="Royal Line Logo" className="h-14 w-auto" />
            </Link>
            <div className="flex space-x-6 mt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A62C2C] hover:text-red-700 transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-center md:flex md:space-x-6">
            {quickLinks.map(({ to, label }) => (
              <Link 
                key={to} 
                to={to}
                className="text-[#A62C2C] hover:text-red-700 text-lg transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[#A62C2C] text-lg mt-4 md:mt-0">© {currentYear} Maher</p>
        </div>
      </div>
    </footer>
  );
}