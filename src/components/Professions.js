import React from "react";
import {
  Stethoscope,
  UserRound,
  Baby,
  HeartPulse,
  Brain,
  Bone,
  Eye,
  Syringe,
  Dna,
  Thermometer,
  ShieldPlus,
  Activity,
} from "lucide-react";

const Professions = () => {
  const medicalProfessions = [
    {
      icon: <Stethoscope size={32} />,
      title: "General Physician",
      desc: "Primary care for everyday health concerns and full body checkups.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: <UserRound size={32} />,
      title: "Nursing Care",
      desc: "Professional home-based nursing, wound care, and recovery support.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: <Baby size={32} />,
      title: "Pediatrician",
      desc: "Specialized medical care for infants, children, and adolescents.",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: <HeartPulse size={32} />,
      title: "Cardiologist",
      desc: "Expert heart health monitoring, blood pressure, and cardiac care.",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      icon: <Brain size={32} />,
      title: "Neurologist",
      desc: "Diagnosing and treating disorders of the brain and nervous system.",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: <Bone size={32} />,
      title: "Orthopedic",
      desc: "Care for bone fractures, joint pains, and musculoskeletal health.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: <Eye size={32} />,
      title: "Ophthalmology",
      desc: "Comprehensive eye exams and treatment for vision disorders.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: <Syringe size={32} />,
      title: "Vaccination",
      desc: "Immunization services for travel, flu, and childhood safety.",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      icon: <Dna size={32} />,
      title: "Lab Specialist",
      desc: "Professional blood tests and diagnostic laboratory analysis.",
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      icon: <Thermometer size={32} />,
      title: "Internal Medicine",
      desc: "Prevention and treatment of complex adult chronic diseases.",
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      icon: <ShieldPlus size={32} />,
      title: "Physiotherapy",
      desc: "Physical rehabilitation and movement therapy for injuries.",
      color: "text-lime-600",
      bg: "bg-lime-50",
    },
    {
      icon: <Activity size={32} />,
      title: "Emergency Care",
      desc: "Immediate 24/7 response for urgent medical requirements.",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-[#6CA9F5] font-black mb-3">
            Our Specialties
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 font-poppins mb-6">
            Find the Right <br />
            <span className="text-[#6CA9F5]">Medical Expert</span>
          </h3>
          <p className="text-gray-500 font-medium">
            Access a wide range of specialized healthcare professionals
            dedicated to your long-term wellbeing and immediate recovery.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicalProfessions.map((prof, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div
                className={`w-16 h-16 ${prof.bg} ${prof.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
              >
                {prof.icon}
              </div>

              {/* Text Content */}
              <h4 className="text-xl font-bold text-gray-800 mb-3 font-poppins">
                {prof.title}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">
                {prof.desc}
              </p>

              {/* Action Link
              <button className="text-xs font-black uppercase tracking-widest text-[#6CA9F5] flex items-center gap-2 group/btn">
                Book Consultation
                <svg
                  className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Professions;
