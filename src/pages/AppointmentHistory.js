import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";
import {
  HiCalendar,
  HiClock,
  HiUser,
  HiPhone,
  HiCheckCircle,
  HiXCircle,
  HiClock as HiPending,
  HiArrowLeft,
  HiVideoCamera,
} from "react-icons/hi";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, canceled

  useEffect(() => {
    const fetchAppointments = async () => {
      const customer = JSON.parse(localStorage.getItem("customer"));
      
      if (!customer || !customer.id) {
        toast.error("Please login to view appointment history");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://app.caaficare.so/api/appointments/history?customer_id=${customer.id}`
        );
        
        if (response.data.success) {
          setAppointments(response.data.data || []);
        } else {
          toast.error("Failed to load appointment history");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointment history");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    
    const statusLower = apt.status?.toLowerCase() || "";
    
    if (filter === "pending") {
      // Include "Scheduled" status as pending
      return statusLower === "pending" || statusLower === "scheduled";
    }
    
    if (filter === "approved") {
      return statusLower === "approved" || statusLower === "completed";
    }
    
    if (filter === "canceled") {
      return statusLower === "canceled" || statusLower === "cancelled";
    }
    
    return statusLower === filter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    
    switch (statusLower) {
      case "approved":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <HiCheckCircle className="w-4 h-4" />
            Completed
          </span>
        );
      case "canceled":
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            <HiXCircle className="w-4 h-4" />
            Canceled
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            <HiPending className="w-4 h-4" />
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            <HiPending className="w-4 h-4" />
            {status || "Pending"}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    // Handle both Date objects and strings
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    // If time is already formatted (contains AM/PM), return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }
    
    // Handle time in HH:MM format (24-hour)
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      if (isNaN(hour)) return timeString;
      
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    }
    
    return timeString;
  };

  const getAppointmentType = (appointment) => {
    if (appointment.doctor) {
      return {
        type: "Doctor",
        name: appointment.doctor.name.startsWith("Dr") 
          ? appointment.doctor.name 
          : `Dr. ${appointment.doctor.name}`,
        profession: appointment.doctor.profession,
        phone: appointment.doctor.phone,
      };
    } else if (appointment.nurse) {
      return {
        type: "Nurse",
        name: appointment.nurse.name,
        profession: "Nursing Care",
        phone: appointment.nurse.phone,
      };
    }
    return {
      type: "Service",
      name: appointment.service?.serviceName || "Service",
      profession: "Healthcare Service",
      phone: null,
    };
  };

  // Count appointments by status
  const getStatusCount = (statusFilter) => {
    if (statusFilter === "all") return appointments.length;
    
    return appointments.filter((apt) => {
      const statusLower = apt.status?.toLowerCase() || "";
      
      if (statusFilter === "pending") {
        return statusLower === "pending" || statusLower === "scheduled";
      }
      
      if (statusFilter === "approved") {
        return statusLower === "approved" || statusLower === "completed";
      }
      
      if (statusFilter === "canceled") {
        return statusLower === "canceled" || statusLower === "cancelled";
      }
      
      return statusLower === statusFilter.toLowerCase();
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          onAppointmentClick={() => navigate("/appointment")}
          onNurseAppointmentClick={() => navigate("/nurses-list")}
          onApplyNurseClick={() => {}}
          onApplyDoctorClick={() => {}}
        />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Spinner size="xl" />
                <p className="mt-4 text-gray-500">Loading appointment history...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAppointmentClick={() => navigate("/appointment")}
        onNurseAppointmentClick={() => navigate("/nurses-list")}
        onApplyNurseClick={() => {}}
        onApplyDoctorClick={() => {}}
      />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="text-sm font-bold">Back to Home</span>
            </button>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Appointment History
            </h1>
            <p className="text-gray-500">
              View all your past and upcoming appointments
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
              }`}
            >
              All ({getStatusCount("all")})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                filter === "pending"
                  ? "bg-yellow-500 text-white shadow-lg shadow-yellow-200"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-300"
              }`}
            >
              Scheduled ({getStatusCount("pending")})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                filter === "approved"
                  ? "bg-green-500 text-white shadow-lg shadow-green-200"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300"
              }`}
            >
              Completed ({getStatusCount("approved")})
            </button>
            <button
              onClick={() => setFilter("canceled")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                filter === "canceled"
                  ? "bg-red-500 text-white shadow-lg shadow-red-200"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300"
              }`}
            >
              Canceled ({getStatusCount("canceled")})
            </button>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiCalendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                No Appointments Found
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === "all"
                  ? "You don't have any appointments yet."
                  : `No ${filter} appointments found.`}
              </p>
              <button
                onClick={() => navigate("/doctors")}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const appointmentInfo = getAppointmentType(appointment);
                return (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left: Appointment Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">
                              {appointmentInfo.type} Appointment
                            </h3>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-500">
                                {appointmentInfo.profession}
                              </p>
                              {appointment.appointmentType && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                                    <HiVideoCamera className="w-3 h-3" />
                                    {appointment.appointmentType}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                              <HiUser className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                                {appointmentInfo.type}
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {appointmentInfo.name}
                              </p>
                            </div>
                          </div>

                          {appointmentInfo.phone && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <HiPhone className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                                  Contact
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                  {appointmentInfo.phone}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                              <HiCalendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                                Date
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {formatDate(appointment.appointmentDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                              <HiClock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                                Time
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {formatTime(appointment.appointmentTime)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {appointment.patientName && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                              Patient Information
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <span className="text-gray-700">
                                <span className="font-bold">Name:</span> {appointment.patientName}
                              </span>
                              {appointment.patientAge && (
                                <span className="text-gray-700">
                                  <span className="font-bold">Age:</span> {appointment.patientAge}
                                </span>
                              )}
                              {appointment.patientGender && (
                                <span className="text-gray-700">
                                  <span className="font-bold">Gender:</span> {appointment.patientGender}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {appointment.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                              Notes
                            </p>
                            <p className="text-sm text-gray-700">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AppointmentHistory;