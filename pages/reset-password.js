import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function ResetPassword() {
    const router = useRouter();
    const { token, email } = router.query;

    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
       const [showConfirm, setShowConfirm] = useState(false);
        const [showValidation, setShowValidation] = useState(false);
       const [validations, setValidations] = useState({
    lower: false,
    upper: false,
    number: false,
    length: false,
  });

    // update validations whenever password changes
  useEffect(() => {
    setValidations({
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      number: /\d/.test(password),
      length: password.length >= 8,
    });
  }, [password]);
  const rules = [
    { key: "lower", label: "At least one lowercase letter" },
    { key: "upper", label: "At least one uppercase letter" },
    { key: "number", label: "At least one number" },
    { key: "length", label: "Minimum 8 characters" },
  ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset previous errors

        const response = await fetch(`https://admin.xpertbid.com/api/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, email, password, password_confirmation: passwordConfirm }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Password reset successful! You can now login.");
        } else {
            setErrors(data.error || {});
        }
    };
 if (message === "success") {
    return (
      <>
        <Header />
        <div className="container-fluid py-5 my-bg-color">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card p-4 reset-card text-center">
                  {/* Place your image in public/assets/images/thumbsup.png */}
                  <img
                    src="/assets/images/all_done.png"
                    alt="All done!"
                    width={100}
                    height={100}
                    className="mb-4"
                  />
                  <h2>All done!</h2>
                  <p>Your new password has been set.</p>
                  <button
                    type="button"
                    className="form-button-1 mt-3"
                    onClick={() => router.push("/login")}
                  >
                    Back to login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
    return (
        <>
        < Header />
        <div className="container-fluid py-5 my-bg-color">
        <div className="container  py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 reset-card">
                        <h2 className="card-title pop-head mb-4" style={{fontWeight:"800"}}>Create New Password</h2>
                        {message && <div className="alert alert-success">{message}</div>}
                        {errors.token && (
                            <div className="alert alert-danger">
                                {Array.isArray(errors.token) ? errors.token[0] : errors.token}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="pop-title my-3">New Password</label>
                              <div style={styles.wrapper}>
  <input
   type={showPassword ? "text" : "password"}
    className="form-control new_pass_input mb-4"
    placeholder="Enter your password"
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      if (!showValidation) setShowValidation(true);
    }}
    required
    style={styles.input}
  />
  <button
    type="button"
    onClick={() => setShowPassword((s) => !s)}
    style={styles.eyeBtn}
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      // PART 1: Eye Open (no slash)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        {/* Outer eye */}
        <path
          d="M2 14S6 4 14 4s12 10 12 10-4 10-12 10S2 14 2 14z"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pupil */}
        <circle
          cx="14"
          cy="14"
          r="4"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      // PART 2: Eye Closed (with slash)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M16.9517 11.0482L11.0484 16.9516C10.29 16.1932 9.82336 15.1549 9.82336 13.9999C9.82336 11.6899 11.69 9.82324 14 9.82324C15.155 9.82324 16.1934 10.2899 16.9517 11.0482Z"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.79 6.73156C18.7483 5.19156 16.415 4.35156 14 4.35156C9.88167 4.35156 6.04333 6.77823 3.37167 10.9782C2.32167 12.6232 2.32167 15.3882 3.37167 17.0332C4.29333 18.4799 5.36667 19.7282 6.53333 20.7316"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.82336 22.785C11.1534 23.345 12.565 23.6484 14 23.6484C18.1184 23.6484 21.9567 21.2217 24.6284 17.0217C25.6784 15.3767 25.6784 12.6117 24.6284 10.9667C24.2434 10.36 23.8234 9.78838 23.3917 9.25171"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.095 14.8167C17.7917 16.4616 16.45 17.8033 14.805 18.1067"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.0483 16.9517L2.33331 25.6667"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.6667 2.33325L16.9517 11.0483"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </button>
</div>

                                {errors.password && (
                                    <div className="text-danger mt-1">{errors.password[0]}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="pop-title  my-3">Confirm New Password</label>
                               <div style={styles.wrapper}>
                        <input
                              type={showConfirm ? "text" : "password"}
                            className="form-control new_pass_input mb-4"
                            placeholder="Enter your password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button
                            type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                            style={styles.eyeBtn}
                              aria-label={showConfirm ? "Hide password" : "Show password"}
                        >
                             {showConfirm ? (
      // PART 1: Eye Open (no slash)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        {/* Outer eye */}
        <path
          d="M2 14S6 4 14 4s12 10 12 10-4 10-12 10S2 14 2 14z"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pupil */}
        <circle
          cx="14"
          cy="14"
          r="4"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      // PART 2: Eye Closed (with slash)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M16.9517 11.0482L11.0484 16.9516C10.29 16.1932 9.82336 15.1549 9.82336 13.9999C9.82336 11.6899 11.69 9.82324 14 9.82324C15.155 9.82324 16.1934 10.2899 16.9517 11.0482Z"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.79 6.73156C18.7483 5.19156 16.415 4.35156 14 4.35156C9.88167 4.35156 6.04333 6.77823 3.37167 10.9782C2.32167 12.6232 2.32167 15.3882 3.37167 17.0332C4.29333 18.4799 5.36667 19.7282 6.53333 20.7316"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.82336 22.785C11.1534 23.345 12.565 23.6484 14 23.6484C18.1184 23.6484 21.9567 21.2217 24.6284 17.0217C25.6784 15.3767 25.6784 12.6117 24.6284 10.9667C24.2434 10.36 23.8234 9.78838 23.3917 9.25171"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.095 14.8167C17.7917 16.4616 16.45 17.8033 14.805 18.1067"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.0483 16.9517L2.33331 25.6667"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.6667 2.33325L16.9517 11.0483"
          stroke="#606060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
                          
                        </button>
                        </div>
                                {errors.password_confirmation && (
                                    <div className="text-danger mt-1">{errors.password_confirmation[0]}</div>
                                )}
                            </div>
                        {/* Password rules list */}
      <div style={{ marginTop: 16 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {rules.map(({ key, label }) => {
            const passed = validations[key];
            const itemStyle = !showValidation
              ? styles.defaultItem
              : passed
                ? styles.validItem
                : styles.invalidItem;
            return (
              <li key={key} style={itemStyle}>
              
                {!showValidation ? (
                
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" className="me-2" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8.00016 1.33337C4.32683 1.33337 1.3335 4.32671 1.3335 8.00004C1.3335 11.6734 4.32683 14.6667 8.00016 14.6667C11.6735 14.6667 14.6668 11.6734 14.6668 8.00004C14.6668 4.32671 11.6735 1.33337 8.00016 1.33337ZM11.1868 6.46671L7.40683 10.2467C7.3135 10.34 7.18683 10.3934 7.0535 10.3934C6.92016 10.3934 6.7935 10.34 6.70016 10.2467L4.8135 8.36004C4.62016 8.16671 4.62016 7.84671 4.8135 7.65337C5.00683 7.46004 5.32683 7.46004 5.52016 7.65337L7.0535 9.18671L10.4802 5.76004C10.6735 5.56671 10.9935 5.56671 11.1868 5.76004C11.3802 5.95337 11.3802 6.26671 11.1868 6.46671Z" fill="#999999"/>
</svg>
                ) : passed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={styles.icon}
                  >
                    <path
                      d="M8.00004 1.33325C4.32671 1.33325 1.33337 4.32659 1.33337 7.99992C1.33337 11.6733 4.32671 14.6666 8.00004 14.6666C11.6734 14.6666 14.6667 11.6733 14.6667 7.99992C14.6667 4.32659 11.6734 1.33325 8.00004 1.33325ZM11.1867 6.46659L7.40671 10.2466C7.31337 10.3399 7.18671 10.3933 7.05337 10.3933C6.92004 10.3933 6.79337 10.3399 6.70004 10.2466L4.81337 8.35992C4.62004 8.16659 4.62004 7.84659 4.81337 7.65325C5.00671 7.45992 5.32671 7.45992 5.52004 7.65325L7.05337 9.18659L10.48 5.75992C10.6734 5.56659 10.9934 5.56659 11.1867 5.75992C11.38 5.95325 11.38 6.26659 11.1867 6.46659Z"
                      fill="#12D18E"
                    />
                  </svg>
                ) : (
                  <span style={styles.invalidCircle}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <path
                        d="M7 1L1 7M1 1L7 7"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
                            <button type="submit" className="form-button-1 mt-3">
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
        < Footer/>
        </>
       
    );
}
const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    paddingRight: "40px",     // make room for the icon
  },
  eyeBtn: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },// …your existing styles…
  defaultItem: {
    display: "flex",
    alignItems: "center",
    borderRadius: "6px",
    marginBottom: "8px",
    color: "#999",
  },
  defaultIcon: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    marginRight: "8px",
  },
  validItem: {
    display: "flex",
    alignItems: "center",
    borderRadius: "6px",
    marginBottom: "8px",
    color: "#12D18E",
  },
  invalidItem: {
    display: "flex",
    alignItems: "center",
    borderRadius: "6px",
    marginBottom: "8px",
    color: "#FF4242",
  },
  icon: {
    marginRight: "8px",
  },
  invalidCircle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "16px",
    height: "16px",
    backgroundColor: "#FF4242",
    borderRadius: "50%",
    marginRight: "8px",
  },
};
