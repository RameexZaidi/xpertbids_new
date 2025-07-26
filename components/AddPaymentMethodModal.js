import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import SuccessPopup from "./SuccessPopup"; // Adjust the import path as needed
import ErrorPopup from "./ErrorPopup"; // Adjust the import path as needed
import DeletePopup from "./DeletePopup"; 
const AddPaymentMethodModal = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Paypal");
  const [paypal_id, setPaypalId] = useState("");
  const [bank_name, setBankName] = useState("");
  const [iban_number, setIbanNumber] = useState("");
  const [swift_code, setSwiftCode] = useState("");
  const [account_title, setAccountTitle] = useState("");

  // States for popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePopupMessage, setDeletePopupMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  // Fetch user's saved payment methods
  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://admin.xpertbid.com/api/payment-methods",
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      setErrorPopupMessage("Failed to fetch payment methods.");
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };
const handleEditClick = (method) => {
  setIsEditMode(true);
  setEditId(method.id);
  setPaymentMethod(method.paymentMethod);
  setPaypalId(method.paypal_id || "");
  setBankName(method.bank_name || "");
  setIbanNumber(method.iban_number || "");
  setSwiftCode(method.swift_code || "");
  setAccountTitle(method.account_title || "");
  setCurrentStep(1);
};
  // Save new payment method
 const handleSave = async () => {
  setErrors({});
  setLoading(true);

  let formData = { paymentMethod };

  if (paymentMethod === "Paypal") {
    formData.paypal_id = paypal_id;
  } else if (paymentMethod === "Bank Transfer") {
    formData = {
      ...formData,
      bank_name,
      iban_number,
      swift_code,
      account_title,
    };
  }

  try {
    if (isEditMode && editId) {
      // Update request for edit
    await axios.patch(
        `https://admin.xpertbid.com/api/payment-methods/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      setPopupMessage("Payment method updated successfully!");
    } else {
      // Create request for new
      await axios.post(
        "https://admin.xpertbid.com/api/payment-methods",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      setPopupMessage("Payment method saved successfully!");
    }

    setShowSuccessPopup(true);
    fetchPaymentMethods();
    setCurrentStep(2);
    setIsEditMode(false);
    setEditId(null);
    // Clear form
    setPaypalId(""); setBankName(""); setIbanNumber(""); setSwiftCode(""); setAccountTitle("");
  } catch (error) {
    if (error.response?.status === 422) {
      setErrors(error.response.data.errors);
      const firstError = Object.values(error.response.data.errors)[0][0];
      setErrorPopupMessage(firstError);
      setShowErrorPopup(true);
    } else {
      setErrorPopupMessage("An error occurred while saving the payment method.");
      setShowErrorPopup(true);
    }
  } finally {
    setLoading(false);
  }
};

  // Delete a payment method
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://admin.xpertbid.com/api/payment-methods/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      // Trigger DeletePopup on success
      setDeletePopupMessage("Payment method deleted successfully!");
      setShowDeletePopup(true);
      // Update UI by removing deleted method
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      setErrorPopupMessage("Failed to delete payment method.");
      setShowErrorPopup(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <div></div>
            <h5 className="modal-title ms-4 pop-head">
              {currentStep === 1 && "Add Payment Method"}
              {currentStep === 2 && "Your Payment Methods"}
            </h5>
             <div className="but-circle">
           <button
  type="button"
  className="custom-close"
  onClick={onClose}
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

          <div className="modal-body">
            {currentStep === 1 && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-bold ms-2">Select Payment Method</label>
                  <select
                    className="form-select pop-input"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Paypal">Paypal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                {paymentMethod === "Paypal" && (
                  <div className="mb-3">
                    <label className="form-label fw-bold ms-2">PayPal ID</label>
                    <input
                      type="text"
                      className={`form-control pop-input ${errors.paypal_id ? "is-invalid" : ""}`}
                      placeholder="Enter your PayPal ID"
                      value={paypal_id}
                      onChange={(e) => setPaypalId(e.target.value)}
                    />
                    {errors.paypal_id && <div className="invalid-feedback">{errors.paypal_id[0]}</div>}
                  </div>
                )}

                {paymentMethod === "Bank Transfer" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-bold ms-2">Bank Name</label>
                      <input
                        type="text"
                        className={`form-control pop-input ${errors.bank_name ? "is-invalid" : ""}`}
                        placeholder="Enter Bank Name"
                        value={bank_name}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                      />
                      {errors.bank_name && <div className="invalid-feedback">{errors.bank_name[0]}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold ms-2">IBAN Number</label>
                      <input
                        type="text"
                        className={`form-control pop-input ${errors.iban_number ? "is-invalid" : ""}`}
                        placeholder="Enter IBAN Number"
                        value={iban_number}
                        onChange={(e) => setIbanNumber(e.target.value)}
                        required
                      />
                      {errors.iban_number && <div className="invalid-feedback">{errors.iban_number[0]}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold ms-2">Swift Code</label>
                      <input
                        type="text"
                        className={`form-control pop-input ${errors.swift_code ? "is-invalid" : ""}`}
                        placeholder="Enter Swift Code"
                        value={swift_code}
                        onChange={(e) => setSwiftCode(e.target.value)}
                        required
                      />
                      {errors.swift_code && <div className="invalid-feedback">{errors.swift_code[0]}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold ms-2">Account Title</label>
                      <input
                        type="text"
                        className={`form-control pop-input ${errors.account_title ? "is-invalid" : ""}`}
                        placeholder="Enter Account Title"
                        value={account_title}
                        onChange={(e) => setAccountTitle(e.target.value)}
                        required
                      />
                      {errors.account_title && <div className="invalid-feedback">{errors.account_title[0]}</div>}
                    </div>
                  </>
                )}
              </>
            )}

            {currentStep === 2 && (
              <>
                {loading ? (
                  <p>Loading...</p>
                ) : paymentMethods.length === 0 ? (
                  <p>No payment methods found.</p>
                ) : (
                  <ul className="list-group d-inline">
                    {paymentMethods.map((method) => (
                      <li key={method.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {method.paymentMethod === "Paypal" ? (
      /* PayPal icon */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="me-2"
      >
        <path
          d="M25.3349 9.33317C25.3349 9.57317 25.3216 9.79982 25.2949 10.0265C25.1349 11.9598 24.2816 13.7065 22.9882 14.9865C21.5482 16.4398 19.5483 17.3332 17.3349 17.3332H13.1616C12.4949 17.3332 11.9349 17.8265 11.8416 18.4798L10.8282 25.5199C10.7482 26.0399 10.3749 26.4665 9.88159 26.5999C9.76159 26.6532 9.64159 26.6665 9.50826 26.6665H6.90824C6.08157 26.6665 5.45492 25.9332 5.58825 25.1198L8.7749 6.01318C9.0949 4.07985 10.7616 2.6665 12.7216 2.6665H18.6683C22.3482 2.6665 25.3349 5.65317 25.3349 9.33317Z"
          fill="#43ACE9"
        />
        <path
          d="M27.9983 14.6665C27.9983 16.5065 27.2517 18.1732 26.0517 19.3865C24.8384 20.5865 23.1717 21.3332 21.3317 21.3332H18.465C17.8117 21.3332 17.2517 21.7999 17.145 22.4532L16.185 28.2132C16.0784 28.8665 15.5183 29.3332 14.865 29.3332H10.9584C10.7184 29.3332 10.505 29.2799 10.3183 29.1732C10.025 29.0132 10.2117 28.6265 10.5317 28.4932C11.7317 28.1065 12.6117 27.0799 12.7984 25.7999L13.6517 19.9065C13.705 19.5732 13.985 19.3332 14.305 19.3332H17.3317C20.0117 19.3332 22.5317 18.2932 24.3983 16.4132C25.505 15.3199 26.3317 13.9732 26.8117 12.5199C26.9183 12.1866 27.3584 12.1199 27.505 12.4265C27.825 13.1199 27.9983 13.8665 27.9983 14.6665Z"
          fill="#43ACE9"
        />
      </svg>
    ) : (
      /* Bank icon */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="me-2"
      >
        <path
          d="M29.3346 25.3333V29.3333H2.66797V25.3333C2.66797 24.6 3.26797 24 4.0013 24H28.0013C28.7346 24 29.3346 24.6 29.3346 25.3333Z"
          fill="#43ACE9"
          stroke="#43ACE9"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.33464 14.6665H6.66797V23.9998H9.33464V14.6665Z" fill="#43ACE9" />
        <path d="M14.6667 14.6665H12V23.9998H14.6667V14.6665Z" fill="#43ACE9" />
        <path d="M19.9987 14.6665H17.332V23.9998H19.9987V14.6665Z" fill="#43ACE9" />
        <path d="M25.3346 14.6665H22.668V23.9998H25.3346V14.6665Z" fill="#43ACE9" />
        <path
          d="M30.6654 30.3335H1.33203C0.785365 30.3335 0.332031 29.8802 0.332031 29.3335C0.332031 28.7868 0.785365 28.3335 1.33203 28.3335H30.6654C31.212 28.3335 31.6654 28.7868 31.6654 29.3335C31.6654 29.8802 31.212 30.3335 30.6654 30.3335Z"
          fill="#43ACE9"
        />
        <path
          d="M28.4946 7.66662L16.4946 2.86662C16.228 2.75995 15.7746 2.75995 15.508 2.86662L3.50797 7.66662C3.0413 7.85329 2.66797 8.39995 2.66797 8.90662V13.3333C2.66797 14.0666 3.26797 14.6666 4.0013 14.6666H28.0013C28.7346 14.6666 29.3346 14.0666 29.3346 13.3333V8.90662C29.3346 8.39995 28.9613 7.85329 28.4946 7.66662ZM16.0013 11.3333C14.8946 11.3333 14.0013 10.44 14.0013 9.33329C14.0013 8.22662 14.8946 7.33329 16.0013 7.33329C17.108 7.33329 18.0013 8.22662 18.0013 9.33329C18.0013 10.44 17.108 11.3333 16.0013 11.3333Z"
          fill="#43ACE9"
        />
      </svg>
    )}
    <span>
      {method.paymentMethod}{" "}
      {method.paymentMethod === "Paypal" ? `- ${method.paypal_id}` : ""}
    </span>
    </div>
                        <div className="d-flex align-items-center ">
                        <button
  type="button"
  onClick={() => handleDelete(method.id)}
  aria-label="Remove"
  className="btn-icon-delete"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
      stroke="#F66666"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
      stroke="#F66666"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.8484 9.14014L18.1984 19.2101C18.0884 20.7801 17.9984 22.0001 15.2084 22.0001H8.78844C5.99844 22.0001 5.90844 20.7801 5.79844 19.2101L5.14844 9.14014"
      stroke="#F66666"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3281 16.5H13.6581"
      stroke="#F66666"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 12.5H14.5"
      stroke="#F66666"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>
<button
  type="button"
  onClick={() => handleEditClick(method)}
  aria-label="Edit"
  className="btn-icon-edit ms-2"
  style={{border:"none",backgroundColor:"transparent"}}
>
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M13.2594 3.60022L5.04936 12.2902C4.73936 12.6202 4.43936 13.2702 4.37936 13.7202L4.00936 16.9602C3.87936 18.1302 4.71936 18.9302 5.87936 18.7302L9.09936 18.1802C9.54936 18.1002 10.1794 17.7702 10.4894 17.4302L18.6994 8.74022C20.1194 7.24022 20.7594 5.53022 18.5494 3.44022C16.3494 1.37022 14.6794 2.10022 13.2594 3.60022Z" stroke="#292D32" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M11.8906 5.0498C12.3206 7.8098 14.5606 9.9198 17.3406 10.1998" stroke="#292D32" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M3 22H21" stroke="#292D32" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
</button>

</div>
                      </li>
                     
                    ))}
                  </ul>
                )}
               <button
  className="btn btn-dark w-100 mt-3 p-3"
  onClick={() => {
    setCurrentStep(1);
    setIsEditMode(false);
    setEditId(null);
    setPaypalId(""); setBankName(""); setIbanNumber(""); setSwiftCode(""); setAccountTitle("");
  }}
>
  Add Another Method
</button>
              </>
            )}
          </div>

          <div className="modal-footer border-0">
            {currentStep === 1 && (
           <button type="button" className="btn btn-dark w-100" onClick={handleSave} disabled={loading}>
  {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Payment Method" : "Save Payment Method")}
</button>

            )}
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          message={popupMessage}
          subMessage="Your payment method has been saved!"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      {showErrorPopup && (
        <ErrorPopup
          isOpen={showErrorPopup}
          message={errorPopupMessage}
          subMessage=""
          onClose={() => {
            setShowErrorPopup(false);
            setErrorPopupMessage("");
          }}
        />
      )}
      {showDeletePopup && (
        <DeletePopup
          isOpen={showDeletePopup}
          message={deletePopupMessage}
          subMessage=""
          onClose={() => setShowDeletePopup(false)}
        />
      )}
    </div>
  );
};

export default AddPaymentMethodModal;
