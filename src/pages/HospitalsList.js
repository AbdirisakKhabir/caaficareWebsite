import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  HiLocationMarker,
  HiPhone,
  HiChevronLeft,
  HiChevronRight,
  HiSearch,
  HiFilter,
  HiCheckCircle,
  HiHome
} from "react-icons/hi";

// Building Icon Component (since HiBuildingOffice2 doesn't exist)
const BuildingIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
);

const HospitalsList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Pagination state - 8 items per page (2 rows x 4 columns)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://app.caaficare.so/api/hospitals");
        const allHospitals = response.data.data || response.data || [];
        
        setHospitals(allHospitals);
        setFilteredHospitals(allHospitals);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast.error("Failed to load hospitals");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Get unique statuses from hospitals
  const statuses = Array.from(
    new Set(hospitals.map((hospital) => hospital.status).filter(Boolean))
  ).sort();

  // Filter hospitals based on search and status
  useEffect(() => {
    let filtered = hospitals;

    if (searchTerm) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (hospital) => hospital.status === selectedStatus
      );
    }

    setFilteredHospitals(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedStatus, hospitals]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHospitals = filteredHospitals.slice(startIndex, endIndex);

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
          <p className="text-gray-500 text-sm">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-20 from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-4">
            {/* <BuildingIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Medical Facilities</span> */}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Find Hospitals & Clinics
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Discover trusted medical facilities and healthcare centers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospitals by name, address, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#6CA9F5] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
            />
          </div>
          <div className="md:w-48 relative">
            <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#6CA9F5] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer text-sm appearance-none"
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredHospitals.length)}</span> of{" "}
            <span className="font-semibold">{filteredHospitals.length}</span> hospitals
          </span>
        </div>

        {/* Hospitals Grid */}
        {filteredHospitals.length === 0 ? (
          <div className="text-center py-12">
            <BuildingIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg text-gray-500 font-medium">
              No hospitals found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {currentHospitals.map((hospital) => (
                <HospitalCard key={hospital.id} hospital={hospital} />
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

const HospitalCard = ({ hospital }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative">
      {/* Card Container - Different style from Doctors/Nurses */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-purple-200 group-hover:-translate-y-1 h-full flex flex-col">
        {/* Header with Logo */}
        <div className="relative p-6 bg-gradient-to-br from-purple-50 via-purple-100/50 to-white">
          <div className="flex items-center justify-center mb-4">
            {hospital.logo && !imageError ? (
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shadow-md border-2 border-white">
                <img
                  src={hospital.logo}
                  alt={hospital.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-md">
                <BuildingIcon className="w-12 h-12 text-purple-400" />
              </div>
            )}
          </div>
          
          {/* Status Badge */}
          {hospital.status && (
            <div className="absolute top-3 right-3">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  hospital.status === "Active" || hospital.status === "Open"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {hospital.status === "Active" || hospital.status === "Open" ? (
                  <HiCheckCircle className="w-3 h-3" />
                ) : null}
                {hospital.status}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Hospital Name */}
          <h3 className="text-base font-black text-gray-900 mb-3 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
            {hospital.name}
          </h3>

          {/* Details */}
          <div className="space-y-2.5 mb-4 flex-1">
            {hospital.address && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <HiLocationMarker className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{hospital.address}</span>
              </div>
            )}
            
            {/* {hospital.phone && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HiPhone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="line-clamp-1">{hospital.phone}</span>
              </div>
            )} */}
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-gray-100">
            <button className="w-full py-2.5 bg-gradient-to-r from-blue-400 to-blue-400 hover:from-blue-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
    </div>
  );
};

export default HospitalsList;