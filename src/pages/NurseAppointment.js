import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NurseAppointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [filteredNurses, setFilteredNurses] = useState([]);
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientAge: "",
    patientGender: "",
    appointmentType: "Nursing",
    appointmentDate: "",
    shift: "",
    address: "",
    location: "",
    nurse_id: "",
    customer_id: "",
    service_id: "",
    status: "Scheduled",
  });

  // Data Fetching
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const loggedInUser = localStorage.getItem("customer");

      if (!loggedInUser) {
        toast.error("Please login to book an appointment");
        navigate("/login");
        return;
      }

      const customerData = JSON.parse(loggedInUser);
      setFormData((prev) => ({ ...prev, customer_id: customerData.id }));

      setLoading(true);
      try {
        const [nursesRes, servicesRes] = await Promise.all([
          axios.get("https://app.caaficare.so/api/nurse?status=Active"),
          axios.get("https://app.caaficare.so/api/services"),
        ]);
        setNurses(nursesRes.data.data || []);
        setFilteredNurses(nursesRes.data.data || []);
        setServices(servicesRes.data || []);
      } catch (error) {
        toast.error("Failed to load clinical data");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  // Filter Logic
  useEffect(() => {
    const filtered = formData.location
      ? nurses.filter((n) =>
          n.location?.toLowerCase().includes(formData.location.toLowerCase()),
        )
      : nurses;
    setFilteredNurses(filtered);

    setSelectedNurse(nurses.find((n) => n.id === parseInt(formData.nurse_id)));
    setSelectedService(
      services.find((s) => s.id === parseInt(formData.service_id)),
    );
  }, [
    formData.location,
    formData.nurse_id,
    formData.service_id,
    nurses,
    services,
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service_id || !formData.nurse_id) {
      toast.warn("Please select a service and a nurse");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://app.caaficare.so/api/nurses_appointment",
        formData,
      );
      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed. Try again.");
    } finally {
      setIsSubmitting(false);
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
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-bounce">
                ✓
              </div>
              <h2 className="text-4xl font-black text-gray-800 mb-4">
                Request Sent!
              </h2>
              <p className="text-gray-500 text-lg mb-6">
                Your nursing appointment request has been submitted
                successfully.
              </p>
              <p className="text-sm text-gray-400">
                Redirecting you to home page...
              </p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Main Form Section */}
                <div className="lg:col-span-2 p-8 lg:p-12">
                  <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">
                      Nursing Appointment
                    </h1>
                    <p className="text-gray-500">
                      Book professional in-home nursing care services
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FormRow label="Service">
                      <select
                        name="service_id"
                        value={formData.service_id}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Choose Nursing Service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.serviceName} - ${s.price}
                          </option>
                        ))}
                      </select>
                    </FormRow>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">
                          Patient Info
                        </label>
                        <input
                          type="text"
                          name="patientName"
                          placeholder="Full Name"
                          value={formData.patientName}
                          onChange={handleChange}
                          required
                          className="input-field"
                        />
                        <input
                          type="tel"
                          name="patientPhone"
                          placeholder="WhatsApp Number"
                          value={formData.patientPhone}
                          onChange={handleChange}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-4 pt-6">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="patientAge"
                            placeholder="Age"
                            value={formData.patientAge}
                            onChange={handleChange}
                            required
                            className="w-1/2 input-field"
                          />
                          <select
                            name="patientGender"
                            value={formData.patientGender}
                            onChange={handleChange}
                            required
                            className="w-1/2 input-field"
                          >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          name="location"
                          placeholder="Search District/City"
                          value={formData.location}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <FormRow label="Choose Nurse">
                      <select
                        name="nurse_id"
                        value={formData.nurse_id}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">
                          {loading
                            ? "Fetching clinical staff..."
                            : "Available Nurses"}
                        </option>
                        {filteredNurses.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.name} ({n.district || "General"})
                          </option>
                        ))}
                      </select>
                    </FormRow>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select Shift</option>
                        <option value="Morning">Morning (8AM-2PM)</option>
                        <option value="Afternoon">Afternoon (2PM-8PM)</option>
                        <option value="Night">Night (8PM-8AM)</option>
                      </select>
                    </div>

                    <textarea
                      name="address"
                      placeholder="Full Residential Address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="input-field"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#6CA9F5] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 text-lg"
                    >
                      {isSubmitting ? "Processing..." : "Confirm Nurse Booking"}
                    </button>
                  </form>
                </div>

                {/* Sidebar Summary */}
                <div className="bg-slate-50 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-6 border-b pb-4 text-lg">
                    Booking Details
                  </h3>

                  {selectedService && (
                    <div className="mb-6">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                        Service Cost
                      </p>
                      <p className="text-4xl font-black text-[#6CA9F5]">
                        ${selectedService.price}
                      </p>
                    </div>
                  )}

                  {selectedNurse && (
                    <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-2">
                        Primary Nurse
                      </p>
                      <p className="font-bold text-gray-700 text-lg">
                        {selectedNurse.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedNurse.qualifications ||
                          "Certified Professional"}
                      </p>
                    </div>
                  )}

                  {!selectedService && !selectedNurse && (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm">Fill in the form to see details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border-radius: 1rem;
          border: 1px solid #eef2f6;
          background: #ffffff;
          outline: none;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #6ca9f5;
          background: white;
          box-shadow: 0 0 0 4px rgba(108, 169, 245, 0.1);
        }
      `}</style>
    </div>
  );
};

const FormRow = ({ label, children }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
    <label className="md:w-1/4 text-xs font-black uppercase text-gray-400 ml-1">
      {label}
    </label>
    <div className="md:w-3/4">{children}</div>
  </div>
);

export default NurseAppointment;
