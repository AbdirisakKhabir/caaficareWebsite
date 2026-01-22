import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import PaymentModal from "../components/PaymentModal";
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
  const [selectedDoctorData, setSelectedDoctorData] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState({ morning: [], afternoon: [], evening: [] });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState(null);

  // Day name mapping
  const dayNames = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  // Generate available dates based on doctor's work_schedule
  const generateAvailableDates = (workSchedule) => {
    if (!workSchedule || typeof workSchedule !== 'object') {
      console.log("No work schedule available");
      return [];
    }

    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = Object.keys(dayNames).find(
        (key) => dayNames[key] === date.getDay()
      );

      if (dayName && workSchedule[dayName]?.enabled) {
        dates.push(date);
      }
    }

    console.log("Generated available dates:", dates.length);
    return dates;
  };

  // Generate time slots from work_schedule
  const generateTimeSlotsFromSchedule = (workSchedule, selectedDate) => {
    if (!workSchedule || !selectedDate || typeof workSchedule !== 'object') {
      return { morning: [], afternoon: [], evening: [] };
    }

    const dayName = Object.keys(dayNames).find(
      (key) => dayNames[key] === selectedDate.getDay()
    );

    if (!dayName || !workSchedule[dayName]?.enabled) {
      return { morning: [], afternoon: [], evening: [] };
    }

    const daySchedule = workSchedule[dayName];
    const slots = { morning: [], afternoon: [], evening: [] };

    if (daySchedule.shifts && Array.isArray(daySchedule.shifts)) {
      daySchedule.shifts.forEach((shift) => {
        if (!shift.enabled) return;

        const [startHour, startMinute] = shift.start_time.split(":").map(Number);
        const [endHour, endMinute] = shift.end_time.split(":").map(Number);

        const shiftSlots = [];
        let currentHour = startHour;
        let currentMinute = startMinute;

        while (
          currentHour < endHour ||
          (currentHour === endHour && currentMinute < endMinute)
        ) {
          const time = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
          const display = formatTime(currentHour, currentMinute);

          shiftSlots.push({
            time,
            display,
            available: true,
          });

          currentMinute += 15;
          if (currentMinute >= 60) {
            currentMinute = 0;
            currentHour++;
          }
        }

        // Map shift to correct category
        if (shift.id === "morning") {
          slots.morning = shiftSlots;
        } else if (shift.id === "afternoon") {
          slots.afternoon = shiftSlots;
        } else if (shift.id === "evening") {
          slots.evening = shiftSlots;
        }
      });
    }

    return slots;
  };

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Define formik BEFORE using it in useEffect
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
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Form submitted! Values:", values);
      console.log("Form errors:", formik.errors);
      console.log("Form touched:", formik.touched);
      
      setSubmitting(false);
      
      // Show payment modal instead of submitting directly
      const selectedDoctor = selectedDoctorData || doctor || doctors.find((d) => d.id == values.doctor_id);
      const appointmentPrice = selectedDoctor?.card_price || selectedDoctor?.appointment_price || "0";
      
      console.log("Selected doctor:", selectedDoctor);
      console.log("Appointment price:", appointmentPrice);
      console.log("Setting payment modal to true");
      
      // Store the form data to submit after payment
      setPendingAppointmentData(values);
      setShowPaymentModal(true);
      
      console.log("Payment modal state set to:", showPaymentModal); // This will show old state
    },
  });

  useEffect(() => {
    console.log("Payment modal state changed:", showPaymentModal);
  }, [showPaymentModal]);


    // ... existing code ...

  // Fetch full doctor data when doctor is selected or passed from location
  useEffect(() => {
    const fetchDoctorData = async () => {
      const doctorId = doctor?.id || formik.values.doctor_id;
      
      if (!doctorId) {
        setSelectedDoctorData(null);
        setAvailableDates([]);
        setTimeSlots({ morning: [], afternoon: [], evening: [] });
        return;
      }

      // If doctor is passed from location state and has work_schedule, use it directly
      if (doctor && doctor.work_schedule) {
        console.log("Using work_schedule from passed doctor object");
        setSelectedDoctorData(doctor);
        
        // Parse work_schedule if it's a string
        let workSchedule = doctor.work_schedule;
        if (typeof workSchedule === 'string') {
          try {
            workSchedule = JSON.parse(workSchedule);
          } catch (e) {
            console.error("Failed to parse work_schedule:", e);
            workSchedule = null;
          }
        }
        
        // Generate available dates from work_schedule
        const dates = generateAvailableDates(workSchedule);
        setAvailableDates(dates);
        
        console.log("Available dates count:", dates.length);
        
        // Reset date selection when doctor changes
        setSelectedDate(null);
        setSelectedTime(null);
        setCurrentDateIndex(0);
        return;
      }

      // Otherwise, fetch from API
      try {
        const response = await axios.get(
          `https://app.caaficare.so/api/doctor/${doctorId}`
        );
        
        console.log("Doctor API Response:", response.data);
        
        if (response.data.success && response.data.data) {
          const doctorData = response.data.data;
          setSelectedDoctorData(doctorData);

          console.log("Doctor work_schedule:", doctorData.work_schedule);
          console.log("Work schedule type:", typeof doctorData.work_schedule);

          // Parse work_schedule if it's a string
          let workSchedule = doctorData.work_schedule;
          if (typeof workSchedule === 'string') {
            try {
              workSchedule = JSON.parse(workSchedule);
            } catch (e) {
              console.error("Failed to parse work_schedule:", e);
              workSchedule = null;
            }
          }

          // Generate available dates from work_schedule
          const dates = generateAvailableDates(workSchedule);
          setAvailableDates(dates);
          
          console.log("Available dates count:", dates.length);
          
          // Reset date selection when doctor changes
          setSelectedDate(null);
          setSelectedTime(null);
          setCurrentDateIndex(0);
        } else {
          console.error("API response format error:", response.data);
          toast.error("Failed to load doctor data");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Failed to load doctor schedule");
      }
    };

    fetchDoctorData();
  }, [doctor?.id, formik.values.doctor_id]);

  // Update time slots when date is selected
  useEffect(() => {
    if (selectedDoctorData && selectedDate) {
      // Parse work_schedule if needed
      let workSchedule = selectedDoctorData.work_schedule;
      if (typeof workSchedule === 'string') {
        try {
          workSchedule = JSON.parse(workSchedule);
        } catch (e) {
          console.error("Failed to parse work_schedule:", e);
          workSchedule = null;
        }
      }
      
      const slots = generateTimeSlotsFromSchedule(
        workSchedule,
        selectedDate
      );
      setTimeSlots(slots);
      setSelectedTime(null); // Reset time when date changes
    }
  }, [selectedDate, selectedDoctorData]);

  // Get available slots count for a date
  const getAvailableSlotsCount = (date) => {
    if (!selectedDoctorData || !date) return 0;
    
    // Parse work_schedule if needed
    let workSchedule = selectedDoctorData.work_schedule;
    if (typeof workSchedule === 'string') {
      try {
        workSchedule = JSON.parse(workSchedule);
      } catch (e) {
        console.error("Failed to parse work_schedule:", e);
        workSchedule = null;
      }
    }
    
    const slots = generateTimeSlotsFromSchedule(
      workSchedule,
      date
    );
    return (
      slots.morning.length + slots.afternoon.length + slots.evening.length
    );
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

  // Handle payment completion - actually submit the appointment
  const handlePaymentComplete = async () => {
    if (!pendingAppointmentData) return;

    setIsSubmitting(true);
    try {
      const customer = JSON.parse(localStorage.getItem("customer"));
      const payload = { ...pendingAppointmentData, customer_id: customer?.id };
      const res = await axios.post(
        "https://app.caaficare.so/api/appointment",
        payload,
      );
      if (res.data.success) {
        setIsSuccess(true);
        setShowPaymentModal(false);
        setPendingAppointmentData(null);
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
  };

  const selectedDoctor = selectedDoctorData || doctor || doctors.find((d) => d.id == formik.values.doctor_id);
  const appointmentPrice = selectedDoctor?.card_price || selectedDoctor?.appointment_price || "0";

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
                          {formik.touched.patientName && formik.errors.patientName && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.patientName}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <CustomInput
                            label="WhatsApp / Phone"
                            placeholder="252..."
                            {...formik.getFieldProps("patientPhone")}
                          />
                          {formik.touched.patientPhone && formik.errors.patientPhone && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.patientPhone}</p>
                          )}
                        </div>
                        <div>
                          <CustomInput
                            label="Age"
                            type="number"
                            placeholder="Years"
                            {...formik.getFieldProps("patientAge")}
                          />
                          {formik.touched.patientAge && formik.errors.patientAge && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.patientAge}</p>
                          )}
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
                          {formik.touched.patientGender && formik.errors.patientGender && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.patientGender}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Schedule Selection - Based on Doctor's work_schedule */}
                    {selectedDoctorData && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600">
                          <HiOutlineCalendar className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Select Date & Time
                          </span>
                        </div>

                        {availableDates.length > 0 ? (
                          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                            {/* Logo */}
                            <div className="flex items-center justify-between mb-6">
                              <img
                                src="/caafi.png"
                                alt="CAAFICare Logo"
                                className="h-12 w-auto"
                              />
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
                                        {getAvailableSlotsCount(date)} Available
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
                                {/* Morning Section */}
                                {timeSlots.morning.length > 0 && (
                                  <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                      <span className="text-yellow-500">☀️</span>
                                      <h4 className="text-sm font-bold text-gray-700">Morning</h4>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                      {timeSlots.morning.map((slot, idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() => handleTimeSelect(slot.time)}
                                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                            selectedTime === slot.time
                                              ? "border-blue-500 bg-blue-50 text-blue-700"
                                              : "border-gray-200 hover:border-blue-300 text-gray-700"
                                          }`}
                                        >
                                          {slot.display}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Afternoon Section */}
                                {timeSlots.afternoon.length > 0 && (
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
                                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                            selectedTime === slot.time
                                              ? "border-blue-500 bg-blue-50 text-blue-700"
                                              : "border-gray-200 hover:border-blue-300 text-gray-700"
                                          }`}
                                        >
                                          {slot.display}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Evening Section */}
                                {timeSlots.evening.length > 0 && (
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
                                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                            selectedTime === slot.time
                                              ? "border-blue-500 bg-blue-50 text-blue-700"
                                              : "border-gray-200 hover:border-blue-300 text-gray-700"
                                          }`}
                                        >
                                          {slot.display}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {timeSlots.morning.length === 0 && timeSlots.afternoon.length === 0 && timeSlots.evening.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <p className="text-sm">No time slots available for this date</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                            <p className="text-yellow-800 text-sm font-medium">
                              ⚠️ No available dates found for this doctor. The doctor may not have a work schedule configured, or all dates are currently unavailable.
                            </p>
                            {selectedDoctorData?.work_schedule && (
                              <p className="text-yellow-700 text-xs mt-2">
                                Work schedule exists but no enabled days found.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

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
                      ) : !selectedDate ? (
                        "Select Date First"
                      ) : !selectedTime ? (
                        "Select Time First"
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

      {/* Payment Modal */}
       {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            console.log("Closing payment modal");
            setShowPaymentModal(false);
            setPendingAppointmentData(null);
          }}
          appointmentPrice={appointmentPrice}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default DoctorAppointment;