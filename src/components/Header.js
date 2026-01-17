import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";

const Header = ({
  onAppointmentClick,
  onNurseAppointmentClick,
  onApplyNurseClick,
  onApplyDoctorClick,
}) => {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("customer");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsApplyOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target))
        setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    {
      title: "Appointment",
      subtitle: "Book a doctor",
      onClick: onAppointmentClick,
    },
    {
      title: "Nursing Care",
      subtitle: "In-home services",
      onClick: onNurseAppointmentClick,
    },
    {
      title: "Join Our Team",
      subtitle: "Apply as specialist",
      isDropdown: true,
    },
    {
      title: "About Us",
      subtitle: "Our mission",
      href: "/#about-us",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        scrolled || isMobileMenuOpen
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <img
              src="/caafi.png"
              alt="Logo"
              className="h-12 w-auto transition-transform active:scale-95"
            />
            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link, idx) => (
              <div
                key={idx}
                className="relative"
                ref={link.isDropdown ? dropdownRef : null}
              >
                {link.isDropdown ? (
                  <button
                    onClick={() => setIsApplyOpen(!isApplyOpen)}
                    className="flex flex-col items-start group py-1"
                  >
                    <span className="text-gray-800 text-sm font-bold group-hover:text-[#6CA9F5] flex items-center gap-1 transition-colors">
                      {link.title}
                      <HiChevronDown
                        className={`transition-transform duration-300 ${
                          isApplyOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {link.subtitle}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (link.onClick) {
                        link.onClick();
                      } else if (link.href?.startsWith("/#")) {
                        window.location.href = link.href;
                      } else if (link.href) {
                        navigate(link.href);
                      }
                    }}
                    className="flex flex-col items-start group py-1"
                  >
                    <span className="text-gray-800 text-sm font-bold group-hover:text-[#6CA9F5] transition-colors">
                      {link.title}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium group-hover:text-gray-500 transition-colors">
                      {link.subtitle}
                    </span>
                  </button>
                )}

                {/* Apply Dropdown */}
                {link.isDropdown && isApplyOpen && (
                  <div className="absolute top-full left-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        onApplyNurseClick();
                        setIsApplyOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-[#6CA9F5] transition-colors"
                    >
                      Apply as Nurse
                    </button>
                    <button
                      onClick={() => {
                        onApplyDoctorClick();
                        setIsApplyOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-[#6CA9F5] transition-colors"
                    >
                      Apply as Doctor
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* USER ACTIONS & MOBILE TOGGLE */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-4 bg-gray-50 border border-gray-100 rounded-full hover:bg-white hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6CA9F5] to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-black text-gray-800 leading-none">
                    {user.full_name?.split(" ")[0]}
                  </p>
                  <p className="text-[9px] text-blue-500 font-bold uppercase mt-0.5 tracking-tighter">
                    Verified Patient
                  </p>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 z-[70] animate-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-gray-50 mb-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                      Account
                    </p>
                    <p className="text-xs font-bold text-gray-700 truncate">
                      {user.phone}
                    </p>
                  </div>
                  <Link
                    to="/appointments"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                  >
                    My History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-[#6CA9F5] transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-[#6CA9F5] text-white text-sm font-black rounded-full shadow-lg shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 transition-all"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Hamburger Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl bg-gray-50 text-gray-600 active:scale-90 transition-all"
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[90vh] opacity-100 py-6"
            : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-6 space-y-3">
          {navLinks.map((link, idx) => (
            <div key={idx}>
              {link.isDropdown ? (
                <div className="bg-gray-50 rounded-3xl p-5 mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Team Applications
                  </span>
                  <div className="flex flex-col gap-4 mt-4">
                    <button
                      onClick={() => {
                        onApplyNurseClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left font-bold text-gray-700 hover:text-[#6CA9F5]"
                    >
                      Nurse Enrollment
                    </button>
                    <button
                      onClick={() => {
                        onApplyDoctorClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left font-bold text-gray-700 hover:text-[#6CA9F5]"
                    >
                      Doctor Enrollment
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (link.onClick) {
                      link.onClick();
                    } else if (link.href) {
                      navigate(link.href);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex flex-col items-start px-4 py-3 hover:bg-blue-50 rounded-2xl transition-all"
                >
                  <span className="text-base font-black text-gray-800">
                    {link.title}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {link.subtitle}
                  </span>
                </button>
              )}
            </div>
          ))}

          {!user && (
            <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 text-center font-black text-gray-600 bg-gray-50 rounded-2xl"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 text-center font-black text-white bg-blue-600 rounded-2xl shadow-xl shadow-blue-200"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;