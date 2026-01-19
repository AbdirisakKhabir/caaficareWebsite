import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import { 
  HiLockClosed, 
  HiRefresh, 
  HiArrowLeft, 
  HiUser, 
  HiUserGroup,
  HiOfficeBuilding,
  HiShoppingBag
} from "react-icons/hi";

const validationSchema = yup.object({
  verify: yup
    .string()
    .required("Verification code is required")
    .length(6, "Code must be 6 digits")
    .matches(/^[0-9]+$/, "Must be only digits"),
});

const VerifyUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, userType, userTypeLabel, code, isNewUser, existingUserData } = 
    location.state || {};

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no phone provided
  useEffect(() => {
    if (!phone) {
      toast.error("Phone number is required");
      navigate("/login");
    }
  }, [phone, navigate]);

  // Colors based on user type
  const getColorByUserType = () => {
    switch (userType) {
      case "doctor":
        return "#007AFF";
      case "nurse":
        return "#34C759";
      case "pharmacy":
        return "#FF9500";
      case "customer":
        return "#6CA9F5";
      default:
        return "#6CA9F5";
    }
  };

  const color = getColorByUserType();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Store user data in localStorage
  const storeUserData = (userData) => {
    try {
      const storeData = {
        ...userData,
        userType: userType,
        verified: true,
        lastLogin: new Date().toISOString(),
        phone: phone,
      };

      // Store all user data
      localStorage.setItem("customer", JSON.stringify(storeData));
      localStorage.setItem("userType", userType);
      localStorage.setItem("userTypeLabel", userTypeLabel);
      localStorage.setItem("phone", phone);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", userData.token || "");
      localStorage.setItem("userId", userData.id?.toString() || "");
      localStorage.setItem("userName", userData.name || userData.full_name || "");
      localStorage.setItem("loginTimestamp", new Date().toISOString());

      // Trigger storage event for Header update
      window.dispatchEvent(new Event("storage"));

      toast.success(
        isNewUser
          ? `Welcome to CAAFICare! Your ${userTypeLabel?.split("'")[1] || "user"} account has been created.`
          : `Welcome back! You're logged in as ${userTypeLabel?.split("'")[1] || "user"}.`
      );

      return true;
    } catch (error) {
      console.error("Error storing user data:", error);
      throw error;
    }
  };

  // Create new user
  const createNewUser = async () => {
    let endpoint, payload;

    switch (userType) {
      case "doctor":
        endpoint = "https://app.caaficare.so/api/doctors";
        payload = {
          phone,
          name: `Doctor ${phone.slice(-4)}`,
          status: "pending",
          availability_status: "inactive",
        };
        break;
      case "nurse":
        endpoint = "https://app.caaficare.so/api/nurses";
        payload = {
          phone,
          name: `Nurse ${phone.slice(-4)}`,
          status: "pending",
          availability_status: "inactive",
        };
        break;
      case "pharmacy":
        endpoint = "https://app.caaficare.so/api/pharmacies";
        payload = {
          phone,
          name: `Pharmacy ${phone.slice(-4)}`,
          ownerName: `Owner ${phone.slice(-4)}`,
          status: "pending",
        };
        break;
      case "customer":
        endpoint = "https://app.caaficare.so/api/customers";
        payload = {
          phone,
          full_name: `Customer ${phone.slice(-4)}`,
        };
        break;
      default:
        throw new Error("Invalid user type");
    }

    const response = await axios.post(endpoint, payload);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create account");
    }

    return response.data.data || response.data;
  };

  // Login existing user
  const loginExistingUser = async () => {
    let endpoint;

    switch (userType) {
      case "doctor":
        endpoint = `https://app.caaficare.so/api/doctors/phone/${phone}`;
        break;
      case "nurse":
        endpoint = `https://app.caaficare.so/api/nurses/phone/${phone}`;
        break;
      case "pharmacy":
        endpoint = `https://app.caaficare.so/api/pharmacies/phone/${phone}`;
        break;
      case "customer":
        try {
          const response = await axios.post(
            "https://app.caaficare.so/api/customerLogin",
            { phone: phone }
          );
          return response.data.user || response.data.data;
        } catch (error) {
          endpoint = `https://app.caaficare.so/api/customers/phone/${phone}`;
        }
        break;
      default:
        throw new Error("Invalid user type");
    }

    const response = await axios.get(endpoint);

    if (!response.data.success) {
      throw new Error("User not found");
    }

    return response.data.data || existingUserData;
  };

  // Verify code and handle user
  const handleVerification = async () => {
    if (formik.values.verify !== code) {
      toast.error("The verification code is incorrect.");
      return;
    }

    setLoading(true);

    try {
      let userData;

      if (isNewUser) {
        userData = await createNewUser();
      } else {
        userData = await loginExistingUser();
      }

      await storeUserData(userData);

      navigate("/");
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Could not complete verification."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzMzl3aG4xVWVvWTVabGtHS0JhVG9JbnQyc1dCZ29xVSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQwNDY2NDY4fQ._Ul8BYxqcqYQ1k1fNlRZEhQeQ5Y_uzG9zWhtsXuCFdI";
      const instance_id =
        "eyJ1aWQiOiIzMzl3aG4xVWVvWTVabGtHS0JhVG9JbnQyc1dCZ29xVSIsImNsaWVudF9pZCI6IkNhYWZpQ2FyZSJ9";

      const userTypeLabels = {
        doctor: "Doctor",
        nurse: "Nurse",
        pharmacy: "Pharmacy",
        customer: "Customer",
      };

      const message = `🏥 *CAAFICare Verification*\n\nYour new verification code is: *${code}*\n\nUser Type: ${
        userTypeLabels[userType] || "User"
      }\n\nThis code will expire in 10 minutes.`;

      let cleanPhone = phone.replace(/\D/g, "");
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

      toast.success("A new verification code has been sent to your WhatsApp.");

      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error("Resend Error:", error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { verify: "" },
    validationSchema,
    onSubmit: handleVerification,
  });

  // Get user icon
  const getUserIcon = () => {
    switch (userType) {
      case "doctor":
        return <HiUser className="w-10 h-10" style={{ color }} />;
      case "nurse":
        return <HiUserGroup className="w-10 h-10" style={{ color }} />;
      case "pharmacy":
        return <HiShoppingBag className="w-10 h-10" style={{ color }} />;
      case "customer":
        return <HiUser className="w-10 h-10" style={{ color }} />;
      default:
        return <HiUser className="w-10 h-10" style={{ color }} />;
    }
  };

  if (!phone) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(108,169,245,0.15)] border border-blue-50 relative overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/caafi.png"
              alt="CAAFICare Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* User Type Indicator */}
          <div
            className="flex items-center p-4 rounded-2xl mb-6"
            style={{ backgroundColor: `${color}15` }}
          >
            <div className="mr-4">{getUserIcon()}</div>
            <div className="flex-1">
              <p className="text-lg font-bold mb-1" style={{ color }}>
                {userTypeLabel || "User Verification"}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {phone ? `+${phone}` : "Phone number"}
              </p>
              <p className="text-xs text-gray-500 italic mt-1">
                {isNewUser ? "New Account" : "Existing Account"}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">
            Verify Your Account
          </h1>
          <p className="text-gray-500 text-center mb-8 text-sm">
            Enter the 6-digit code sent to your WhatsApp
          </p>

          {/* Verification Code Input */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div
              className="flex items-center bg-gray-50 rounded-2xl border-2 px-5 py-4 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all"
              style={{ borderColor: formik.touched.verify && formik.errors.verify ? "#EF4444" : color }}
            >
              <HiLockClosed className="w-6 h-6 mr-3" style={{ color }} />
              <input
                type="text"
                placeholder="Enter 6-digit code"
                className="flex-1 bg-transparent text-gray-900 text-lg font-semibold tracking-widest outline-none"
                maxLength={6}
                value={formik.values.verify}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  formik.setFieldValue("verify", value);
                }}
                onBlur={formik.handleBlur("verify")}
                autoFocus
              />
            </div>

            {/* Error Message */}
            {formik.touched.verify && formik.errors.verify && (
              <p className="text-red-500 text-sm ml-1">{formik.errors.verify}</p>
            )}

            {/* Resend Code */}
            <div className="flex justify-center py-2">
              {!canResend ? (
                <p className="text-gray-500 text-sm">
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
                  style={{ color }}
                >
                  {resendLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <HiRefresh className="w-5 h-5" />
                      <span>Resend Code</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={!formik.isValid || loading}
              className="w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: color,
                boxShadow: `0 10px 30px ${color}40`
              }}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <HiUser className="w-5 h-5" />
                  <span>{isNewUser ? "Create Account" : "Verify & Login"}</span>
                </>
              )}
            </button>
          </form>

          {/* Back Button */}
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 mt-6 text-sm font-semibold py-2"
            style={{ color }}
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Use different number</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyUser;