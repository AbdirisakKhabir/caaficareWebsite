import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onAppointmentClick, onNurseAppointmentClick, onApplyClick }) => {
  const navLinks = [
    {
      title: 'Appointment',
      subtitle: 'Book an appointment',
      href: '/appointment'
    },
    {
      title: 'Video Consult',
      subtitle: 'Consult qualified doctors',
      href: '/appointment'
    },
    {
      title: 'NurseAppointment',
      subtitle: 'Book nurse services',
      href: '#nurse-appointment',
      onClick: onNurseAppointmentClick
    },
    {
      title: 'Apply',
      subtitle: 'Join our team',
      href: '#apply',
      onClick: onApplyClick
    },
    {
      title: 'About Us',
      subtitle: 'Healthcare simplified',
      href: '/#about-us'
    }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <img 
                src="/caafi.png" 
                alt="Caafi Logo" 
                className="h-16 w-auto hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </Link>
            <div className="h-10 w-px bg-gray-300 ml-4"></div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            {navLinks.map((link, index) => {
              const isRoute = link.href && link.href.startsWith('/');
              if (isRoute) {
                return (
                  <Link
                    key={index}
                    to={link.href}
                    className="flex flex-col hover:opacity-80 transition-all duration-300 cursor-pointer group"
                  >
                    <span className="text-gray-800 font-medium font-poppins text-sm group-hover:text-[#6CA9F5] transition-colors">
                      {link.title}
                    </span>
                    <span className="text-gray-500 font-poppins text-xs group-hover:text-gray-700 transition-colors">
                      {link.subtitle}
                    </span>
                  </Link>
                );
              }

              return (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}
                  className="flex flex-col hover:opacity-80 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-gray-800 font-medium font-poppins text-sm group-hover:text-[#6CA9F5] transition-colors">
                    {link.title}
                  </span>
                  <span className="text-gray-500 font-poppins text-xs group-hover:text-gray-700 transition-colors">
                    {link.subtitle}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-5">
            <Link
              to="/login"
              className="text-[#6CA9F5] font-medium font-poppins hover:opacity-80 transition-opacity"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#6CA9F5] text-white px-5 py-1.5 rounded-full font-medium font-poppins hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
