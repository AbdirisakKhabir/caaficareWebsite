import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = ({ onAppointmentClick, onNurseAppointmentClick }) => {
  const navigate = useNavigate();

  const handleNurseClick = () => {
    if (onNurseAppointmentClick) {
      onNurseAppointmentClick();
    } else {
      navigate("/nurse-appointment");
    }
  };

  const handleDoctorClick = () => {
    if (onAppointmentClick) {
      onAppointmentClick();
    } else {
      navigate("/appointment");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6CA9F5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6CA9F5]"></span>
              </span>
              <span className="text-[10px] font-bold text-[#6CA9F5] uppercase tracking-widest">
                Available 24/7 in Somalia
              </span>
            </div>

            <h1 className="text-3xl lg:text-6xl font-black text-gray-900 font-poppins leading-[1.1] mb-6">
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6CA9F5] to-blue-400">
                Simplified.
              </span>
            </h1>

            <p className="text-1xl text-gray-500 font-medium leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Experience the future of healthcare. Consult with top-tier doctors
              and book professional nursing care right from your home.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Doctor Button */}
              <button
                onClick={handleDoctorClick}
                className="bg-[#6CA9F5] text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Doctor Visit
              </button>

              {/* Nurse Button */}
              <button
                onClick={handleNurseClick}
                className="bg-white text-gray-800 border-2 border-gray-100 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-[#6CA9F5] hover:text-[#6CA9F5] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Book a Nurse
              </button>
            </div>
          </div>

          {/* Right Visuals - Hidden on mobile and tablet, visible on desktop */}
          <div className="relative order-1 lg:order-2 hidden lg:block">
            <img
              src="/doctor-photo-3.avif"
              alt="Healthcare"
              className="w-full h-[550px] object-cover rounded-[3rem] shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;