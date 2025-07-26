import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import SuccessPopup from "./SuccessPopup"; // Adjust the import path as needed
import ErrorPopup from "./ErrorPopup"; // Adjust the import path as needed

const MultiStepModal = ({ isOpen, onClose }) => {
  const { data: session } = useSession("");
  const [amount, setAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://admin.xpertbid.com/api/payment-methods",
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      setPaymentMethods(response.data);
      if (response.data.length > 0) {
        setSelectedPaymentMethod(response.data[0].id);
      } else {
        setSelectedPaymentMethod("");
      }
    } catch (error) {
      setErrors({ general: "Could not fetch payment methods." + error });
      setErrorPopupMessage("Could not fetch payment methods.");
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setSelectedPaymentMethod(paymentMethods.length > 0 ? paymentMethods[0].id : "");
    setErrors({});
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    onClose();
  };

  const handleSubmit = async () => {
    setErrors({});
    // Clear any previous popups
    setShowSuccessPopup(false);
    setShowErrorPopup(false);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://admin.xpertbid.com/api/payment-requests",
        {
          amount,
          payment_method: selectedPaymentMethod,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      setSuccessPopupMessage(response.data.message || "Payment request sent successfully!");
      setSuccessPopupSubMessage("Your payment request has been received.");
      setShowSuccessPopup(true);
      setAmount("");
      setSelectedPaymentMethod(paymentMethods.length > 0 ? paymentMethods[0].id : "");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        const firstError = Object.values(error.response.data.errors)[0][0];
        setErrorPopupMessage(firstError);
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      } else {
        setErrorPopupMessage(error.response?.data?.message || "Failed to send payment request.");
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content py-3 px-4">
          <div className="modal-header ps-5">
            <div></div>
            <h5 className="modal-title pop-head">Get Paid</h5>
            <div className="but-circle">
           <button
  type="button"
  className="custom-close"
  onClick={handleClose}
  aria-label="Close"
>
  <svg
    width="24"
    height="24"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" rx="18" fill="#EDEDED" />
    <path
      d="M24 12L12 24M12 12L24 24"
      stroke="#23262F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>
          </div>
          </div>

          <div className="modal-body text-center">
            <h1 className="my-3 dollor">${amount || "0"}</h1>
            <p className="mb-5 mt-3">Minimum amount you can withdraw is $50.</p>

            {/* Payment Method Selection */}
            <div className="my-3 w-100 text-start">
              <label className="form-label pop-title">Select Payment Method</label>
              <div className="position-relative w-auto">
  <select
    className="form-select pop-input no-arrow"
    value={selectedPaymentMethod}
    onChange={(e) => {
      setSelectedPaymentMethod(e.target.value);
      setErrors((prev) => ({ ...prev, payment_method: "" }));
    }}
  >
    <option value="">Select a payment method</option>
    {paymentMethods.map((method) => (
      <option key={method.id} value={method.id}>
        {method.paymentMethod}
        {method.paymentMethod === "Paypal" ? ` – ${method.paypal_id}` : ""}
      </option>
    ))}
  </select>
  <div className="select-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.08188 8.94986L10.6019 15.4699C11.3719 16.2399 12.6319 16.2399 13.4019 15.4699L19.9219 8.94986"
        stroke="#606060"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
</div>

              {errors.payment_method && <p className="text-danger">{errors.payment_method[0]}</p>}
            </div>

            {/* Enter Amount */}
            <div className="mb-3 w-100 text-start">
              <label className="form-label pop-title">Enter Amount</label>
                <input
        type="number"
        className="form-control pop-input"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setErrors((prev) => ({ ...prev, amount: "" }));
        }}
      />

              {errors.amount && <p className="text-danger">{errors.amount[0]}</p>}
            </div>


            <button className="btn btn-dark w-100 py-3" onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Send Payment Request"}
            </button>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          message={successPopupMessage}
          subMessage={successPopupSubMessage}
          onClose={() => {
            setShowSuccessPopup(false);
            window.location.reload();
          }}
        />
      )}
      {showErrorPopup && (
        <ErrorPopup
          isOpen={showErrorPopup}
          message={errorPopupMessage}
          subMessage={errorPopupSubMessage}
          onClose={() => {
            setShowErrorPopup(false);
            setErrorPopupMessage("");
          }}
        />
      )}
    </div>
  );
};

export default MultiStepModal;
