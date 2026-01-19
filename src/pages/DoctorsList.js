import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  HiVideoCamera, 
  HiUser, 
  HiCurrencyDollar, 
  HiBriefcase, 
  HiGlobeAlt,
  HiChevronLeft,
  HiChevronRight,
  HiStar,
  HiClock,
  HiSearch,
  HiFilter,
  HiMail,
  HiOfficeBuilding,
  HiPhone,
} from "react-icons/hi";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  
  // Pagination state - 8 items per page (2 rows x 4 columns)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://app.caaficare.so/api/doctor");
        const allDoctors = response.data.data || response.data || [];
        
        // Filter doctors where type is "Video Consulting" or contains "Video Consulting"
        const videoDoctors = allDoctors.filter((doctor) => {
          const doctorType = doctor.type || "";
          return (
            doctorType === "Video Consulting" ||
            doctorType.includes("Video Consulting")
          );
        });
        
        setDoctors(videoDoctors);
        setFilteredDoctors(videoDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Get unique specialties from filtered doctors
  const specialties = Array.from(
    new Set(doctors.map((doctor) => doctor.profession).filter(Boolean))
  ).sort();

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(
        (doctor) => doctor.profession === selectedSpecialty
      );
    }

    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedSpecialty, doctors]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6CA9F5] mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-20 from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            {/* <HiVideoCamera className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Video Consultation</span> */}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Find Your Specialist
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Connect instantly with certified doctors for virtual consultations
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#6CA9F5] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
            />
          </div>
          <div className="md:w-48 relative">
            <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#6CA9F5] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer text-sm appearance-none"
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredDoctors.length)}</span> of{" "}
            <span className="font-semibold">{filteredDoctors.length}</span> doctors
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Available
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              Busy
            </span>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <HiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg text-gray-500 font-medium">
              No doctors found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {currentDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100 hover:text-[#6CA9F5]"
                    }`}
                  >
                    <HiChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === "..." ? (
                          <span className="px-2 text-gray-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
                              currentPage === page
                                ? "bg-[#6CA9F5] text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100 hover:text-[#6CA9F5]"
                    }`}
                  >
                    <HiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
const DoctorCard = ({ doctor }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/doctor-appointment", {
      state: {
        doctor: doctor,
        appointmentType: "Video Consulting",
      },
    });
  };

  const getTypeBadge = () => {
    if (doctor.type === "Video Consulting") {
      return (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-[10px] font-semibold shadow-sm z-20">
          <HiVideoCamera className="w-3 h-3" />
          <span>Video Only</span>
        </div>
      );
    } else if (doctor.type?.includes("Video Consulting")) {
      return (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-[10px] font-semibold shadow-sm z-20">
          <HiVideoCamera className="w-3 h-3" />
          <span>Video & In-Person</span>
        </div>
      );
    }
    return null;
  };

  const isAvailable = doctor.availability_status === "Active";

  return (
    <div className="group relative">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-blue-200 group-hover:-translate-y-1 h-full flex flex-col">
        {/* Header with Image */}
        <div className="relative p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-white">
          {/* {getTypeBadge()} */}
          
          {/* Doctor Image Container */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                {doctor.image && !imageError ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <HiUser className="w-12 h-12 text-blue-400" />
                  </div>
                )}
              </div>
              
              {/* Availability Indicator in front of the circle */}
              {isAvailable && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center z-10">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Name and Profession */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-black text-gray-900 mb-1 line-clamp-1">
              {doctor.name}
            </h3>
            <p className="text-sm text-blue-600 font-bold flex items-center justify-center gap-1">
              <HiBriefcase className="w-4 h-4" />
              {doctor.profession || "Medical Professional"}
            </p>
          </div>

          {/* Bio */}
          {doctor.bio && (
            <p className="text-xs text-gray-600 mb-4 line-clamp-2 text-center leading-relaxed">
              {doctor.bio}
            </p>
          )}

          {/* Details Section */}
          <div className="space-y-2 mb-4 flex-1">
            {doctor.job_experience && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <HiBriefcase className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">Years of Experience: {doctor.job_experience}</span>
              </div>
            )}

            {doctor.languages && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <HiGlobeAlt className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{doctor.languages}</span>
              </div>
            )}

            {doctor.hospital?.name && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <HiOfficeBuilding className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{doctor.hospital.name}</span>
              </div>
            )}

  

            {doctor.email && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <HiMail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1 truncate">{doctor.email}</span>
              </div>
            )}
          </div>

          {/* Pricing Section */}
          <div className="pt-4 border-t border-gray-100 mb-4">
            <div className="space-y-2">
              {doctor.card_price && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiVideoCamera className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Video Consult</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                 
                    <span className="text-lg font-black text-blue-600">
                      ${doctor.card_price}
                    </span>
                  </div>
                </div>
              )}
              {doctor.appointment_price && doctor.type?.includes("Appointment") && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">In-Person</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <HiCurrencyDollar className="w-4 h-4 text-gray-600" />
                    <span className="text-base font-bold text-gray-700">
                      {doctor.appointment_price}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status and Action */}
          <div className="space-y-2">
            {/* {doctor.availability_status && (
              <div className="text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    doctor.availability_status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {doctor.availability_status}
                </span>
              </div>
            )} */}
            
            <button 
              onClick={handleBookAppointment}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
    </div>
  );
};
export default DoctorsList;