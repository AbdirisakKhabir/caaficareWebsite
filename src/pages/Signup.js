import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationCode = async (phoneNumber, code) => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzMzl3aG4xVWVvWTVabGtHS0JhVG9JbnQyc1dCZ29xVSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQwNDY2NDY4fQ._Ul8BYxqcqYQ1k1fNlRZEhQeQ5Y_uzG9zWhtsXuCFdI";
      const instance_id =
        "eyJ1aWQiOiIzMzl3aG4xVWVvWTVabGtHS0JhVG9JbnQyc1dCZ29xVSIsImNsaWVudF9pZCI6IkNhYWZpQ2FyZSJ9";

      const message = `*CAAFICare Verification*\n\nYour verification code is: *${code}*\n\nUser Type: Customer\n\nThis code will expire in 10 minutes.`;

      let cleanPhone = phoneNumber.replace(/\D/g, "");
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "252" + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith("+252")) {
        cleanPhone = cleanPhone.substring(1);
      } else if (!cleanPhone.startsWith("252")) {
        cleanPhone = "252" + cleanPhone;
      }

      const apiUrl = `https://bawa.app/api/v1/send-text?token=${token}&instance_id=${instance_id}&jid=${cleanPhone}@s.whatsapp.net&msg=${encodeURIComponent(
        message
      )}`;

      await fetch(apiUrl);
      return true;
    } catch (error) {
      console.error("Error sending verification code:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const verificationCode = generateVerificationCode();
      
      // Send verification code
      await sendVerificationCode(form.phone, verificationCode);

      // Navigate to verify page
      navigate("/verify", {
        state: {
          phone: form.phone,
          full_name: form.full_name,
          userType: "customer",
          userTypeLabel: "Customer's Account",
          code: verificationCode,
          isNewUser: true,
          existingUserData: null,
        },
      });

      toast.success("Verification code sent to your WhatsApp");
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-gradient-to-tr from-blue-50 via-white to-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(108,169,245,0.15)] border border-blue-50 relative overflow-hidden">
          <div className="relative">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#6CA9F5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-black text-gray-900 font-poppins tracking-tight">
                Get Started
              </h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">
                Join our healthcare community today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#6CA9F5] outline-none transition-all font-semibold text-gray-700"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#6CA9F5] outline-none transition-all font-semibold text-gray-700"
                  placeholder="252..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#6CA9F5] to-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500 font-medium">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#6CA9F5] font-extrabold hover:text-blue-700 underline decoration-blue-100 underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
