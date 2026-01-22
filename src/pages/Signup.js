import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";

const Signup = () => {
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [countryCode, setCountryCode] = useState("+252"); // Default to Somalia
  const [loading, setLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const navigate = useNavigate();

  // Common country codes
  const countryCodes = [
    { code: "+252", country: "Somalia", flag: "🇸🇴" },
    { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
    { code: "+249", country: "Sudan", flag: "🇸🇩" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  ];

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
      // Combine country code with phone number
      const fullPhone = countryCode + form.phone.replace(/\D/g, "");
      const verificationCode = generateVerificationCode();
      
      // Send verification code
      await sendVerificationCode(fullPhone, verificationCode);

      // Navigate to verify page
      navigate("/verify", {
        state: {
          phone: fullPhone,
          countryCode: countryCode,
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

  const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];

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
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-2 px-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#6CA9F5] outline-none transition-all font-semibold text-gray-700 min-w-[120px]"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm">{selectedCountry.code}</span>
                      <HiChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {showCountryDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowCountryDropdown(false)}
                        ></div>
                        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 max-h-60 overflow-y-auto min-w-[200px]">
                          {countryCodes.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(country.code);
                                setShowCountryDropdown(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                                countryCode === country.code ? "bg-blue-50" : ""
                              }`}
                            >
                              <span className="text-lg">{country.flag}</span>
                              <span className="flex-1 text-left text-sm font-semibold text-gray-700">
                                {country.country}
                              </span>
                              <span className="text-sm text-gray-500">{country.code}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#6CA9F5] outline-none transition-all font-semibold text-gray-700"
                      placeholder="61 1234567"
                    />
                  </div>
                </div>
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