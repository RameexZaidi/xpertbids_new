"use client";
import { useState } from "react";

export default function ForgotPassword({ isOpen, onBack }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const response = await fetch(
      "https://admin.xpertbid.com/api/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      setMessage("sent"); // just a flag
    } else {
      setErrors(data.error || {});
    }
  };

  const handleBack = () => {
    onBack?.(); // back to login
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* ← Back + title */}
        <div style={styles.header}>
          <button onClick={handleBack} style={styles.backButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5415 16.6L7.10817 11.1667C6.4665 10.525 6.4665 9.47502 7.10817 8.83336L12.5415 3.40002"
                stroke="#292D32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h3 style={styles.title} className="pop-head">Login or Sign up</h3>
          <div style={{ width: 40 }} /> {/* spacer */}
        </div>
        <hr />

        {message ? (
          // ——————————————————————————————
          // Success screen
          <div style={styles.successContainer}>
            <img
              src="/assets/images/send_email.png"
              alt="Email sent"
              style={styles.icon}
            />
            <h2 style={styles.successHeading}>Please Check your email</h2>
            <p style={styles.successText}>
              We sent password reset link to your email. Sometimes<br></br> it shows in spam
              folder so please do check that.
            </p>
            <button
              onClick={handleBack}
              style={styles.successButton}
            >
              Back to login
            </button>
          </div>
        ) : (
          // ——————————————————————————————
          // Form screen
            <>
    <div className="text-center">
      <img
        src="assets/images/forgetpassword.svg"
        className="mx-auto mt-4"
        alt="Forgot password illustration"
      />
      <h2 className="pop-head my-4">Forgot your password?</h2>
      <p className="liss">
        Enter your registered email to get a new password link.
      </p>
    </div>
    <form onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <input
          type="email"
          placeholder="Enter your email here"
          className="form-control pop-input my-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        {errors.email && (
          <p style={styles.errorText}>
            {Array.isArray(errors.email) ? errors.email[0] : errors.email}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="form-button-1"
        style={styles.submitButton}
      >
        Send Link
      </button>
    </form>
  </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, overflow: "auto",
  },
  modal: {
    background: "#FFF", borderRadius: "20px",
    width: "100%", maxWidth: "580px",
    padding: "20px", position: "relative",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginTop: "10px",
  },
  backButton: {
    width: "30px", height: "30px",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "none", borderRadius: "50%", background: "#EDEDED",
    cursor: "pointer",
  },
  
  formGroup: {
    margin: "30px 0 20px",
  },
  input: {
    width: "100%", padding: "12px", border: "1px solid #ccc",
    borderRadius: "10px",
  },
  submitButton: {
    width: "100%", padding: "12px",
    backgroundColor: "#0D0E13", color: "#FFF",
    border: "none", borderRadius: "20px",
    cursor: "pointer",
  },
  errorText: {
    color: "red", fontSize: "14px", marginTop: "5px",
  },

  // success state
  successContainer: {
    textAlign: "center", padding: "20px 0",
  },
  icon: {
    width: "120px", height: "120px", margin: "20px auto",
  },
  successHeading: {
    margin: "20px 0 10px", fontSize: "24px", fontWeight: 800,
  },
  successText: {
    margin: "0 20px 30px", fontSize: "14px", color: "#555"  ,textAlign:"center",
  },
  successButton: {
    width: "100%", padding: "12px",
    backgroundColor: "#0D0E13", color: "#FFF",
    border: "none", borderRadius: "10px",
    cursor: "pointer",
  },
};
