import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://app.caaficare.so/api/customerLogin",
        { phone },
      );

      if (response.data.user) {
        const userData = {
          id: response.data.user.id,
          full_name: response.data.user.fullName,
          phone: response.data.user.phone,
        };

        localStorage.setItem("customer", JSON.stringify(userData));
        // Instant Header Update
        window.dispatchEvent(new Event("storage"));

        toast.success(`Welcome back, ${response.data.user.fullName}`);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid phone number");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(108,169,245,0.15)] border border-blue-50 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full opacity-50"></div>

          <div className="relative">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 font-poppins tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-500 mt-2 text-sm font-medium">
                Log in to manage your health appointments
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">
                  Phone Number
                </label>
                <div className="relative">
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#6CA9F5] outline-none transition-all font-semibold text-gray-700"
                    placeholder="252..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6CA9F5] hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500 font-medium">
                New to CaafiCare?{" "}
                <Link
                  to="/signup"
                  className="text-[#6CA9F5] font-extrabold hover:text-blue-700 transition-colors"
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
