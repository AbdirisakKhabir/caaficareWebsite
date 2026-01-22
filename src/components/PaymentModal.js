import React, { useState } from "react";
import { HiX, HiClipboardCopy, HiCheckCircle } from "react-icons/hi";
import { toast } from "react-toastify";

const PaymentModal = ({ isOpen, onClose, appointmentPrice, onPaymentComplete }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Payment methods configuration
  const paymentMethods = [
    {
      id: "merchant",
      name: "Merchant",
      phone: "737721",
      ussdPrefix: "*789*",
      color: "from-green-500 to-green-600",
      image: "/merchant-logo.png",
      description: "Somalia Mobile Money",
    },
    {
      id: "edahab",
      name: "E-Dahab",
      phone: "622222154",
      ussdPrefix: "*110*",
      color: "from-purple-500 to-purple-600",
      image: "/edahab.jpg",
      description: "Somalia Mobile Money",
    },
    {
      id: "evc",
      name: "EVC",
      phone: "0619002269",
      ussdPrefix: "*712*",
      color: "from-blue-500 to-blue-600",
      image: "/evcPlus.jpg",
      description: "Somalia Mobile Money",
    },
  ];

  // Generate USSD code
  const generateUSSDCode = (method) => {
    return `${method.ussdPrefix}${method.phone}*${appointmentPrice || "0"}#`;
  };

  // Copy to clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIndex(index);
        toast.success("Payment code copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy. Please try again.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Complete Payment
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Choose your preferred payment method
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[80vh]">
          {/* Amount Display */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">
                  Total Amount
                </p>
                <p className="text-4xl font-black text-blue-900">
                  ${appointmentPrice || "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-black text-gray-900 mb-4">
              Select Payment Method
            </h3>
            
            {paymentMethods.map((method, index) => {
              const ussdCode = generateUSSDCode(method);
              const isCopied = copiedIndex === index;

              return (
                <div
                  key={method.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Method Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg overflow-hidden p-2`}
                      >
                        <img
                          src={method.image}
                          alt={method.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<span class="text-white text-2xl font-bold">${method.name.charAt(0)}</span>`;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-gray-900 mb-1">
                          {method.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">
                          {method.description}
                        </p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Phone Number
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {method.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                              USSD Code
                            </p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-gray-900">
                                {ussdCode}
                              </code>
                              <button
                                onClick={() => copyToClipboard(ussdCode, index)}
                                className={`px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                                  isCopied
                                    ? "bg-green-500 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                              >
                                {isCopied ? (
                                  <>
                                    <HiCheckCircle className="w-5 h-5" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <HiClipboardCopy className="w-5 h-5" />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      <span className="font-bold">Instructions:</span> Dial the USSD code above on your phone to complete the payment. After payment, click "I've Paid" below.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onPaymentComplete) {
                  onPaymentComplete();
                }
                onClose();
              }}
              className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200"
            >
              I've Paid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;