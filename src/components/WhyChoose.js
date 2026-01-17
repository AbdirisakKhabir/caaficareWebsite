import React, { useState, useEffect, useRef } from "react";
import { Video, Star, Clock, Users, Building2, Activity } from "lucide-react";

const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const end = parseInt(target);
    const duration = 2000;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const WhyChoose = () => {
  const stats = [
    {
      icon: Users,
      number: 20,
      title: "Qualified Doctors",
      subtitle: "Verified medical professionals ready to help.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Building2,
      number: 8,
      title: "Partner Hospitals",
      subtitle: "Top-tier facilities across the nation.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      suffix: "+",
    },
    {
      icon: Clock,
      number: 2800,
      title: "Minutes Consulted",
      subtitle: "Quality time spent on patient recovery.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      suffix: "+",
    },
    {
      icon: Activity,
      number: 200,
      title: "Happy Patients",
      subtitle: "Community members trusting our care.",
      color: "text-rose-600",
      bg: "bg-rose-50",
      suffix: "+",
    },
    {
      icon: Video,
      number: 180,
      title: "Video Sessions",
      subtitle: "Virtual consultations completed this year.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      suffix: "+",
    },
    {
      icon: Star,
      number: 200,
      title: "Clinic Appointments",
      subtitle: "Successful in-person visits scheduled.",
      color: "text-violet-600",
      bg: "bg-violet-50",
      suffix: "+",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm uppercase tracking-[0.3em] text-[#6CA9F5] font-black mb-3">
              Our Impact
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 font-poppins leading-tight">
              Why thousands trust <br />
              <span className="text-[#6CA9F5]">Caafi Care</span> everyday
            </h3>
          </div>
          <div className="flex gap-2 pb-2">
            {["Accessible", "Affordable", "Trustworthy"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-100 p-8 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(108,169,245,0.1)] hover:-translate-y-2"
            >
              {/* Icon Box */}
              <div
                className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon size={28} strokeWidth={2.5} />
              </div>

              {/* Counter */}
              <div className="text-5xl font-black text-gray-900 font-poppins mb-2 tracking-tight">
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              </div>

              {/* Text */}
              <h4 className="text-xl font-bold text-gray-800 mb-2 font-poppins">
                {stat.title}
              </h4>
              <p className="text-gray-500 font-medium leading-relaxed">
                {stat.subtitle}
              </p>

              {/* Decorative Arrow */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <Activity size={14} className="text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
