import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiCheckCircle,
  HiX,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Custom Styled Input Component
const CustomInput = ({ label, ...props }) => (
  <div className="flex flex-col items-start w-full space-y-1.5">
    {label && (
      <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider text-left">
        {label}
      </label>
    )}
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 text-sm transition-all
      focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none
      placeholder:text-gray-400 shadow-sm text-left ${props.className || ""}`}
    />
  </div>
);

// Custom Styled Select Component
const CustomSelect = ({ label, children, ...props }) => (
  <div className="flex flex-col items-start w-full space-y-1.5">
    {label && (
      <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider text-left">
        {label}
      </label>
    )}
    <select
      {...props}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 text-sm transition-all
      focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm cursor-pointer text-left"
    >
      {children}
    </select>
  </div>
);

const DoctorAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctor, appointmentType } = location.state || {};
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  // Generate available dates (Today, Tomorrow, and next 7 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const availableDates = generateDates();

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    // Morning slots (11:00 AM - 11:45 AM)
    for (let hour = 11; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.morning.push({
          time,
          display: formatTime(hour, minute),
          available: Math.random() > 0.3, // Random availability for demo
        });
      }
    }

    // Afternoon slots (12:00 PM - 3:45 PM)
    for (let hour = 12; hour < 16; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.afternoon.push({
          time,
          display: formatTime(hour, minute),
          available: Math.random() > 0.3,
        });
      }
    }

    // Evening slots (4:00 PM - 9:45 PM)
    for (let hour = 16; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.evening.push({
          time,
          display: formatTime(hour, minute),
          available: Math.random() > 0.3,
        });
      }
    }

    return slots;
  };

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const [timeSlots] = useState(generateTimeSlots());

  // Get available slots count for a date
  const getAvailableSlotsCount = (dateIndex) => {
    const allSlots = [
      ...timeSlots.morning,
      ...timeSlots.afternoon,
      ...timeSlots.evening,
    ];
    return allSlots.filter((slot) => slot.available).length;
  };

  // Format date display
  const formatDateDisplay = (date, index) => {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const loggedInUser = localStorage.getItem("customer");

      if (!loggedInUser) {
        toast.error("Please login to book an appointment");
        navigate("/login");
        return;
      }

      try {
        const [hospitalsRes, specialtiesRes] = await Promise.all([
          axios.get("https://app.caaficare.so/api/hospitals"),
          axios.get("https://app.caaficare.so/api/doctor/specialties"),
        ]);
        setHospitals(hospitalsRes.data.data || []);
        setSpecialties(specialtiesRes.data.data || []);
      } catch (error) {
        toast.error("Failed to load appointment data");
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  // Pre-fill form if doctor is passed from DoctorsList
  useEffect(() => {
    if (doctor) {
      formik.setFieldValue("doctor_id", doctor.id);
      formik.setFieldValue("appointmentType", appointmentType || "Video Consulting");
      formik.setFieldValue("hospital_id", doctor.hospital_id || "");
      formik.setFieldValue("specialty", doctor.profession || "");
    }
  }, [doctor, appointmentType]);

  const formik = useFormik({
    initialValues: {
      patientName: "",
      patientPhone: "",
      patientAge: "",
      patientGender: "",
      appointmentType: appointmentType || "",
      appointmentDate: "",
      shift: "",
      appointmentTime: "",
      status: "Scheduled",
      customer_id: "",
      doctor_id: doctor?.id || "",
      hospital_id: doctor?.hospital_id || "",
      specialty: doctor?.profession || "",
      notes: "",
    },
    validationSchema: Yup.object({
      patientName: Yup.string().required("Required"),
      patientPhone: Yup.string().required("Required"),
      patientAge: Yup.number().required("Required").positive().integer(),
      patientGender: Yup.string().required("Required"),
      appointmentType: Yup.string().required("Required"),
      hospital_id: Yup.string().required("Required"),
      appointmentDate: Yup.date().required("Required"),
      doctor_id: Yup.string().required("Required"),
      appointmentTime: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const customer = JSON.parse(localStorage.getItem("customer"));
        const payload = { ...values, customer_id: customer?.id };
        const res = await axios.post(
          "https://app.caaficare.so/api/appointment",
          payload,
        );
        if (res.data.success) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate("/");
            formik.resetForm();
          }, 2500);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Booking failed");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const selectedDoctor = doctor || doctors.find((d) => d.id == formik.values.doctor_id);

  const handleDateSelect = (date, index) => {
    setSelectedDate(date);
    setCurrentDateIndex(index);
    const dateString = date.toISOString().split("T")[0];
    formik.setFieldValue("appointmentDate", dateString);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    formik.setFieldValue("appointmentTime", time);
  };

  const navigateDates = (direction) => {
    if (direction === "prev" && currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
    } else if (direction === "next" && currentDateIndex < availableDates.length - 3) {
      setCurrentDateIndex(currentDateIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAppointmentClick={() => navigate("/appointment")}
        onNurseAppointmentClick={() => navigate("/nurse-appointment")}
        onApplyNurseClick={() => {}}
        onApplyDoctorClick={() => {}}
      />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {isSuccess ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-12 text-center">
              <HiCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                Success!
              </h2>
              <p className="text-gray-500 text-lg mb-6">
                Your appointment is scheduled successfully.
              </p>
              <p className="text-sm text-gray-400">
                Redirecting you to home page...
              </p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* LEFT PANEL - Summary */}
                <div className="w-full lg:w-auto bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12 text-white flex flex-col justify-between">
                  <div className="text-left">
                    <div className="bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-6">
                      CaafiCare Portal
                    </div>
                    <h2 className="text-3xl font-black leading-tight mb-2">
                      Secure Online Booking
                    </h2>
                    <p className="text-blue-100/70 text-sm mb-8">
                      Expert clinical care selection.
                    </p>

                    {selectedDoctor && (
                      <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-left">
                        <p className="text-[10px] font-bold text-blue-200 uppercase mb-4">
                          Selected Specialist
                        </p>
                        <h4 className="text-xl font-bold italic">
                          Dr. {selectedDoctor.name}
                        </h4>
                        <p className="text-xs text-blue-100 mb-6">
                          {selectedDoctor.profession}
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <span className="text-xs opacity-60">
                            Consultation Fee
                          </span>
                          <span className="text-2xl font-black">
                            ${selectedDoctor.card_price || selectedDoctor.appointment_price}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT PANEL - Form */}
                <div className="lg:col-span-2 bg-white p-8 lg:p-12 overflow-y-auto">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="space-y-8 text-left"
                  >
                    {/* Patient Identity */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-600">
                        <HiOutlineUser className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Patient Profile
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <CustomInput
                            label="Patient Full Name"
                            placeholder="e.g. Ahmed Ali"
                            {...formik.getFieldProps("patientName")}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <CustomInput
                            label="WhatsApp / Phone"
                            placeholder="252..."
                            {...formik.getFieldProps("patientPhone")}
                          />
                        </div>
                        <div>
                          <CustomInput
                            label="Age"
                            type="number"
                            placeholder="Years"
                            {...formik.getFieldProps("patientAge")}
                          />
                        </div>
                        <div>
                          <CustomSelect
                            label="Gender"
                            {...formik.getFieldProps("patientGender")}
                          >
                            <option value="">Choose Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </CustomSelect>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Selection - New Design */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-600">
                        <HiOutlineCalendar className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Select Date & Time
                        </span>
                      </div>

                      {/* Date Selection */}
                      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                        {/* Logo */}
                        <div className="flex items-center justify-between mb-6">
                          {/* <img
                            src="/caafi.png"
                            alt="CAAFICare Logo"
                            className="h-12 w-auto"
                          /> */}
                          {/* <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <HiX className="w-6 h-6" />
                          </button> */}
                        </div>

                        {/* Date Navigation */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={() => navigateDates("prev")}
                            disabled={currentDateIndex === 0}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <HiChevronLeft className="w-5 h-5 text-blue-600" />
                          </button>

                          <div className="flex items-center gap-3 flex-1 justify-center">
                            {availableDates.slice(currentDateIndex, currentDateIndex + 3).map((date, idx) => {
                              const actualIndex = currentDateIndex + idx;
                              const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
                              return (
                                <button
                                  key={actualIndex}
                                  type="button"
                                  onClick={() => handleDateSelect(date, actualIndex)}
                                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all min-w-[120px] ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 hover:border-blue-300"
                                  }`}
                                >
                                  <span className={`text-sm font-bold mb-1 ${isSelected ? "text-blue-600" : "text-gray-700"}`}>
                                    {formatDateDisplay(date, actualIndex)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {getAvailableSlotsCount(actualIndex)} Available
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => navigateDates("next")}
                            disabled={currentDateIndex >= availableDates.length - 3}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <HiChevronRight className="w-5 h-5 text-blue-600" />
                          </button>
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                          <div className="mt-6 max-h-96 overflow-y-auto">
                            {/* Afternoon Section */}
                            <div className="mb-6">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-yellow-500">☀️</span>
                                <h4 className="text-sm font-bold text-gray-700">Afternoon</h4>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {timeSlots.afternoon.map((slot, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleTimeSelect(slot.time)}
                                    disabled={!slot.available}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                      selectedTime === slot.time
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : slot.available
                                        ? "border-gray-200 hover:border-blue-300 text-gray-700"
                                        : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                                    }`}
                                  >
                                    {slot.display}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Evening Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-blue-500">🌙</span>
                                <h4 className="text-sm font-bold text-gray-700">Evening</h4>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {timeSlots.evening.map((slot, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleTimeSelect(slot.time)}
                                    disabled={!slot.available}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                      selectedTime === slot.time
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : slot.available
                                        ? "border-gray-200 hover:border-blue-300 text-gray-700"
                                        : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                                    }`}
                                  >
                                    {slot.display}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col items-start space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider text-left">
                        Clinical Notes
                      </label>
                      <textarea
                        placeholder="Describe symptoms..."
                        rows={3}
                        {...formik.getFieldProps("notes")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-left"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedDate || !selectedTime}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="md" />
                          Processing...
                        </>
                      ) : (
                        "Confirm My Booking"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorAppointment;
