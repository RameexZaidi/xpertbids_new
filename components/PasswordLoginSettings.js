import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import SuccessPopup from "@/components/SuccessPopup"; // adjust the path as needed
import ErrorPopup from "@/components/ErrorPopup"; // adjust the path as needed

const PasswordLoginSettings = () => {
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword_confirmation, setConfirmPassword] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");
  
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");

  const sendVerificationCode = async () => {
    setLoading(true);
    setFieldErrors({});
    try {
      await axios.post(
        "https://admin.xpertbid.com/api/send-verification",
        { email },
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      setVerificationSent(true);
      setSuccessPopupMessage("Verification code sent to your email.");
      setSuccessPopupSubMessage("");
      setShowSuccessPopup(true);
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    setFieldErrors({});
    try {
      await axios.post(
        "https://admin.xpertbid.com/api/verify-code",
        { email, code: verificationCode },
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      setVerified(true);
      setSuccessPopupMessage("Email verification successful!");
      setSuccessPopupSubMessage("You can now change your password.");
      setShowSuccessPopup(true);
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== newPassword_confirmation) {
      setFieldErrors({ newPassword_confirmation: "Passwords do not match." });
      setErrorPopupMessage("Passwords do not match.");
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
      return;
    }
    setLoading(true);
    setFieldErrors({});
    try {
      await axios.post(
        "https://admin.xpertbid.com/api/change-password",
        { oldPassword, newPassword, newPassword_confirmation },
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      setSuccessPopupMessage("Password changed successfully!");
      setSuccessPopupSubMessage("");
      setShowSuccessPopup(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle API errors and trigger error popup
  const handleApiErrors = (error) => {
    if (error.response && error.response.data) {
      if (error.response.data.errors) {
        setFieldErrors(error.response.data.errors); // Laravel validation errors
        const combinedErrors = Object.values(error.response.data.errors)
          .flat()
          .join(" ");
        setErrorPopupMessage(combinedErrors);
        setErrorPopupSubMessage("");
      } else {
        setErrorPopupMessage(error.response.data.message || "An error occurred.");
        setErrorPopupSubMessage("");
      }
    } else {
      setErrorPopupMessage("An unexpected error occurred.");
      setErrorPopupSubMessage("");
    }
    setShowErrorPopup(true);
  };

  return (
    <div className="profile" id="password-login">
      <h3 className="heading">Password & Login</h3>

      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          message={successPopupMessage}
          subMessage={successPopupSubMessage}
        />
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <ErrorPopup
          isOpen={showErrorPopup}
          onClose={() => setShowErrorPopup(false)}
          message={errorPopupMessage}
          subMessage={errorPopupSubMessage}
        />
      )}

      <div className="profile-form">
        {!verificationSent ? (
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
            />
            {fieldErrors.email && <div className="text-danger">{fieldErrors.email[0]}</div>}
            <button className=" button-style-2 mt-2" onClick={sendVerificationCode} disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        ) : !verified ? (
          <div>
            <label>Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className={`form-control ${fieldErrors.code ? "is-invalid" : ""}`}
            />
            {fieldErrors.code && <div className="text-danger">{fieldErrors.code[0]}</div>}
            <button className="button-style-2 mt-2" onClick={verifyCode} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleChangePassword}>
            <label>Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              className={`form-control ${fieldErrors.oldPassword ? "is-invalid" : ""}`}
            />
            {fieldErrors.oldPassword && <div className="text-danger">{fieldErrors.oldPassword[0]}</div>}
            
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={`form-control ${fieldErrors.newPassword ? "is-invalid" : ""}`}
            />
            {fieldErrors.newPassword && <div className="text-danger">{fieldErrors.newPassword[0]}</div>}
            
            <label>Confirm New Password</label>
            <input
              type="password"
              value={newPassword_confirmation}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`form-control ${fieldErrors.newPassword_confirmation ? "is-invalid" : ""}`}
            />
            {fieldErrors.newPassword_confirmation && (
              <div className="text-danger">{fieldErrors.newPassword_confirmation[0]}</div>
            )}
            
            <button className="button-style-2 mt-3" type="submit" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordLoginSettings;
