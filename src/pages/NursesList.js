import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  HiUser, 
  HiBriefcase, 
  HiGlobeAlt,
  HiChevronLeft,
  HiChevronRight,
  HiSearch,
  HiFilter,
  HiLocationMarker
} from "react-icons/hi";

const NursesList = () => {
  const [nurses, setNurses] = useState([]);
  const [filteredNurses, setFilteredNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  // Pagination state - 8 items per page (2 rows x 4 columns)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchNurses = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://app.caaficare.so/api/nurse");
        const allNurses = response.data.data || response.data || [];
        
        // Filter active nurses
        const activeNurses = allNurses.filter((nurse) => 
          nurse.status === "Active" || nurse.status === "Approved"
        );
        
        setNurses(activeNurses);
        setFilteredNurses(activeNurses);
      } catch (error) {
        console.error("Error fetching nurses:", error);
        toast.error("Failed to load nurses");
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  // Get unique locations from filtered nurses
  const locations = Array.from(
    new Set(
      nurses
        .map((nurse) => nurse.district || nurse.city || nurse.location)
        .filter(Boolean)
    )
  ).sort();

  // Filter nurses based on search and location
  useEffect(() => {
    let filtered = nurses;

    if (searchTerm) {
      filtered = filtered.filter(
        (nurse) =>
          nurse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nurse.qualifications?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nurse.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nurse.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (nurse) => 
          nurse.district === selectedLocation ||
          nurse.city === selectedLocation ||
          nurse.location === selectedLocation
      );
    }

    setFilteredNurses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedLocation, nurses]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredNurses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNurses = filteredNurses.slice(startIndex, endIndex);

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
          <p className="text-gray-500 text-sm">Loading nurses...</p>
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
            {/* <HiUser className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Nursing Care</span> */}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Find Your Nurse
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Connect with certified nursing professionals for in-home care services
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search nurses by name, qualifications, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#6CA9F5] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
            />
          </div>
          <div className="md:w-48 relative">
            <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#6CA9F5] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer text-sm appearance-none"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredNurses.length)}</span> of{" "}
            <span className="font-semibold">{filteredNurses.length}</span> nurses
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

        {/* Nurses Grid */}
        {filteredNurses.length === 0 ? (
          <div className="text-center py-12">
            <HiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg text-gray-500 font-medium">
              No nurses found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {currentNurses.map((nurse) => (
                <NurseCard key={nurse.id} nurse={nurse} />
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

const NurseCard = ({ nurse }) => {
  const [imageError, setImageError] = useState(false);

  const isAvailable = nurse.status === "Active" || nurse.status === "Approved";

  return (
    <div className="group relative">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-green-200 group-hover:-translate-y-1 h-full">
        {/* Compact Header */}
        <div className="relative p-8 bg-gradient-to-b from-green-50 to-white">
          {/* Nurse Image with Availability Indicator */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
              {nurse.image && !imageError ? (
                <img
                  src={nurse.image}
                  alt={nurse.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                  <HiUser className="w-10 h-10 text-green-400" />
                </div>
              )}
              {/* Availability Indicator on Image */}
              {isAvailable && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-8 pb-4 px-4">
          {/* Name and Qualifications */}
          <div className="text-center mb-3">
            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
              {nurse.name}
            </h3>
            <p className="text-xs text-green-600 font-semibold line-clamp-1">
              {nurse.qualifications || "Certified Nurse"}
            </p>
          </div>

          {/* Compact Details */}
          <div className="space-y-2 mb-4">
            {nurse.job_experience && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HiBriefcase className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="line-clamp-1">{nurse.job_experience}</span>
              </div>
            )}
            {(nurse.district || nurse.city || nurse.location) && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HiLocationMarker className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="line-clamp-1">
                  {nurse.district || nurse.city || nurse.location}
                </span>
              </div>
            )}
            {nurse.languages && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HiGlobeAlt className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="line-clamp-1">{nurse.languages}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-gray-100">
            <button className="w-full py-2 bg-gradient-to-r from-blue-400 to-blue-400 hover:from-blue-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md">
              Book Nurse
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
    </div>
  );
};

export default NursesList;