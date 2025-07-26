import  { useState , useEffect} from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useGoogleLogin } from '@react-oauth/google';
import Link from "next/link";


const SignupModal = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState("step1");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    countryCode: "+1",
  });

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  // const [passwordStrength, setPasswordStrength] = useState({
  //   length: false,
  //   uppercase: false,
  //   lowercase: false,
  //   number: false,
  // });
  // Resend Code State
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
      lower: /[a-z]/.test(formData.password),
      upper: /[A-Z]/.test(formData.password),
      number: /\d/.test(formData.password),
      length: formData.password.length >= 8,
    });
  }, [formData.password]);
  const rules = [
    { key: "lower", label: "At least one lowercase letter" },
    { key: "upper", label: "At least one uppercase letter" },
    { key: "number", label: "At least one number" },
    { key: "length", label: "Minimum 8 characters" },
  ];
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const closeHandler = () => {
    onClose();
    setActiveStep("step1");
    setFormData({
      email: "",
      password: "",
      phone: "",
      countryCode: "+1",
    });
    
    setErrorMessage("");
    setVerificationCode("");
    setSuccessMessage("");
    setIsResendDisabled(false);
    setResendTimer(60);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const registerWithEmail = async () => {
    if (!formData.name ||!formData.email || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `https://admin.xpertbid.com/api/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      setSuccessMessage("Registration successful! Sending verification code...");
      await sendVerificationCode();
    } catch (error) {
      //sconsole.log(error.response.data.message);
      setErrorMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };


  const verifyCode = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `https://admin.xpertbid.com/api/verify-code`,
        {
          email: formData.email,
          code: verificationCode,
        }
      );

      setSuccessMessage("Verification successful! Logging you in...");
      await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      router.push("/userDashboard");
    } catch (error) {
      setErrorMessage("Invalid verification code. Please try again.",error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    try {
      await axios.post(
        `https://admin.xpertbid.com/api/send-verification-code`,
        { email: formData.email }
      );
      setSuccessMessage("Verification code sent to your email.");
      handleStepChange("verifyCode");
    } catch (error) {
      setErrorMessage("Failed to send verification code. Please try again.",error);
    }
  };

  // Resend Code Functionality
  const handleResendCode = async () => {
    try {
      setIsResendDisabled(true);
      setResendTimer(60);

      await axios.post(
        `https://admin.xpertbid.com/api/send-verification-code`,
        { email: formData.email }
      );

      setSuccessMessage("Verification code resent to your email.");

      // Start countdown timer
      const timerInterval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerInterval);
            setIsResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrorMessage("Failed to resend verification code. Try again.", error);
      setIsResendDisabled(false);
    }
  };
  // const togglePasswordVisibility = () => {
  //   setPasswordVisible((prev) => !prev);
  // };
  const registerWithPhone = async () => {
    if (!formData.name || !formData.phone) {
      setErrorMessage("Name and phone number are required.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register-phone`,
        {
          name: formData.name,
          phone: `${formData.countryCode}${formData.phone}`,
        }
      );
      setSuccessMessage(
        "Registration successful! Please verify the OTP sent to your phone."
      );
      handleStepChange("otpVerification");
    } catch {
      setErrorMessage("An error occurred during phone registration.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginWithGoogleTap = useGoogleLogin({
    flow: "implicit",
    onSuccess: async resp => {
      console.log("Google response:", resp);
      const accessToken = resp?.access_token;
      if (!accessToken) {
        console.error("No access_token returned:", resp);
        return;
      }

      const result = await signIn("google-tap", {
        token:    accessToken,
        redirect: false,
      });

      if (result?.error) {
        console.error("Google-tap signIn error:", result.error);
      } else {
        router.push("/userDashboard");
      }
    },
    onError: err => {
      console.error("Google Tap failed:", err);
    },
  });
  // const handleGoogleSignUp = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     const googleToken = tokenResponse.credential || tokenResponse.access_token;
  //     console.log("Google token:", googleToken);
  //     // Pass to Laravel or NextAuth
  //     await handleGoogleSuccess(googleToken);
  //   },
  //   onError: () => {
  //     console.error("Google Sign-In failed");
  //   },
  //   flow: "implicit", // or "auth-code" depending on your setup
  // });
  // const handleGoogleSuccess = async (token) => {
  //   //const googleToken = credentialResponse.credential;
  //   //console.log(googleToken1);

  //   try {
  //     const res = await axios.post("https://admin.xpertbid.com/api/google-register", {
  //       token: token,
  //     }, {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     //const data = res.data;

  //     if (!res.data) {
  //       //console.error("Google sign-up failed:", res.data.message);
  //       return;
  //     }
  //     if(res.data.message){
  //       setSuccessMessage( res.data.message);
  //       setErrorMessage("");
  //     }else{
  //       setErrorMessage(res.data.error);
  //     }
  //     // Now manually trigger a signIn with token
  //     const result = await signIn("google", {
  //       callbackUrl: "/userDashboard",
  //     });
  //     if (result?.error) {
  //       setErrorMessage("Google Sign-Up failed. Please try again."); 
  //      // handleStepChange("success");
  //       // router.push("/userDashboard");
  //     } else {
  //       setSuccessMessage( "Google Sign-up successful!");
  //     }
  //   } catch (err) {
  //     console.error("Google login error:", err);
  //   }
  // };

  
  
  // const handleGoogleSignUp = async () => {
  //   try {
  //     const result = await signIn("google", { callbackUrl: "/userDashboard" });
  //     if (result?.error) {
  //       setErrorMessage("Google Sign-Up failed. Please try again.");
  //     } else {
  //       setSuccessMessage( "Google Sign-up successful!");
  //       handleStepChange("success");
  //      // router.push("/userDashboard");
  //     }
  //   } catch {
  //     setErrorMessage("An error occurred during Google Sign-Up.");
  //   }
  // };

  const handleAppleSignUp = async () => {
    try {
      const result = await signIn("apple", { redirect: false });
      if (result?.error) {
        setErrorMessage("Apple Sign-Up failed. Please try again.");
      } else {
        setSuccessMessage("Apple Sign-Up successful!");
        handleStepChange("success");
        router.push("/userDashboard");
      }
    } catch {
      setErrorMessage("An error occurred during Apple Sign-Up.");
    }
  };

  if (!isOpen) return null;
  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(
        Math.floor(Math.random() * charset.length)
      );
    }
    setFormData({ ...formData, password: generatedPassword });
  };


  return (
    <div
      id="SignupModal"
      className="modal signupModal loginModal"
      style={{ display: isOpen ? "flex" : "none" }}
    >
      <div className="loginModal-content">
        <span id="closeLoginModal" className="close-btn" onClick={closeHandler}>
          <i className="fa-solid fa-xmark"></i>
        </span>

        {activeStep === "step1" && (
          <div id="loginStep" className=" login-form-step active ms-auto" style={{backgroudColor:"transparent"}}>
            <h3 className="pop-head mb-3">Sign Up</h3>
            <hr></hr>
            <button onClick={() => loginWithGoogleTap()} className="loginContinueIcon mt-4 ms-auto">
              <img src="/assets/images/googleLogo.svg" alt="Google Logo" />
              Continue with Google
            </button>
            <button className="loginContinueIcon ms-auto" onClick={handleAppleSignUp}>
              <img src="/assets/images/appleLogo.svg" alt="Apple Logo" />
              Continue with Apple
            </button>
            <button
              className="loginContinueIcon ms-auto "
              onClick={() => handleStepChange("emailSignup")}
            >
              <img src="/assets/images/smsLogo.svg" alt="Email Logo" />
              Sign Up with Email
            </button>
            {/* <button
              className="loginContinueIcon"
              onClick={() => handleStepChange("phoneSignup")}
            >
              <img src="/assets/images/MobileLogo.svg" alt="phone Logo" />
              Sign Up with Phone
            </button> */}<p className="loginp mt-3"> By continue, I agree to ExpertBid 
          <span className="logina"><Link href="./Terms_Conditions"> Terms of service </Link></span>
           and 
            <span className="logina">
            <Link href="./Privacy_Policy" > privacy policy. </Link></span></p>
          </div>
          
        )}

{activeStep === "emailSignup" && (
          <div id="loginEmail" className="login-form-step ">
            <div className="d-flex justify-content-center step-heading-and-back">
            <button
                id="backPhoneLogin"
                className="d-block ms-0"
                onClick={() => handleStepChange("step1")}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <h3>Sign Up with Email</h3>



            </div>
<h3 className="pop-head text-start mb-4 ms-2">Continue with Email</h3>
            <input
              type="text"
              id="name"
              className="pop-"
              placeholder="Enter your name here"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              id="email"
              placeholder="Enter your email here"
              value={formData.email}
              onChange={handleInputChange}
              
            />
            <div className="password-field">

     <input
   type={passwordVisible ? "text" : "password"}
   id="password"
   placeholder="Enter your password"
   value={formData.password}
   onChange={(e) => {
     // 1) update your form data
     handleInputChange(e);
     // 2) only now enable the validation list
     if (!showValidation) setShowValidation(true);
   }}
   required
   style={styles.input}
 />

      <button
        type="button"
        className="toggle-password"
        onClick={() => setPasswordVisible(!passwordVisible)}
      >
      {passwordVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M16.9517 11.0482L11.0484 16.9516C10.29 16.1932 9.82336 15.1549 9.82336 13.9999C9.82336 11.6899 11.69 9.82324 14 9.82324C15.155 9.82324 16.1934 10.2899 16.9517 11.0482Z" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M20.79 6.73156C18.7483 5.19156 16.415 4.35156 14 4.35156C9.88167 4.35156 6.04333 6.77823 3.37167 10.9782C2.32167 12.6232 2.32167 15.3882 3.37167 17.0332C4.29333 18.4799 5.36667 19.7282 6.53333 20.7316" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M9.82336 22.785C11.1534 23.345 12.565 23.6484 14 23.6484C18.1184 23.6484 21.9567 21.2217 24.6284 17.0217C25.6784 15.3767 25.6784 12.6117 24.6284 10.9667C24.2434 10.36 23.8234 9.78838 23.3917 9.25171" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M18.095 14.8167C17.7917 16.4616 16.45 17.8033 14.805 18.1067" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
   <path
      d="M2 14 C2 14 6 4 14 4 C22 4 26 14 26 14 C26 14 22 24 14 24 C6 24 2 14 2 14 Z"
      stroke="#606060"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* pupil */}
    <path
      d="M14 10 A4 4 0 1 0 14 18 A4 4 0 1 0 14 10 Z"
      stroke="#606060"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
</svg>
          ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M16.9517 11.0482L11.0484 16.9516C10.29 16.1932 9.82336 15.1549 9.82336 13.9999C9.82336 11.6899 11.69 9.82324 14 9.82324C15.155 9.82324 16.1934 10.2899 16.9517 11.0482Z" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M20.79 6.73156C18.7483 5.19156 16.415 4.35156 14 4.35156C9.88167 4.35156 6.04333 6.77823 3.37167 10.9782C2.32167 12.6232 2.32167 15.3882 3.37167 17.0332C4.29333 18.4799 5.36667 19.7282 6.53333 20.7316" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M9.82336 22.785C11.1534 23.345 12.565 23.6484 14 23.6484C18.1184 23.6484 21.9567 21.2217 24.6284 17.0217C25.6784 15.3767 25.6784 12.6117 24.6284 10.9667C24.2434 10.36 23.8234 9.78838 23.3917 9.25171" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M18.095 14.8167C17.7917 16.4616 16.45 17.8033 14.805 18.1067" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M11.0483 16.9517L2.33331 25.6667" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M25.6667 2.33325L16.9517 11.0483" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
          )}
      </button>
</div> {errorMessage && <p className="alert-message text-start">{errorMessage}</p>}
   {/* Password rules list */}
      <div style={{ marginTop: 16 }}>
        <ul className="mb-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
<div className="">
    <button type="button" className="form-button-1 ms-auto mb-1 text-decoration-none " onClick={generatePassword}>
        Generate Password
      </button>
      </div>

            {/* <input
              type={passwordVisible ? "text" : "password"}
              id="confirmPassword"
              placeholder="Retype your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            /> */}
            {/* Password Strength Indicators */}
            {/* <div className="password-strength">
              <p
              className={passwordStrength.length ? "valid" : "invalid"}>
              {passwordStrength.length ? "✔ " : "✖ "}
                 Minimum 8 characters
                 </p>
              <p
              className={passwordStrength.uppercase ? "valid" : "invalid"}>
              {passwordStrength.uppercase ? "✔ " : "✖ "}
               At least one uppercase letter
              </p>
              <p
              className={passwordStrength.lowercase ? "valid" : "invalid"}>
              {passwordStrength.lowercase ? "✔ " : "✖ "}
               At least one lowercase letter
             </p>
              <p
              className={passwordStrength.number ? "valid" : "invalid"}>
              {passwordStrength.number ? "✔ " : "✖ "}
               At least one number
              </p>
            </div> */}
           
            <button
              className="form-button-1 ms-auto"
              onClick={registerWithEmail}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Submit"}
            </button>
          </div>
        )}
   {/* Step: Verify Email */}
   {activeStep === "verifyCode" && (
          <div id="loginEmail" className="login-form-step">
            <button className="d-block ms-1" onClick={() => handleStepChange("step1")}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <h3 className="pop-head text-start my-3 mt-5">Verify Email</h3>
            <p className="liss text-start mb-5" style={{fontSize:"16px"}}>A verification code has been sent to your email. Please enter it below:</p>

            <input
              type="text"
              id="verificationCode"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />

            {errorMessage && <p className="alert-message">{errorMessage}</p>}

            {/* Resend Code Section */}
            <div className="resend-code-container">
              <button className=" mb-1 form-button-1 ms-auto" onClick={handleResendCode} disabled={isResendDisabled}>
                {isResendDisabled ? `Resend in ${resendTimer}s` : "Resend Code"}
              </button>
            </div>

            <button className="form-button-1 ms-auto" onClick={verifyCode} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}






        {activeStep === "phoneSignup" && (
          <div id="loginStep2" className="login-form-step">
            <div className="d-flex justify-content-center step-heading-and-back">
              <button
                id="backPhoneLogin"
                onClick={() => handleStepChange("Step1")}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <h3>Sign Up with Phone</h3>
            </div>

            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <select
              value={formData.countryCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  countryCode: e.target.value,
                }))
              }
            >
              <option value="+1">+1 USA</option>
              <option value="+44">+44 UK</option>
              <option value="+91">+91 India</option>
              <option value="+92">+92 PK</option>
            </select>
            <input
              type="text"
              id="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errorMessage && <p className="alert-message ">{errorMessage}</p>}
            <button
              className="form-button-1 "
              onClick={registerWithPhone}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Submit"}
            </button>
          </div>
        )}

        {activeStep === "success" && (
          <div className="form-step">
            <span id="closeLoginModal" className="close-btn" onClick={closeHandler}>
          <i className="fa-solid fa-xmark"></i>
        </span>
            {/* <h3>Registration Complete Please login.</h3> */}
            <br></br>
            {successMessage ? (
              <h4 className="alert alert-success" style={{ fontWeight: "bold", marginTop: "10px" }}>{successMessage}</h4>
            ) : (
              <h4 className="alert alert-danger" style={{ fontWeight: "bold", marginTop: "10px" }}>{errorMessage}</h4>
            )}
          
          </div>
        )}
      </div>
      {/* CSS for styling the strength indicators */}
      <style jsx>{`
        .password-strength p {
          font-size: 14px;
          margin: 5px 0;
        }
        .valid {
          color: green;
        }
        .invalid {
          color: red;
        }
      `}</style>
    </div>
  );
};
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

export default SignupModal;
