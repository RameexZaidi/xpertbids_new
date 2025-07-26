import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import SuccessPopup from "../components/SuccessPopup"; // adjust the path as needed
import ErrorPopup from "../components/ErrorPopup"; // adjust the path as needed
export default function MultiStepModals() {
  const { data: session } = useSession();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewImage, setPreviewImage] = useState("assets/images/profile-circle.png");
  const [countries, setCountries] = useState([]);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState("");
    const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");
    const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");

  
  const [profileData, setProfileData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    country_id: "",
    usertype: "",
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://admin.xpertbid.com/api/get-countries"
        );
        setCountries(response.data?.country || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  
  
    // Trigger error popup if validation errors exist or a generic error message is passed when messageType is "danger"
    useEffect(() => {
      if (errors && Object.keys(errors).length > 0) {
        const combinedErrors = Object.values(errors).flat().join(" ");
        setErrorPopupMessage(combinedErrors);
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      } else if (message) {
        setErrorPopupMessage(message);
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      }
    }, [errors]);
    
    

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        username: session.user.username || "",
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        country_id: session.user.country_id || "",
        usertype: session.user.usertype || "",
      });

      if (session.user.profile_pic) {
        setPreviewImage(session.user.profile_pic);
      }
    }
  }, [session]);

  const handleCardClick = (type) => {
    setProfileData((prev) => ({
      ...prev,
      usertype: type === "Individual" ? "individual" : "business",
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file type is valid
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }
      setSelectedFile(file);  // Save the file so the button can be enabled
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("File loaded:", e.target.result);
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
      setSelectedFile(null);  // Ensure selectedFile is null if no file is selected
    }
  };
  
  useEffect(() => {
    if (!localStorage.getItem("hasSeenPopups")) {
      setCurrentStep(1);
      localStorage.setItem("hasSeenPopups", "true");
    }
  }, []);

  // Close modal
  const closeModal = () => setCurrentStep(0);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Modal navigation
  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const previousStep = () => setCurrentStep((prevStep) => prevStep - 1);
  const handleSubmitProfileInfo = async () => {
    if (!session) {
      alert("You must be signed in to continue.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("country_id", profileData.country_id);
      formData.append("usertype", profileData.usertype);

      // Append profile picture if selected
      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      }

      const response = await axios.post(
        "https://admin.xpertbid.com/api/user/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.profile) {
        //alert("Profile Info Updated Successfully!");
        closeModal();
        setMessage("Profile Info Updated Successfully!");
        setShowSuccessPopup(true);
        
      } else {
        

        setMessage("Failed to update profile. Please try again.");
        setSuccessPopupSubMessage("");
        setErrors({});
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        // Extract first error message from the validation errors
        const firstError = Object.values(error.response.data.errors)[0][0];
        setErrorPopupMessage(firstError);
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      } else {
        setErrorPopupMessage(
          error.response?.data?.message || "An unexpected error occurred."
        );
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      }
    }
  };
  return (
    <>
    {showSuccessPopup && (
            <SuccessPopup
              isOpen={showSuccessPopup}
              onClose={() => {
                setShowSuccessPopup(false);
                window.location.reload();
              }}
              message={message}
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
      {/* Step 1 - Profile Welcome */}
      {currentStep === 1 && (
        
        <div className="modal fade show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{backgroundColor:"#F9F9F9" , borderRadius:"20px"}}>
              <div className="modal-header">
                <div></div>
                <h5 className="modal-title ms-4 pop-head">Create your profile</h5>
                 <span className="close-btn" id="closeLoginModal" onClick={closeModal}>
          <i className="fa-solid fa-xmark"></i>
        </span>

               
              </div>
              <div className="modal-body text-center">
                <img src="assets/images/Group-1.png" className="my-4" alt="" />
                <h3 className="pop-head">Welcome to ExpertBid</h3>
                <p className="uppara px-5">Pick an image that shows your face. Your picture won’t be
public, we will keep this for our record.</p>
              </div>
              <div className="modal-footer mb-4" style={{border:"none"}}>
                <button className="btn btn-dark w-100 py-3" onClick={nextStep}>
                  Start exploring!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 - Individual or Business Owner Selection */}
      {currentStep === 2 && (
        <div className="modal fade show d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center">
              <button
               
                className="back-butt"
               onClick={() => setCurrentStep(1)} // or prevStep()
            aria-label="Back to step 1" 
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <h5 className="modal-title pop-head">Create your profile</h5>
             <p className="liss" style={{color:"#23262F" , fontWeight:"700" , margin:"0px"}} >Step 1/3</p>
            </div>
            <div className="modal-body">
              <h3 className="pop-head my-3">How would you like to continue?</h3>
              <p className="text-justify liss mb-5">This will help us to understand your identity. Both users have the same
features but it profile creation have different fields. </p>
              <div className="d-flex justify-content-center gap-3 mx-auto">
                {/* Individual Card */}
               {/* Individual Card */}
<div className={`choice-card shadow-lg text-center ${profileData.usertype === "individual" ? "selected-card" : ""}`}
     onClick={() => handleCardClick("Individual")}>
    <img src="assets/images/individual.png" alt="Individual" className="img-fluid mx-auto my-3" />
    <p className="fw-bolder">I am an individual</p>
</div>

{/* Business Owner Card */}
<div className={`choice-card shadow-lg text-center ${profileData.usertype === "business" ? "selected-card" : ""}`}
     onClick={() => handleCardClick("Business")}> {/*  Fix: Use "Business" */}
    <img src="assets/images/business-icon.png" alt="Business Owner" className="img-fluid mx-auto my-3" />
    <p className="fw-bolder">I am a business owner</p>
</div>


              </div>
            </div>
            <div className="modal-footer" style={{border:"none"}}>
            <button
  className="btn btn-dark w-100 py-3 mb-4"
  onClick={nextStep}
  disabled={!profileData.usertype} // Button is disabled if no field is selected
>
  Continue
</button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Remaining steps have been incremented (Step 3, Step 4, Step 5) */}
      {/* Add your existing step logic here for steps 3, 4, and 5 */}

      {/* Step 3 - Profile Info Form */}
      {currentStep === 3 && (
        <div className="modal fade show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ background: "#F9F9F9" , borderRadius:"20px"}}>
              <div className="modal-header">
                 <button
               
                className="back-butt"
               onClick={() => setCurrentStep(2)} // or prevStep()
            aria-label="Back to step 2" 
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
                <h5 className="modal-title pop-head ms-4">Create your profile</h5>
                <p className="liss" style={{color:"#23262F" , fontWeight:"700" , margin:"0px"}} >Step 2/3</p>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label pop-title ms-2">Username*</label>
                    <input
                      type="text"
                      className="form-control pop-input"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label pop-title ms-2">Your Name*</label>
                    <input
                      type="text"
                      className="form-control pop-input"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label pop-title ms-2">Select Country*</label>
                    <select
                      name="country_id"
                      value={profileData.country_id}
                      onChange={handleInputChange}
                      className="form-control pop-input mb-5"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer" style={{border:"none"}}>
              <button
            className="btn btn-dark w-100 py-3"
            onClick={nextStep}
            disabled={
              !(
                profileData.username &&
                profileData.name &&
                profileData.country_id
              )
            }
          >
            Continue
          </button>
              </div>
            </div>
          </div>
        </div>
      )}
         {/* Step 4 - Profile Picture Upload */}
         {currentStep === 4 && (
  <div
    className="modal fade show d-block"
    style={{ background: "rgba(0, 0, 0, 0.5)" }}
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
         <button
               
                className="back-butt"
               onClick={() => setCurrentStep(3)} // or prevStep()
            aria-label="Back to step 3" 
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
          <h3 className="modal-title ms-4 pop-head">Create your profile</h3>
           <p className="liss" style={{color:"#23262F" , fontWeight:"700" , margin:"0px"}} >Step 3/3</p>
        </div>
        <div className="modal-body text-center">
          <input
            type="file"
            ref={fileInputRef}
            className="d-none"
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png"
          />
          <img
            src={previewImage || "/assets/images/placeholder.png"}
            alt="Profile"
            className="my-4 rounded-circle"
            style={{
              width: "150px",
              height: "150px",
              cursor: "pointer",
            }}
           
          />
          <h3 className="my-3 pop-head">Add a profile picture</h3>
          <p className="px-4 uppara">
            Pick an image that shows your face. Your picture won’t be public;
            we will keep this for our record.
          </p>
        </div>
        <div className="modal-footer" style={{border:"none"}}> 
          <button
            className="btn btn-dark w-100 py-3"
            onClick={() => fileInputRef.current.click()}
              // Upload button enabled only if a file is selected
          >
            Select a Picture
          </button>
          <button
  className="btn btn-dark w-100 py-3 d-flex align-items-center justify-content-between  "
  onClick={nextStep}
  disabled={!selectedFile}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    className=""
    viewBox="0 0 28 28"
    fill="none"
  >
    <path
      d="M10.5 19.8333V12.8333L8.16667 15.1666"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 12.8333L12.8333 15.1666"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.6667 11.6666V17.4999C25.6667 23.3333 23.3333 25.6666 17.5 25.6666H10.5C4.66666 25.6666 2.33333 23.3333 2.33333 17.4999V10.4999C2.33333 4.66659 4.66666 2.33325 10.5 2.33325H16.3333"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.6667 11.6666H21C17.5 11.6666 16.3333 10.4999 16.3333 6.99992V2.33325L25.6667 11.6666Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  <span className="me-2">Upload a photo</span>
  <span></span>
</button>
<div className="text-center w-100">
<button type="button" className="text-center" onClick={closeModal} style={{border:"none" , backgroundColor:"transparent" , color:"#999"}}> I’ll do later on</button>
        </div>
        </div>
      </div>
    </div>
  </div>
)}


           {/* Step 5 - Final Confirmation */}
      {currentStep === 5 && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
              <button
               
                className="back-butt"
               onClick={() => setCurrentStep(4)} // or prevStep()
            aria-label="Back to step 4" 
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
                <h3 className="modal-title ms-4 pop-head">Create your profile</h3>
                  <p className="liss" style={{color:"#23262F" , fontWeight:"700" , margin:"0px"}} >Step 3/3</p>
              </div>
              <div className="modal-body text-center">
                <img src={previewImage} alt="Profile" className="my-4 rounded-circle" style={{ width: "150px", height: "150px" }} />
                <h3 className="pop-head">Looking good!</h3>
                <p className="mb-4 liss">This photo will be added to your profile.</p>
              </div>
              <div className="modal-footer text-start justify-content-start "  style={{border : "none"}}>
                <button className="btn mx-1 px-3 py-3 mb-4" style={{width: "47%" , color : "#23262F !important", border : "2px solid #23262F" }} onClick={previousStep}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" className="me-2" height="28" viewBox="0 0 28 28" fill="none">
  <path d="M10.5 19.8333V12.8333L8.16663 15.1666" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10.5 12.8333L12.8333 15.1666" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M25.6667 11.6666V17.4999C25.6667 23.3333 23.3334 25.6666 17.5 25.6666H10.5C4.66671 25.6666 2.33337 23.3333 2.33337 17.4999V10.4999C2.33337 4.66659 4.66671 2.33325 10.5 2.33325H16.3334" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M25.6667 11.6666H21C17.5 11.6666 16.3334 10.4999 16.3334 6.99992V2.33325L25.6667 11.6666Z" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
                  <span className="mt-2">Change photo</span>
                </button>
                <button className="btn btn-dark mx-1 mb-4  px-5 py-3" style={{width: "47%", border:"2px solid black"}} onClick={handleSubmitProfileInfo}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>

  );
}
