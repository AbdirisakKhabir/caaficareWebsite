import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner, Label, Textarea } from "flowbite-react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiCheckCircle,
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
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        try {
          const [hospitalsRes, specialtiesRes] = await Promise.all([
            axios.get("https://caaficare.so/api/hospitals"),
            axios.get("https://caaficare.so/api/doctor/specialties"),
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
      shift: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const customer = JSON.parse(localStorage.getItem("customer"));
        const payload = { ...values, customer_id: customer?.id };
        const res = await axios.post(
          "https://caaficare.so/api/appointment",
          payload
        );
        if (res.data.success) {
          setIsSuccess(true);
          setTimeout(() => {
            onClose();
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
          `https://caaficare.so/api/appointment_doctors?${params.toString()}`
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

              {/* Time Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <HiOutlineCalendar className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Date & Slot Allocation
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <CustomInput
                    label="Appointment Date"
                    type="date"
                    {...formik.getFieldProps("appointmentDate")}
                  />
                  <CustomSelect
                    label="Preferred Shift"
                    {...formik.getFieldProps("shift")}
                  >
                    <option value="">Choose Shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                  </CustomSelect>
                  <CustomInput
                    label="Exact Time"
                    type="time"
                    {...formik.getFieldProps("appointmentTime")}
                  />
                </div>
              </div>

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
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
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
