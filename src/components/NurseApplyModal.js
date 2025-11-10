import React, { useState } from 'react';

const NurseApplyModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    job_experience: '',
    contract: '',
    languages: '',
    location: '',
    city: '',
    district: '',
    qualifications: '',
    image: null,
    identity_card: null,
    certificate: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call to backend
    console.log('Nurse Application data:', formData);
    alert('Application submitted successfully! We will review your application.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">
            Apply to Join Our Team
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
              Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Job Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
              Job Experience *
            </label>
            <textarea
              name="job_experience"
              value={formData.job_experience}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              placeholder="Describe your work experience..."
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
              Qualifications *
            </label>
            <textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              placeholder="List your qualifications and certifications..."
            />
          </div>

          {/* Contract and Languages */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Contract Type
              </label>
              <select
                name="contract"
                value={formData.contract}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              >
                <option value="">Select Contract</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Languages
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
                placeholder="e.g., English, Somali, Arabic"
              />
            </div>
          </div>

          {/* Location, City, District */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Profile Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Identity Card
              </label>
              <input
                type="file"
                name="identity_card"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Certificate
              </label>
              <input
                type="file"
                name="certificate"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium font-poppins hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#6CA9F5] text-white rounded-lg font-medium font-poppins hover:opacity-90 transition-opacity"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NurseApplyModal;

