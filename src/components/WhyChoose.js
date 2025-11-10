import React, { useState, useEffect, useRef } from 'react';
import { Video, Star, Clock, Users, Building2 } from 'lucide-react';

const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newCount = Math.min(increment * currentStep, target);
      setCount(Math.floor(newCount));

      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(target);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const WhyChoose = () => {
  const stats = [
    {
      icon: Video,
      number: 400,
      title: "Qualified doctors",
      subtitle: "Providing medical support.",
      bgColor: "bg-blue-500"
    },
    {
      icon: Star,
      number: 80,
      title: "Registered hospitals",
      subtitle: "Actively scheduling visits",
      bgColor: "bg-pink-500",
      suffix: "+"
    },
    {
      icon: Clock,
      number: 28500,
      title: "Minutes of Online Consultations",
      subtitle: "Online Consultations",
      bgColor: "bg-green-500",
      suffix: "+"
    },
    {
      icon: Users,
      number: 42000,
      title: "Registered Users",
      subtitle: "Availing Caafi healthcare services",
      bgColor: "bg-green-500",
      suffix: "+"
    },
    {
      icon: Video,
      number: 850,
      title: "Video Consultations",
      subtitle: "Online healthcare session in 2025",
      bgColor: "bg-blue-500",
      suffix: "+"
    },
    {
      icon: Building2,
      number: 5200,
      title: "Clinic Visit Bookings",
      subtitle: "Successfully scheduled in 2025",
      bgColor: "bg-pink-500",
      suffix: "+"
    }
  ];

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-4">
            Why choose Caafi Care?
          </h2>
          <p className="text-lg text-gray-600 font-poppins">
            Our commitment to accessible healthcare has made a real impact in communities nationwide.
          </p>
        </div>

        {/* Tags */}
        <div className="flex justify-center items-center gap-2 mb-12">
          <span className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 font-poppins">
            Accessible
          </span>
          <span className="text-gray-400">•</span>
          <span className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 font-poppins">
            Affordable
          </span>
          <span className="text-gray-400">•</span>
          <span className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 font-poppins">
            Trustworthy
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-2xl p-6 text-white shadow-lg`}
              >
                <div className="mb-4">
                  <IconComponent className="w-12 h-12" />
                </div>
                <div className="text-4xl font-bold font-poppins mb-2">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix || ''} />
                </div>
                <div className="text-lg font-semibold font-poppins mb-1">
                  {stat.title}
                </div>
                <div className="text-sm opacity-90 font-poppins">
                  {stat.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;

