import { useState, useEffect } from "react";
import axios from "axios";
//import { Oval } from "react-loader-spinner"; // Import the loader
import SuccessPopup from "@/components/SuccessPopup"; // adjust the path as needed
import ErrorPopup from "@/components/ErrorPopup"; // adjust the path as needed
import { useSession } from "next-auth/react";
const AddressComponent = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
    contactNumber: "",
    otherNumber: "",
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Popup states for success and error
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");
  const [errors, setErrors] = useState({}); // Holds field-specific errors

  // Fetch countries and saved address when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // First, fetch countries
        const countriesRes = await axios.get(
          "https://admin.xpertbid.com/api/get-countries"
        );
        // Check different potential response structures:
        if (countriesRes.data && Array.isArray(countriesRes.data.country)) {
          setCountries(countriesRes.data.country);
        } else if (countriesRes.data && Array.isArray(countriesRes.data.countries)) {
          setCountries(countriesRes.data.countries);
        } else {
          throw new Error("Unexpected structure for countries");
        }

        // Then, fetch saved address
        const addressRes = await axios.get(
          "https://admin.xpertbid.com/api/user/address",
          {
            headers: { Authorization: `Bearer ${session?.user?.token}` },
          }
        );
        // Assuming addressRes.data is the address object:
        setFormData(addressRes.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setErrorPopupMessage("Could not fetch initial address details.");
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      }
    };

    // Only fetch if session exists
    if (session && session.user) {
      fetchInitialData();
    }
  }, [session]);

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    console.log("Country ID:", countryId);
    setFormData((prevData) => ({
      ...prevData,
      country: countryId,
      state: "", // Reset state and city when country changes
      city: "",
    }));

    try {
      const response = await axios.get(
        `https://admin.xpertbid.com/api/get-states/${countryId}`
      );
      if (response.data && Array.isArray(response.data.state)) {
        setStates(response.data.state);
      } else {
        setStates([]);
        console.error("Unexpected structure for states");
      }
      setCities([]); // Reset cities
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      state: stateId,
      city: "", // Reset city when state changes
    }));

    try {
      const response = await axios.get(
        `https://admin.xpertbid.com/api/get-cities/${stateId}`
      );
      if (response.data && Array.isArray(response.data.city)) {
        setCities(response.data.city);
      } else {
        setCities([]);
        console.error("Unexpected structure for cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear specific field error when user types
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSaveAddress = async () => {
    setErrors({}); // Clear previous errors
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://admin.xpertbid.com/api/user/address",
        formData,
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      setSuccessPopupMessage(response.data.message || "Address saved successfully!");
      setSuccessPopupSubMessage(""); // You can customize this subMessage if needed
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error saving address:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        const combinedErrors = Object.values(error.response.data.errors).flat().join(" ");
        setErrorPopupMessage(combinedErrors);
        setErrorPopupSubMessage("");
      } else {
        setErrorPopupMessage("Failed to save address. Please try again.");
        setErrorPopupSubMessage("");
      }
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile" id="address">
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

      <div className="profile-heading-and-button">
        <h3>Address </h3>
        <button
          className="button-style-2"
          onClick={handleSaveAddress}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </div>
      <p className="mb-5">
        Add your shipping address to ensure smooth deliveries for your auction
        wins. You can update or edit this address anytime for future purchases.
      </p>
      <div className="profile-form">
        <div className="row">
          <div className="col-12 form-child">
            <label htmlFor="addressLine1">Street Address 1</label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              required
            />
            {errors.addressLine1 && (
              <p className="text-danger">{errors.addressLine1[0]}</p>
            )}
          </div>
          <div className="col-12 form-child">
            <label htmlFor="addressLine2">Street Address 2</label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6 form-child position-relative">
            <label htmlFor="country">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
               className="form-control"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
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
            {errors.country && <p className="text-danger">{errors.country[0]}</p>}
          </div>
          <div className="col-md-6 form-child position-relative">
            <label htmlFor="state">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              disabled={!states.length}
               className="form-control"
              required
            >
              <option value="">Select Your State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
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
            {errors.state && <p className="text-danger">{errors.state[0]}</p>}
          </div>
          <div className="col-md-6 form-child position-relative">
            <label htmlFor="city">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!cities.length}
               className="form-control"
              required
            >
              <option value="">Select Your City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
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

            {errors.city && <p className="text-danger">{errors.city[0]}</p>}
          </div>
          <div className="col-md-6 form-child">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="Enter your postal code here"
              required
            />
            {errors.postalCode && <p className="text-danger">{errors.postalCode[0]}</p>}
          </div>
          <div className="col-md-6 form-child">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number "
              required
            />
            {errors.contactNumber && <p className="text-danger">{errors.contactNumber[0]}</p>}
          </div>
          <div className="col-md-6 form-child">
            <label htmlFor="otherNumber">Other Number</label>
            <input
              type="text"
              id="otherNumber"
              name="otherNumber"
              value={formData.otherNumber}
              onChange={handleInputChange}
              placeholder="Enter any other number"
              required
            />
            {errors.otherNumber && <p className="text-danger">{errors.otherNumber[0]}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressComponent;
