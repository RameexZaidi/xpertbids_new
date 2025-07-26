import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import ForgotPassword from "./forgot-password"; // Adjust the import path as needed
import { useGoogleLogin } from '@react-oauth/google';


const LoginModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState("loginStep"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //const [token, setGoogleToken1] = useState("");

  //const { data: session } = useSession();
  const router = useRouter();

  const closeHandler = () => {
    setErrorMessage("");
    onClose();
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevent NextAuth from redirecting by default
      });

      if (result?.error) {
        console.log("Auth Error:", result.error); // Debugging to check the actual error

        if (result.error.includes("Email does not exist")) {
          setErrorMessage("This email is not registered.");
        } else if (result.error.includes("Password is incorrect")) {
          setErrorMessage("Incorrect password. Please try again.");
        }else if (result.error.includes("closed")) {
            setErrorMessage(result.error); // Show the exact Laravel message

        }else {
          setErrorMessage(result.error); // Show the exact Laravel message
        }
      } else {
        setErrorMessage(""); // Clear previous errors
        onClose(); // Close the modal on successful login
        router.push("/userDashboard"); // Redirect user
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleContinueWithPhone = () => {
  //   setCurrentStep("phoneLogin");
  // };

  const validatePhoneNumber = (num) => {
    return num.replace(/\D/g, "").length === 10;
  };

  const sendOtp = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage("Invalid phone number. Ensure it’s 11 digits long.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
       await axios.post(
        "https://admin.xpertbid.com/api/send-otp",
        {
          phone: `${countryCode}${phoneNumber}`,
        }
      );
      setCurrentStep("otpStep");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      setErrorMessage("Please enter the 4-digit OTP.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post("/api/verify-otp", {
        phone: `${countryCode}${phoneNumber}`,
        otp,
      });
      // OTP verified, handle user login
      console.log("OTP verified:", response.data.message);
      onClose(); // Close the modal after success
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to verify OTP.");
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
      if(result.error==='closed') alert('Account closed. Contact support.');

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


  const handleAppleSignIn = async () => {
    try {
      const result = await signIn("apple", { redirect: false });
      if (result?.error) {
        console.error("Apple Sign-In failed:", result.error);
      } else {
        console.log("Apple Sign-In success:", result);
        onClose(); // Close modal on success
      }
    } catch (error) {
      console.error("Error during Apple Sign-In:", error);
    }
  };

    if (currentStep === "forgotPassword") {
    return (
      <ForgotPassword
        isOpen={true}
        onClose={() => setCurrentStep("loginEmail")}
        onBack={() => setCurrentStep("loginEmail")}
      />
    );
  }
  if (!isOpen) return null;

  return (
    <div className="loginModal" style={{ display: isOpen ? "block" : "none" }}>
      <div className="loginModal-content">
        <span className="close-btn" id="closeLoginModal" onClick={closeHandler}>
          <i className="fa-solid fa-xmark"></i>
        </span>

        {currentStep === "loginStep" && (
          <div id="loginStep" className="login-form-step active" style={{backgroundColor:"transparent !important"}}>
            <h3 className="mb-5">Login or Sign up</h3>
            {/* <button
              onClick={handleContinueWithPhone}
              className="loginContinueIcon"
            >
              <img src="/assets/images/MobileLogo.svg" alt="" />
              Continue with Phone
            </button> */}
            
             <button className="loginContinueIcon" onClick={() => loginWithGoogleTap()}>
              <img src="/assets/images/googleLogo.svg" alt="Google Logo" /> Continue
              with Google
            </button>
            <button
              onClick={() => setCurrentStep("loginEmail")}
              className="loginContinueIcon"
            >
              <img src="/assets/images/smsLogo.svg" alt="" />
              Continue with Email
            </button>
            <button className="loginContinueIcon" onClick={handleAppleSignIn}>
              <img src="/assets/images/appleLogo.svg" alt="Apple Logo" /> Continue
              with Apple
            </button>
            <p className="loginp mt-3"> By continue, I agree to ExpertBid <span className="logina"><Link href="./Terms_Conditions" style={{textDecoration:"underline !important"}}>Terms of service</Link></span> and  <span className="logina"><Link href="./Privacy_Policy" style={{textDecoration:"underline !important"}}>privacy policy.</Link></span></p>
            {/* Add Google/Apple logic if needed */}
          </div>
        )}

        {currentStep === "phoneLogin" && (
          <div id="loginStep2" className="login-form-step">
            <div className="d-flex justify-content-center step-heading-and-back">
              <button
                id="backPhoneLogin"
                onClick={() => setCurrentStep("loginStep")}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <h3>Login with Phone</h3>
            </div>

            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="+1">+1 USA</option>
              <option value="+44">+44 UK</option>
              <option value="+91">+91 India</option>
              <option value="+92">+92 Pakistan</option>
            </select>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              aria-label="Phone number"
            />
            {errorMessage && <p className="error">{errorMessage}</p>}
            <br></br>
            <p className="loginp mt-2 mb-4">We will call or text you to send a verification code on your phone number to
            confirm it’s you. Standard rates apply. </p>
            <button
              className="form-button-1"
              onClick={sendOtp}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>

          </div>
        )}

        {currentStep === "otpStep" && (
          <div>
            <button
                id="backPhoneLogin"
                onClick={() => setCurrentStep("loginStep")}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            <h3>Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              aria-label="OTP"
            />
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button onClick={verifyOtp} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {currentStep === "loginEmail" && (
          <div id="loginEmail" className="login-form-step">
            <div className="d-flex justify-content-center step-heading-and-back">
              <button
                id="backPhoneLogin"
                onClick={() => setCurrentStep("loginStep")}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <h3 className="pop-heading      ">Login with Email</h3>
            </div>
            <div className="text-start mb-4">
            <h3>Continue with Email</h3>
            </div>

            <input
              type="email"
              placeholder="Enter your email here"
              value={email}
              id="emailInputLogin"
              onChange={(e) => setEmail(e.target.value)}
            />
           <div style={{ position: 'relative' }}>
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Enter Password"
    value={password}
    id="passwordInputLogin"
    onChange={(e) => setPassword(e.target.value)}
    style={{ paddingRight: '2.5rem' }}
  />
 <span
  onClick={() => setShowPassword(prev => !prev)}
  style={{
    position: 'absolute',
    right: '0.75rem',
    top: '42%',
    transform: 'translateY(-50%)',
    cursor: 'pointer'
  }}
>
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
</span>
</div>
            <div className="text-start">
            {errorMessage && (
              <span className="login-alert-message-login my-3 text-start">{errorMessage}</span>
            )}
            </div>
               <div className="text-end">
              <button
                className="text-deco"
                onClick={() => setCurrentStep("forgotPassword")}
              >
                Forgot Password?
            </button>
          
        </div>
            <button onClick={handleEmailLogin} className="form-button-1">
              Continue
            </button>
          </div>
        )}
          
        {/* Implement similar logic for forget password steps using states and conditional rendering */}
      </div>
    </div>
  );
};
export default LoginModal;
