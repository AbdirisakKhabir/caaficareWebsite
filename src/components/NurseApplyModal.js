import React, { useState } from "react";
import {
  HiX,
  HiOutlineLocationMarker,
  HiOutlineCloudUpload,
} from "react-icons/hi";
// --- Constants & Helpers ---
const DAYS_OF_WEEK = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const SHIFT_TYPES = [
  { id: "morning", label: "Morning", start: "08:00", end: "12:00" },
  { id: "afternoon", label: "Afternoon", start: "13:00", end: "17:00" },
  { id: "night", label: "Night", start: "19:00", end: "07:00" },
  { id: "full_day", label: "Full Day", start: "08:00", end: "20:00" },
];

const initializeWorkSchedule = () => {
  const schedule = {};
  DAYS_OF_WEEK.forEach((day) => {
    schedule[day.id] = {
      enabled: false,
      shifts: SHIFT_TYPES.map((shift) => ({
        id: shift.id,
        label: shift.label,
        enabled: false,
        start_time: shift.start,
        end_time: shift.end,
      })),
    };
  });
  return schedule;
};

const NurseApplyModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    job_experience: "",
    contract: "",
    languages: "",
    location: "",
    city: "",
    district: "",
    qualifications: "",
    image: null,
    identity_card: null,
    certificate: null,
    work_schedule: initializeWorkSchedule(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
        {/* Modern Gradient Header */}
        <div className="px-10 py-10 border-b border-gray-100 flex justify-between items-center bg-gradient-to-br from-blue-600 via-blue-500 to-[#6CA9F5] text-white">
          <div className="text-left">
            <h2 className="text-3xl font-black tracking-tight">
              Join Our Nursing Team
            </h2>
            <p className="text-blue-50 text-sm font-medium mt-1">
              Provide world-class healthcare at home.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
          >
            <HiX size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault(); /* submit */
          }}
          className="overflow-y-auto p-10 space-y-12 custom-scrollbar"
        >
          {/* Section: Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Primary Phone *"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <InputField
              label="Languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
            />
          </div>

          {/* Section: Professional Bio */}
          <div className="space-y-6">
            <div className="flex flex-col items-start space-y-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
                Professional Summary *
              </label>
              <textarea
                name="bio"
                required
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:bg-white bg-gray-50/30 outline-none transition-all text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-start space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
                  Job History
                </label>
                <textarea
                  name="job_experience"
                  rows="3"
                  value={formData.job_experience}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex flex-col items-start space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">
                  Qualifications
                </label>
                <textarea
                  name="qualifications"
                  rows="3"
                  value={formData.qualifications}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section: Area & Contract */}
          <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
            <SmallInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <SmallInput
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
            />
            <SmallInput
              label="Address"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <div className="flex flex-col items-start space-y-1">
              <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">
                Contract Type
              </label>
              <select
                name="contract"
                value={formData.contract}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border-none bg-white shadow-sm text-xs font-bold focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          {/* Section: Files */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FileField
              label="Profile Image"
              name="image"
              file={formData.image}
              onChange={handleFileChange}
            />
            <FileField
              label="ID Card"
              name="identity_card"
              file={formData.identity_card}
              onChange={handleFileChange}
            />
            <FileField
              label="Certificate"
              name="certificate"
              file={formData.certificate}
              onChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
          >
            {loading ? "Submitting Application..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Clean Helper Components ---
const InputField = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <input
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-[#6CA9F5] outline-none transition-all"
      {...props}
    />
  </div>
);

const SmallInput = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-blue-600 uppercase ml-1">
      {label}
    </label>
    <input
      className="w-full px-3 py-2 rounded-lg border border-white outline-none focus:ring-2 focus:ring-blue-200"
      {...props}
    />
  </div>
);

const FileField = ({ label, name, onChange, file }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <div className="relative group h-12">
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div
        className={`h-full px-4 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
          file
            ? "border-green-300 bg-green-50 text-green-700"
            : "border-gray-200 text-gray-400"
        }`}
      >
        <span className="text-[10px] font-bold truncate">
          {file ? file.name : "Select File"}
        </span>
      </div>
    </div>
  </div>
);

export default NurseApplyModal;
