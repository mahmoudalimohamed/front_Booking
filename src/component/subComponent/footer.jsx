import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart} from 'lucide-react';
import royallineLogo from '../../assets/logo.svg'; // Import the logo

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  const quickLinks = [
    { to: '/Destinations', label: 'Destinations', },
    { to: '/about', label: 'About',  },
    { to: '/privacy', label: 'Privacy',  },
    { to: '/contact', label: 'Contact', },
   
   
  ];

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#A62C2C] font-mono">
        <div className=" text-[#A62C2C] flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

          {/* Logo and Social Links */}
          <div className="flex flex-col items-center md:items-start space-y-3 text-[#A62C2C] font-mono">
            <Link to="/" className="flex items-center space-x-2 ml-8">
               <img src={royallineLogo} alt="Royal Line Logo" className="h-15 w-auto " /> 
            </Link>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A62C2C] font-mono transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-6 text-[#A62C2C] font-mono">
            {quickLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-[#A62C2C] font-mono text-lg transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[#A62C2C] font-mono text-lg"> © {currentYear} Maher </p>
        </div>
      </div>
    </footer>
  );
}