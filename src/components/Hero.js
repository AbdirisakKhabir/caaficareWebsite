import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Section - Text Content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 font-poppins leading-tight">
              Consult with the doctor
              <br />
              <span className="text-[#6CA9F5]">through voice and video</span>
            </h1>
            
            <p className="text-lg text-gray-600 font-poppins leading-relaxed">
              Skip the queue and consult with qualified doctors in the country. Estimate appointment times based on availability.
            </p>
            
            <button className="bg-[#6CA9F5] text-white px-8 py-4 rounded-full font-semibold font-poppins text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
              Book Now
            </button>
          </div>

          {/* Right Section - Image */}
          <div className="relative animate-fade-in-right">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6CA9F5] to-transparent opacity-20 rounded-2xl blur-3xl"></div>
            <img 
              src="/hero1.jpg" 
              alt="Healthcare Professional" 
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
