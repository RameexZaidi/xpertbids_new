import { useState, useEffect, useRef } from "react";
import axios from "axios";
//import { Oval } from "react-loader-spinner"; // Import the loader
import SuccessPopup from "@/components/SuccessPopup"; // adjust the path as needed
import ErrorPopup from "@/components/ErrorPopup"; // adjust the path as needed
import { signOut,useSession } from "next-auth/react";

const isFullPath = (url) => {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};


const defaultProfileImage = "/assets/images/user.jpg"; // Ensure this exists

const ProfileSection = ({
  profile,
  setProfile,
  saveProfile,
  loading,
  errors,
  message,
  messageType, // still provided by parent if needed, but will not block success popup
}) => {
   const { data: session } = useSession();

  const [countries, setCountries] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  //const [imageLoading, setImageLoading] = useState(true); // Loader state
const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("showBusinessInfo");
      if (saved === "true") {
        setShowBusinessInfo(true);
      }
    }
  }, []);

  const handleLogout = async ({ closeAccount = false } = {}) => {
    try {
      // 1) Optionally close account first
      if (closeAccount && session?.user?.token) {
        await axios.post(
          "https://admin.xpertbid.com/api/user/close",
          {},
          { headers: { Authorization: `Bearer ${session.user.token}` } }
        );
      }

      // 2) Call your Laravel logout
      if (session?.user?.token) {
        await axios.post(
          "https://admin.xpertbid.com/api/logout",
          {},
          { headers: { Authorization: `Bearer ${session.user.token}` } }
        );
      }

      // 3) Clear client storage
      localStorage.removeItem("nextauth.message");
      sessionStorage.clear();
      document.cookie = "next-auth.session-token=; Max-Age=0; path=/;";

      // 4) Sign out of NextAuth and redirect home
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Logout error:", err);
      await signOut({ callbackUrl: "/" });
    }
  };
  // Jab user click kare
  const handleAddBusinessInfo = () => {
    setShowBusinessInfo(true);
    localStorage.setItem("showBusinessInfo", "true");
  };
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesRes = await axios.get(
          "https://admin.xpertbid.com/api/get-countries"
        );
        setCountries(countriesRes.data.country);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // useEffect(() => {
  //   // Stop the image loader after 3 seconds
  //   const timer = setTimeout(() => {
  //     setImageLoading(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);

  // Trigger success popup if there's a message (and no errors)
  useEffect(() => {
    if (message && Object.keys(errors).length === 0) {
      console.log("Success message:", message);
      setSuccessPopupMessage(message);
      setSuccessPopupSubMessage("Your profile has been updated successfully!");
      setShowSuccessPopup(true);
      console.log("Success popup triggered");
    }
  }, [message, errors]);

  // Trigger error popup if validation errors exist or a generic error message is passed when messageType is "danger"
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const combinedErrors = Object.values(errors).flat().join(" ");
      console.log("Combined error messages:", combinedErrors);
      setErrorPopupMessage(combinedErrors);
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
    } else if (message && messageType === "danger") {
      console.log("Error message:", message);
      setErrorPopupMessage(message);
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
    }
  }, [errors, message, messageType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show preview immediately
      setProfile((prev) => ({
        ...prev,
        profile_pic: file, // Keep the file for uploading
      }));
    }
  };
const handleRemoveImage = async () => {
  // 1) clear preview
  setImagePreview("");

  // 2) build the new profile object with '' for profile_pic
  const newProfile = { ...profile, profile_pic: "" };

  // 3) update parent state immediately (for UI)
  setProfile(newProfile);

  // 4) reset the file input element
  if (fileInputRef.current) fileInputRef.current.value = "";

  // 5) *then* call saveProfile with that fresh object
  try {
    await saveProfile(newProfile);
  } catch (err) {
    console.error("Failed to remove image:", err);
  }
};
  return (
    <div className="profile">
      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => {
            setShowSuccessPopup(false);
            window.location.reload();
          }}
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
      <div className="profile-heading-and-button">
        <h3>My Profile</h3>
        <button
          className="button-style-2"
          onClick={saveProfile}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="profile-piture-and-upldRmov">
        <div className="row align-items-center">
          <div className="col-md-7">
            <div className="profile-photo-format">
              
                <img
                  id="profileImage"
                  src={
                    imagePreview ||
                    (profile.profile_pic && isFullPath(profile.profile_pic)
                      ? profile.profile_pic
                      : profile.profile_pic
                      ? `https://admin.xpertbid.com/${profile.profile_pic}`
                      : defaultProfileImage)
                  }
                  onError={(e) => {
                    e.target.src = defaultProfileImage;
                  }}
                  style={{ width: "150px", objectFit: "cover" , borderRadius:"100%" , height:"150px"}}
                  alt="Profile"
                />
             
            <div className="user_profile">
            <h2>Profile Picture </h2>
            <p>Upload any PNG, JPG file under 5MB.  </p>
          </div>
          </div> 
         
          </div>


           <div className="col-md-5">
              <div className="profile-upload-btn">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="profile_pic"
                  id="profileInput"
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                
                   onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        e.target.value = ""; // Clear the file input
        return;
      }
      handleImageChange(e); // Proceed with your existing handler
    }
  }}
