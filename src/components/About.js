import React from "react";
import { CheckCircle2, Clock, Smartphone, Pill } from "lucide-react";

const About = () => {
  const features = [
    { icon: <Clock className="w-5 h-5" />, text: "24/7 Unlimited Access" },
    {
      icon: <Smartphone className="w-5 h-5" />,
      text: "One-Click Video Consult",
    },
    { icon: <Pill className="w-5 h-5" />, text: "Doorstep Medicine Delivery" },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      text: "Qualified Caregivers",
    },
  ];

  return (
    <section id="about-us" className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Section - Image with Floating Badge */}
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 group-hover:bg-blue-100 transition-colors duration-500" />

            <div className="relative">
              <img
                src="/hero123.png"
                alt="Medical Professional"
                className="w-full max-w-[450px] aspect-[4/5] rounded-[3rem] object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Floating Status Card */}
              <div className="absolute bottom-10 -right-4 lg:-right-10 bg-white p-6 rounded-3xl shadow-2xl border border-blue-50 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#6CA9F5] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      Response Time
                    </p>
                    <p className="text-lg font-black text-gray-800 tracking-tight">
                      Under 5 Mins
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <span className="w-2 h-2 bg-[#6CA9F5] rounded-full animate-pulse" />
                <span className="text-xs font-black text-[#6CA9F5] uppercase tracking-wider">
                  Welcome to CaafiCare
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 font-poppins leading-tight">
                Healthcare that <br />
                <span className="text-[#6CA9F5]">Comes to You</span>
              </h2>

              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                We’ve redefined medical access in Somalia. No more long queues
                or travel stress—reach qualified doctors and professional nurses
                with just one click.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group"
                >
                  <div className="text-[#6CA9F5] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Whether you need a video consultation, a home-visit nurse, or
                medication delivery, Caafi is the only mobile healthcare app
                offering a complete ecosystem—from booking to e-prescriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default About;
