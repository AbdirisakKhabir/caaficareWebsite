import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  HiX,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineLocationMarker,
} from "react-icons/hi";

// --- HELPERS DEFINED BEFORE THE MAIN COMPONENT ---
const DAYS_OF_WEEK_LIST = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const SHIFTS_LIST = [
  { id: "morning", label: "Morning", start: "08:00", end: "12:00" },
  { id: "afternoon", label: "Afternoon", start: "13:00", end: "17:00" },
  { id: "evening", label: "Evening", start: "18:00", end: "22:00" },
];

const initializeWorkSchedule = () => {
  const schedule = {};
  DAYS_OF_WEEK_LIST.forEach((day) => {
    schedule[day] = {
      enabled: false,
      shifts: SHIFTS_LIST.map((s) => ({ ...s, enabled: false })),
    };
  });
  return schedule;
};

const SectionHeader = ({ icon, title, color = "text-gray-900" }) => (
  <div className={`flex items-center gap-2 ${color} text-left`}>
    {icon}
    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
      {title}
    </span>
  </div>
);

const InputField = ({ label, type = "text", ...props }) => (
  <div className="flex flex-col items-start space-y-2 text-left">
    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
      {label}
    </label>
    <input
      type={type}
      className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50/30 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
      {...props}
    />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div className="flex flex-col items-start space-y-2 text-left">
    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
      {label}
    </label>
    <select
      className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50/30 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
      {...props}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const DayRow = ({ dayId, data, onToggle, onShiftToggle }) => (
  <div
    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
      data.enabled
        ? "border-blue-200 bg-blue-50/20"
        : "border-gray-100 bg-gray-50/30 opacity-60"
    }`}
  >
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={data.enabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="font-bold text-gray-800 capitalize">{dayId}</span>
    </div>
    {data.enabled && (
      <div className="flex flex-wrap gap-2">
        {data.shifts.map((shift, idx) => (
          <button
            key={shift.id}
            type="button"
            onClick={() => {
              const newShifts = [...data.shifts];
              newShifts[idx].enabled = !newShifts[idx].enabled;
              onShiftToggle(newShifts);
            }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border transition-all ${
              shift.enabled
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                : "bg-white border-gray-200 text-gray-400"
            }`}
          >
            {shift.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

// --- MAIN COMPONENT ---
const DoctorApplyModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const scrollRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    job_experience: "0",
    profession: "General Physician",
    languages: "",
    card_price: "",
    appointment_price: "",
    type: "Both Appointment and Consulting",
    hospital_id: "",
    image: null,
    availability_status: "Available",
    work_schedule: initializeWorkSchedule(),
  });

  useEffect(() => {
    if (isOpen) {
      const fetchHospitals = async () => {
        try {
          setLoadingHospitals(true);
          const res = await axios.get("https://app.caaficare.so/api/hospitals");
          setHospitals(res.data.data || []);
        } catch (err) {
          console.error("Hospital load failed");
        } finally {
          setLoadingHospitals(false);
        }
      };
      fetchHospitals();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const setScheduleValue = (dayId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      work_schedule: {
        ...prev.work_schedule,
        [dayId]: { ...prev.work_schedule[dayId], [field]: value },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "work_schedule")
          data.append(key, JSON.stringify(formData[key]));
        else if (key === "image") {
          if (formData.image) data.append("image", formData.image);
        } else data.append(key, formData[key]);
      });

      const response = await fetch("https://app.caaficare.so/api/doctor", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        alert("Application Sent!");
        onClose();
      }
    } catch (error) {
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="text-left">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Doctor Onboarding
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Join the CaafiCare specialist network.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-gray-400"
          >
            <HiX size={24} />
          </button>
        </div>

        <form
          ref={scrollRef}
          onSubmit={handleSubmit}
          className="overflow-y-auto p-10 space-y-10"
        >
          <SectionHeader
            icon={<HiOutlineBriefcase />}
            title="Professional Identity"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Phone Number *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Specialty"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
            />
            <InputField
              label="Experience"
              name="job_experience"
              value={formData.job_experience}
              onChange={handleChange}
            />
            <InputField
              label="Languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
            />
          </div>

          <SectionHeader
            icon={<HiOutlineLocationMarker />}
            title="Assignment"
            color="text-blue-600"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SelectField
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                "Both Appointment and Consulting",
                "Appointment",
                "Consulting",
              ]}
            />
            <div className="flex flex-col items-start space-y-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
                Hospital *
              </label>
              <select
                name="hospital_id"
                required
                value={formData.hospital_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm outline-none"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <SectionHeader
            icon={<HiOutlineCurrencyDollar />}
            title="Fees"
            color="text-green-600"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Card Price"
              name="card_price"
              value={formData.card_price}
              onChange={handleChange}
            />
            <InputField
              label="Appointment Price"
              name="appointment_price"
              value={formData.appointment_price}
              onChange={handleChange}
            />
          </div>

          <SectionHeader
            icon={<HiOutlineClock />}
            title="Availability"
            color="text-orange-500"
          />
          <div className="grid grid-cols-1 gap-3 text-left">
            {Object.keys(formData.work_schedule).map((dayId) => (
              <DayRow
                key={dayId}
                dayId={dayId}
                data={formData.work_schedule[dayId]}
                onToggle={(val) => setScheduleValue(dayId, "enabled", val)}
                onShiftToggle={(newShifts) =>
                  setScheduleValue(dayId, "shifts", newShifts)
                }
              />
            ))}
          </div>

          <div className="flex gap-4 pt-10 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-bold text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black"
            >
              {loading ? "Processing..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorApplyModal;
