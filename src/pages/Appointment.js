import React, { useMemo, useState } from "react";
import { Search, Stethoscope, Building2, ShieldCheck } from "lucide-react";

const mockHospitals = [
  {
    id: 1,
    name: "Caafi General Hospital",
    specialties: ["Cardiology", "Pediatrics"],
    doctors: 45,
    rating: 4.6,
    location: "Mogadishu",
  },
  {
    id: 2,
    name: "Somali City Clinic",
    specialties: ["Dermatology", "ENT"],
    doctors: 18,
    rating: 4.2,
    location: "Muqdisho",
  },
  {
    id: 3,
    name: "Hope Medical Center",
    specialties: ["Orthopedics", "Neurology"],
    doctors: 32,
    rating: 4.4,
    location: "Kismayo",
  },
  {
    id: 4,
    name: "Baraawe Care Hospital",
    specialties: ["Gynecology", "Oncology"],
    doctors: 27,
    rating: 4.1,
    location: "Baraawe",
  },
  {
    id: 5,
    name: "Ocean View Hospital",
    specialties: ["Cardiology", "General Surgery"],
    doctors: 22,
    rating: 4.3,
    location: "Boosaso",
  },
];

const allSpecialties = Array.from(
  new Set(mockHospitals.flatMap((h) => h.specialties)),
).sort();

const Appointment = () => {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");

  const filteredHospitals = useMemo(() => {
    return mockHospitals.filter((h) => {
      const matchQuery = query
        ? h.name.toLowerCase().includes(query.toLowerCase()) ||
          h.location.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchSpecialty = specialty
        ? h.specialties.includes(specialty)
        : true;
      return matchQuery && matchSpecialty;
    });
  }, [query, specialty]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
          Book an appointment
        </h1>
        <p className="text-gray-600 font-poppins">
          Choose a hospital or search by specialty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospital or city..."
            className="w-full outline-none bg-transparent text-gray-800 font-poppins placeholder:text-gray-400"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-800 font-poppins"
        >
          <option value="">All specialties</option>
          {allSpecialties.map((sp) => (
            <option key={sp} value={sp}>
              {sp}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-10 h-10 text-[#bf3a6f]" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-poppins">
                    {h.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-poppins">
                    {h.location}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-1 text-amber-500 text-sm font-poppins"
                aria-label="rating"
              >
                <span>★</span>
                <span>{h.rating}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {h.specialties.map((sp) => (
                <span
                  key={sp}
                  className="px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-700 font-poppins"
                >
                  {sp}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 font-poppins mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Qualified
                doctors: {h.doctors}
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" /> Appointments
                available
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <a
                href="#"
                className="flex-1 text-center bg-[#6CA9F5] text-white px-4 py-2 rounded-lg font-poppins hover:opacity-90 transition-opacity"
              >
                Book now
              </a>
              <a
                href="#"
                className="flex-1 text-center border border-[#6CA9F5] text-[#6CA9F5] px-4 py-2 rounded-lg font-poppins hover:bg-gray-50"
              >
                View details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointment;
