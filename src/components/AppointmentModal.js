import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner, Label } from "flowbite-react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiCheckCircle,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

// --- Custom Styled Input Component (Labels start at left) ---
const CustomInput = ({ label, ...props }) => (
  <div className="flex flex-col items-start w-full space-y-1.5">
    {label && (
      <Label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider text-left">
        {label}
      </Label>
    )}
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 text-sm transition-all
      focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none
      placeholder:text-gray-400 shadow-sm text-left ${props.className || ""}`}
    />
  </div>
);

// --- Custom Styled Select Component (Labels start at left) ---
const CustomSelect = ({ label, children, ...props }) => (
  <div className="flex flex-col items-start w-full space-y-1.5">
    {label && (
      <Label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider text-left">
        {label}
      </Label>
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

const AppointmentModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorData, setSelectedDoctorData] = useState(null);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState({ morning: [], afternoon: [], evening: [] });

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
    if (!workSchedule) return [];

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

    return dates;
  };

  // Generate time slots from work_schedule
  const generateTimeSlotsFromSchedule = (workSchedule, selectedDate) => {
    if (!workSchedule || !selectedDate) {
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

    return slots;
  };

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Fetch full doctor data when doctor is selected
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!formik.values.doctor_id) {
        setSelectedDoctorData(null);
        setAvailableDates([]);
        setTimeSlots({ morning: [], afternoon: [], evening: [] });
        return;
      }

      try {
        const response = await axios.get(
          `https://app.caaficare.so/api/doctor/${formik.values.doctor_id}`
        );
        
        if (response.data.success && response.data) {
          const doctorData = response.data.data;
          setSelectedDoctorData(doctorData);
          console.log(doctorData);
          // Generate available dates from work_schedule
          const dates = generateAvailableDates(doctorData.work_schedule);
          setAvailableDates(dates);
          
          // Reset date selection when doctor changes
          setSelectedDate(null);
          setSelectedTime(null);
          setCurrentDateIndex(0);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Failed to load doctor schedule");
      }
    };

    fetchDoctorData();
  }, [formik.values.doctor_id]);

  // Update time slots when date is selected
  useEffect(() => {
    if (selectedDoctorData && selectedDate) {
      const slots = generateTimeSlotsFromSchedule(
        selectedDoctorData.work_schedule,
        selectedDate
      );
      setTimeSlots(slots);
      setSelectedTime(null); // Reset time when date changes
    }
  }, [selectedDate, selectedDoctorData]);

  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
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
      fetchInitialData();
    } else {
      setIsSuccess(false);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedDoctorData(null);
      setAvailableDates([]);
      setTimeSlots({ morning: [], afternoon: [], evening: [] });
    }
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      patientName: "",
      patientPhone: "",
      patientAge: "",
      patientGender: "",
      appointmentType: "",
      appointmentDate: "",
      shift: "",
      appointmentTime: "",
      status: "Scheduled",
      customer_id: "",
      doctor_id: "",
      hospital_id: "",
      specialty: "",
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
            onClose();
            formik.resetForm();
            setSelectedDate(null);
            setSelectedTime(null);
          }, 2500);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Booking failed");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!formik.values.appointmentType) return;
      setFetchingDoctors(true);
      try {
        const params = new URLSearchParams({
          appointmentType: formik.values.appointmentType,
          hospitalId: formik.values.hospital_id,
          specialty: formik.values.specialty,
        });
        const res = await axios.get(
          `https://app.caaficare.so/api/appointment_doctors?${params.toString()}`,
        );
        setDoctors(res.data.data || []);
      } catch (error) {
        setDoctors([]);
      } finally {
        setFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, [
    formik.values.appointmentType,
    formik.values.hospital_id,
    formik.values.specialty,
  ]);

  const selectedDoctor = doctors.find((d) => d.id == formik.values.doctor_id);

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

  // Get available slots count for a date
  const getAvailableSlotsCount = (date) => {
    if (!selectedDoctorData || !date) return 0;
    const slots = generateTimeSlotsFromSchedule(
      selectedDoctorData.work_schedule,
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
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] animate-in fade-in zoom-in-95 duration-300">
        {/* LEFT PANEL */}
        <div className="w-full md:w-[28%] bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col justify-between overflow-y-auto">
          <div className="text-left">
            <div className="bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-6">
              CaafiCare Portal
            </div>
            <h2 className="text-3xl font-black leading-tight mb-2">
              Secure Online Booking
            </h2>
            <p className="text-blue-100/70 text-sm">
              Expert clinical care selection.
            </p>

            {selectedDoctor && (
              <div className="mt-12 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] text-left">
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
                  <span className="text-xs opacity-60">Consultation Fee</span>
                  <span className="text-2xl font-black">
                    ${selectedDoctor.card_price}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white p-6 md:p-12 overflow-y-auto">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <HiCheckCircle className="w-20 h-20 text-green-500 mb-4" />
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                Success!
              </h2>
              <p className="text-gray-500">Your appointment is scheduled.</p>
            </div>
          ) : (
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-8 text-left"
            >
              <div className="flex justify-between items-end border-b pb-6 border-gray-100">
                <div className="text-left">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                    Schedule Visit
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Provide information for the clinical record.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Patient Identity */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <HiOutlineUser className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Patient Profile
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                  <div className="md:col-span-2">
                    <CustomInput
                      label="Age"
                      type="number"
                      placeholder="Years"
                      {...formik.getFieldProps("patientAge")}
                    />
                  </div>
                  <div className="md:col-span-2">
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

              {/* Consultation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-blue-50/30 p-8 rounded-[2rem] border border-blue-50">
                <CustomSelect
                  label="Consultation Type"
                  {...formik.getFieldProps("appointmentType")}
                >
                  <option value="">Select Visit Format</option>
                  <option value="Video Consulting">Video Consultation</option>
                  <option value="Appointment">In-Person Hospital Visit</option>
                </CustomSelect>
                <CustomSelect
                  label="Primary Hospital"
                  {...formik.getFieldProps("hospital_id")}
                >
                  <option value="">Select Medical Center</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </CustomSelect>
                <CustomSelect
                  label="Specialty"
                  {...formik.getFieldProps("specialty")}
                >
                  <option value="">General Physician</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </CustomSelect>
                <CustomSelect
                  label="Choose Doctor"
                  {...formik.getFieldProps("doctor_id")}
                >
                  <option value="">
                    {fetchingDoctors
                      ? "Updating staff list..."
                      : "Select Doctor"}
                  </option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.name} (${d.card_price})
                    </option>
                  ))}
                </CustomSelect>
              </div>

              {/* Schedule Selection - Based on Doctor's work_schedule */}
              {formik.values.doctor_id && availableDates.length > 0 && (
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
                        {availableDates
                          .slice(currentDateIndex, currentDateIndex + 3)
                          .map((date, idx) => {
                            const actualIndex = currentDateIndex + idx;
                            const isSelected =
                              selectedDate &&
                              selectedDate.getTime() === date.getTime();
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
                                <span
                                  className={`text-sm font-bold mb-1 ${
                                    isSelected ? "text-blue-600" : "text-gray-700"
                                  }`}
                                >
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
                        disabled={
                          currentDateIndex >= availableDates.length - 3
                        }
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
                              <h4 className="text-sm font-bold text-gray-700">
                                Morning
                              </h4>
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
                              <h4 className="text-sm font-bold text-gray-700">
                                Afternoon
                              </h4>
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
                              <h4 className="text-sm font-bold text-gray-700">
                                Evening
                              </h4>
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
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col items-start space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider text-left">
                  Clinical Notes
                </Label>
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
                {isSubmitting ? <Spinner size="md" /> : "Confirm My Booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;