/>

              
                <button
                  className="upload upload-btn button-style-3"
                  onClick={() => fileInputRef.current.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="me-2" fill="none">
  <path d="M7.50065 14.1667V9.16675L5.83398 10.8334" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M7.5 9.16675L9.16667 10.8334" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M18.3327 8.33342V12.5001C18.3327 16.6667 16.666 18.3334 12.4993 18.3334H7.49935C3.33268 18.3334 1.66602 16.6667 1.66602 12.5001V7.50008C1.66602 3.33341 3.33268 1.66675 7.49935 1.66675H11.666" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M18.3327 8.33341H14.9993C12.4993 8.33341 11.666 7.50008 11.666 5.00008V1.66675L18.3327 8.33341Z" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
                  Upload
                </button>
               <button className="remove remove-btn button-style-3"  onClick={handleRemoveImage}>
  {/* SVG icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="remove-icon"
  >
    <path
      d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
      stroke="#23262F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.08398 4.14175L7.26732 3.05008C7.40065 2.25841 7.50065 1.66675 8.90898 1.66675H11.0923C12.5007 1.66675 12.609 2.29175 12.734 3.05841L12.9173 4.14175"
      stroke="#23262F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.7077 7.6167L15.166 16.0084C15.0743 17.3167 14.9993 18.3334 12.6743 18.3334H7.32435C4.99935 18.3334 4.92435 17.3167 4.83268 16.0084L4.29102 7.6167"
      stroke="#23262F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.60742 13.75H11.3824"
      stroke="#23262F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.91602 10.4167H12.0827"
      stroke="#23262F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  {/* Button text */}
  Remove
</button>

              </div>
              </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="personal-information">
        <h3>Personal Information</h3>
        <form>
          <div className="row">
           <div className="col-md-6 form-child position-relative">
  <label>Email*</label>
  <input
    type="text"
    name="email"
    value={profile.email}
    onChange={handleInputChange}
    placeholder="Enter Email"
    className="form-control"
  />

  {profile.email && (
    <div className="input-icon-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M15.9993 2.66675C8.65268 2.66675 2.66602 8.65341 2.66602 16.0001C2.66602 23.3467 8.65268 29.3334 15.9993 29.3334C23.346 29.3334 29.3327 23.3467 29.3327 16.0001C29.3327 8.65341 23.346 2.66675 15.9993 2.66675ZM22.3727 12.9334L14.8127 20.4934C14.626 20.6801 14.3727 20.7867 14.106 20.7867C13.8393 20.7867 13.586 20.6801 13.3993 20.4934L9.62602 16.7201C9.23935 16.3334 9.23935 15.6934 9.62602 15.3067C10.0127 14.9201 10.6527 14.9201 11.0393 15.3067L14.106 18.3734L20.9594 11.5201C21.346 11.1334 21.986 11.1334 22.3727 11.5201C22.7593 11.9067 22.7593 12.5334 22.3727 12.9334Z"
          fill="#12D18E"
        />
      </svg>
    </div>
  )}

  {errors?.email && (
    <small className="text-danger">{errors.email[0]}</small>
  )}
</div>

          <div className="col-md-6 form-child position-relative">
  <label>Phone Number*</label>
  <input
    type="text"
    name="phone"
    value={profile.phone}
    onChange={handleInputChange}
    placeholder="Enter Phone Number"
    className="form-control"
  />

  {profile.phone && (
    <div className="input-icon-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M15.9993 2.66675C8.65268 2.66675 2.66602 8.65341 2.66602 16.0001C2.66602 23.3467 8.65268 29.3334 15.9993 29.3334C23.346 29.3334 29.3327 23.3467 29.3327 16.0001C29.3327 8.65341 23.346 2.66675 15.9993 2.66675ZM22.3727 12.9334L14.8127 20.4934C14.626 20.6801 14.3727 20.7867 14.106 20.7867C13.8393 20.7867 13.586 20.6801 13.3993 20.4934L9.62602 16.7201C9.23935 16.3334 9.23935 15.6934 9.62602 15.3067C10.0127 14.9201 10.6527 14.9201 11.0393 15.3067L14.106 18.3734L20.9594 11.5201C21.346 11.1334 21.986 11.1334 22.3727 11.5201C22.7593 11.9067 22.7593 12.5334 22.3727 12.9334Z"
          fill="#12D18E"
        />
      </svg>
    </div>
  )}

  {errors?.phone && (
    <small className="text-danger">{errors.phone[0]}</small>
  )}
</div>

            <div className="col-md-6 form-child position-relative">
  <label>Your Full Name*</label>
  <input
    type="text"
    name="name"
    value={profile.name}
    onChange={handleInputChange}
    placeholder="Enter Full Name"
    className="form-control"
  />

  {profile.name && (
    <div className="input-icon-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M15.9993 2.66675C8.65268 2.66675 2.66602 8.65341 2.66602 16.0001C2.66602 23.3467 8.65268 29.3334 15.9993 29.3334C23.346 29.3334 29.3327 23.3467 29.3327 16.0001C29.3327 8.65341 23.346 2.66675 15.9993 2.66675ZM22.3727 12.9334L14.8127 20.4934C14.626 20.6801 14.3727 20.7867 14.106 20.7867C13.8393 20.7867 13.586 20.6801 13.3993 20.4934L9.62602 16.7201C9.23935 16.3334 9.23935 15.6934 9.62602 15.3067C10.0127 14.9201 10.6527 14.9201 11.0393 15.3067L14.106 18.3734L20.9594 11.5201C21.346 11.1334 21.986 11.1334 22.3727 11.5201C22.7593 11.9067 22.7593 12.5334 22.3727 12.9334Z"
          fill="#12D18E"
        />
      </svg>
    </div>
  )}

  {errors?.name && (
    <small className="text-danger">{errors.name[0]}</small>
  )}
</div>
<div className="col-md-6 form-child position-relative">
  <label>Country*</label>
  <select
    name="country_id"
    value={profile.country_id}
    onChange={handleInputChange}
    className="form-control"
  >
    <option value="">Select Country</option>
    {Array.isArray(countries) &&
      countries.map((country) => (
        <option key={country.id} value={country.id}>
          {country.name}
        </option>
      ))}
  </select>

  {/* custom dropdown arrow */}
  <div className="input-icon-wrapper">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4.07992 8.95011L10.5999 15.4701C11.3699 16.2401 12.6299 16.2401 13.3999 15.4701L19.9199 8.95011"
        stroke="#606060"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>

  {errors?.country_id && (
    <small className="text-danger">{errors.country_id[0]}</small>
  )}
</div>
  {/* “Add Business Info” button */}
      {!showBusinessInfo && (
        <div
          className="business_info d-flex align-items-center"
          onClick={handleAddBusinessInfo}
          style={{ cursor: "pointer" }}
        >
          {/* SVG icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="me-2" viewBox="0 0 20 20" fill="none">
      <path d="M9.99935 18.3334C14.5827 18.3334 18.3327 14.5834 18.3327 10.0001C18.3327 5.41675 14.5827 1.66675 9.99935 1.66675C5.41602 1.66675 1.66602 5.41675 1.66602 10.0001C1.66602 14.5834 5.41602 18.3334 9.99935 18.3334Z" stroke="#43ACE9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66602 10H13.3327" stroke="#43ACE9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 13.3334V6.66675" stroke="#43ACE9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
          <p className="align-content-center">Add Business Info</p>
        </div>
      )}

      {/* Business fields */}
      {showBusinessInfo && (
        <div className="bussiness_feilds mt-3">
          <h3>Business Information</h3>
          <div className="row">
            {/* Company Name */}
            <div className="col-md-6 form-child position-relative">
              <label>Company Name*</label>
              <input
                type="text"
                name="company_name"
                value={profile.company_name}
                onChange={handleInputChange}
                placeholder="Please enter your Company Name"
                className="form-control"
              />
              {errors?.company_name && (
                <small className="text-danger">{errors.company_name[0]}</small>
              )}
            </div>
            {/* VAT Number */}
            <div className="col-md-6 form-child position-relative">
              <label>VAT Number</label>
              <input
                type="number"
                name="vat_number"
                value={profile.vat_number}
                onChange={handleInputChange}
                placeholder="Please enter your VAT Number"
                className="form-control"
              />
              {errors?.vat_number && (
                <small className="text-danger">{errors.vat_number[0]}</small>
              )}
            </div>
          </div>
        </div>
      )}

          </div>
        </form>
       <button  onClick={() => handleLogout({ closeAccount: true })} className="btn mt-4 btn-danger">
          Close my account
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
