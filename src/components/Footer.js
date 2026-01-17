import React, { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  MessageCircle,
} from "lucide-react";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0F172A] text-gray-300 pt-20 pb-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6CA9F5] opacity-[0.03] rounded-full blur-[100px] -mb-48 -mr-48" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <img
              src="/caafi.png"
              alt="Caafi Logo"
              className="h-16 w-auto brightness-0 invert"
            />
            <p className="text-sm leading-relaxed text-gray-400 font-medium">
              Revolutionizing healthcare in Somalia through accessible,
              one-click medical consultations and professional home-based
              nursing care.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Linkedin, MessageCircle].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#6CA9F5] hover:text-white transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg font-poppins">
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#6CA9F5] group-hover:bg-[#6CA9F5] group-hover:text-white transition-colors">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-medium">+252 61 9006649 </span>
              </li>
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#6CA9F5] group-hover:bg-[#6CA9F5] group-hover:text-white transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-medium">info@caaficare.so</span>
              </li>
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#6CA9F5] group-hover:bg-[#6CA9F5] group-hover:text-white transition-colors">
                  <MapPin size={16} />
                </div>
                <span className="text-sm font-medium text-gray-400">
                  Mogadishu, Somalia
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg font-poppins">
              Company
            </h4>
            <ul className="grid grid-cols-1 gap-3">
              {[
                "About Us",
                "Medical Services",
                "Our Doctors",
                "Nursing Care",
                "Privacy Policy",
                "Terms of Use",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm font-medium hover:text-[#6CA9F5] transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* App Column */}
          {/* App Column */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg font-poppins tracking-tight">
              Download App
            </h4>
            <p className="text-sm text-gray-400 font-medium">
              Access healthcare on the go with our mobile applications.
            </p>
            <div className="space-y-4">
              {/* Google Play Button */}
              <a
                href="#"
                className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all w-full group"
              >
                <div className="text-white group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest leading-none mb-1">
                    Get it on
                  </p>
                  <p className="text-base font-bold text-white leading-none font-poppins">
                    Google Play
                  </p>
                </div>
              </a>

              {/* App Store Button */}
              <a
                href="#"
                className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all w-full group"
              >
                <div className="text-white group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest leading-none mb-1">
                    Download on the
                  </p>
                  <p className="text-base font-bold text-white leading-none font-poppins">
                    App Store
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 font-medium">
            Copyright © {new Date().getFullYear()}{" "}
            <span className="text-white">CaafiCare</span>. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Modern Floating Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-[#6CA9F5] text-white rounded-2xl shadow-2xl shadow-blue-500/40 flex items-center justify-center transition-all duration-500 z-50 hover:-translate-y-2 active:scale-90 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20 pointer-events-none"
        }`}
      >
        <ArrowUp size={24} strokeWidth={3} />
        <div className="absolute inset-0 rounded-2xl bg-[#6CA9F5] animate-ping opacity-20 -z-10" />
      </button>
    </footer>
  );
};

export default Footer;
