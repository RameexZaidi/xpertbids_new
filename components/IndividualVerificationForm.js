import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import SuccessPopup from "@/components/SuccessPopup";
import ErrorPopup from "@/components/ErrorPopup";
import DateOfBirthSelector from "@/components/DateOfBirthSelector";
axios.defaults.withCredentials = true;

const IndividualVerificationForm = ({ initialData = {}, isEdit = false }) => {
  const { data: session } = useSession();

  // prefill state from initialData when editing
  const [fullLegalName, setFullLegalName] = useState(initialData.full_legal_name || "");
  const [dob, setDob]                     = useState(initialData.dob || "");
  const [nationality, setNationality]     = useState(initialData.nationality || "");
  const [residentialAddress, setResidentialAddress] = useState(initialData.residential_address || "");
  const [contactNumber, setContactNumber] = useState(initialData.contact_number || "");
  const [emailAddress, setEmailAddress]   = useState(initialData.email_address || "");
  const [country, setCountry]             = useState(initialData.country || "");
  const [selectedDocument, setSelectedDocument] = useState((initialData.selectedDocument || "NIC"));
  const [countries, setCountries]         = useState([]);
const router = useRouter();
  // image files + previews
  const [frontFile, setFrontFile]     = useState(null);
  const [backFile, setBackFile]       = useState(null);
  const [frontPreview, setFrontPreview] = useState(
    initialData.id_front_path
      ? `https://admin.xpertbid.com${initialData.id_front_path}`
      : ""
  );
  const [backPreview, setBackPreview]   = useState(
    initialData.id_back_path
      ? `https://admin.xpertbid.com${initialData.id_back_path}`
      : ""
  );

  // UI state
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");

  // prefill email from session if blank
  useEffect(() => {
    if (session?.user?.email && !initialData.email_address) {
      setEmailAddress(session.user.email);
    }
  }, [session, initialData.email_address]);

  // load countries
  useEffect(() => {
    axios
      .get(`https://admin.xpertbid.com/api/get-countries`)
      .then(res => setCountries(res.data.country || []))
      .catch(console.error);
  }, []);

  // file handlers
  const onFrontChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setFrontFile(file);
    setFrontPreview(URL.createObjectURL(file));
  };
  const onBackChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setBackFile(file);
    setBackPreview(URL.createObjectURL(file));
  };

  // submit handler: always POST, override to PUT when editing
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setShowErrorPopup(false);
    setShowSuccessPopup(false);

    const fd = new FormData();
    fd.append("full_legal_name", fullLegalName);
    fd.append("dob", dob);
    fd.append("nationality", nationality);
    fd.append("residential_address", residentialAddress);
    if (frontFile) fd.append("id_front", frontFile);
    if (backFile)  fd.append("id_back", backFile);
    fd.append("contact_number", contactNumber);
    fd.append("email_address", emailAddress);
    fd.append("country", country);
    fd.append("document_type", selectedDocument);
    console.log(selectedDocument); // NIC ya Passport
    if (isEdit) {
      fd.append("_method", "PUT");
    }

    try {
      await axios.post(
        isEdit
          ? `https://admin.xpertbid.com/api/individual-verifications/${initialData.id}`
          : `https://admin.xpertbid.com/api/individual-verifications`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        }
      );
      setSuccessPopupMessage(isEdit ? "Form updated successfully." : "Form submitted successfully.");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("=== API ERROR ===");
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      const resp = error.response?.data || {};
      setErrorPopupMessage( resp.errors
          ? Object.entries(resp.errors).map(([k,v]) => `${k}: ${v.join(", ")}`).join("\n")
          : "");
      setErrorPopupSubMessage(""
       
      );
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 ">
      {/* Success/Error popups */}
      {showSuccessPopup && (
        <SuccessPopup
          isOpen={showSuccessPopup}
         onClose={() => {
     if (isEdit) {
       router.push("/");
     } else {
       window.location.reload();
     }
   }}
          message={successPopupMessage}
          subMessage=""
        />
      )}
      {showErrorPopup && (
        <ErrorPopup
          isOpen={showErrorPopup}
          onClose={() => setShowErrorPopup(false)}
          message={errorPopupMessage}
          subMessage={errorPopupSubMessage}
        />
      )}

      {/* Individual Verification Form */}
    <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "20px" }}>
        <h4 className="mb-5 heading">
          {isEdit ? "Edit Verification" : "Individual Verification"}
        </h4>

        {/* Full Legal Name */}
        <div className="mb-3">
          <label className="form-label fw-bold">Full Legal Name</label>
          <input
            type="text"
            className="form-control  verify_input"
            value={fullLegalName}
            onChange={e => setFullLegalName(e.target.value)}
            placeholder="Please enter your legal name"
            required
          />
          {errors.full_legal_name && <div className="text-danger">{errors.full_legal_name}</div>}
        </div>

        {/* Date of Birth */}
        <div className="mb-3">
          <label className="form-label fw-bold">Date of Birth</label>
          <DateOfBirthSelector dob={dob} setDob={setDob} errors={errors} />
        </div>

        {/* Nationality & Residential Address */}
        <div className="row">
          <div className="mb-3 col-md-6 position-relative">
  <label className="form-label fw-bold">Nationality</label>
  <select
    className="form-control verify_input"
    value={nationality}
    onChange={(e) => setNationality(e.target.value)}
    required
  >
    <option value="">Select Nationality</option>
    {countries.map((c) => (
      <option key={c.id} value={c.name}>
        {c.name}
      </option>
    ))}
  </select>

  {/* SVG Dropdown Arrow */}
  <div className="input-icon-wrapper nationality_svg">
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

  {errors.nationality && <div className="text-danger">{errors.nationality}</div>}
</div>

          <div className="mb-3 col-md-6">
            <label className="form-label fw-bold">Residential Address</label>
            <input
              type="text"
              className="form-control  verify_input"
              value={residentialAddress}
              onChange={e => setResidentialAddress(e.target.value)}
              placeholder="Please enter your residential address"
              required
            />
            {errors.residential_address && <div className="text-danger">{errors.residential_address}</div>}
          </div>
        </div>
        <div className="mb-4 position-relative">
  <label className="form-label fw-bold">Select Document Type</label>
  <select
    className="form-control verify_input"
    value={selectedDocument}
    onChange={e => setSelectedDocument(e.target.value)}
    required
  >
   
    <option value="NIC">NIC</option>
    <option value="Passport">Passport</option>
  </select>
   {/* SVG Dropdown Arrow */}
  <div className="input-icon-wrapper verify_svg">
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
</div>
        {/* ID Document Upload Section */}
     <div className="identity-upload-section">
  {selectedDocument && (
    <h4 className="form-label fw-bold mb-3">
      Verify your identity with {selectedDocument === "Passport" ? "a Passport" : "an NIC"} document
    </h4>
  )}
  {selectedDocument && (
    <ul className="liss mb-3">
      <li>A valid {selectedDocument} document in the issuing country.</li>
      <li>A clear picture where all four corners are visible.</li>
      <li>Include the back if it has identifying information.</li>
      <li>Certified by a witness if required.</li>
    </ul> 
  )}
  <div className="row">
    {/* Front ID upload */}
    <div className="col-md-6">
      <div
        className="upload-box"
        onClick={() => document.getElementById("frontInput").click()}
      >
        {frontPreview ? (
          <div className="position-relative">
            {frontFile?.type === "application/pdf" ? (
              <div className="pdf-preview text-center p-3">
                <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                <p className="small mt-2">{frontFile.name}</p>
              </div>
            ) : (
              <img
                src={frontPreview}
                className="upload-preview"
                alt="Front of ID"
              />
            )}
            <button
              type="button"
              className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
              style={{ width: "20px", height: "20px", fontSize: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                // Clear front preview and file
                setFrontPreview(null);
                setFrontFile(null);
                // If you're using form state, update it here
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="upload upload-btn button-style-3"
            onClick={e => {
              e.stopPropagation();
              document.getElementById("frontInput").click();
            }}
          >
            Upload Front
          </button>
        )}
        <input
          id="frontInput"
          type="file"
          accept="image/png, image/jpeg, application/pdf"
          style={{ display: "none" }}
          onChange={onFrontChange}
        />
      </div>
      {errors.id_front && <div className="text-danger mt-2">{errors.id_front}</div>}
    </div>

    {/* Back ID upload */}
    <div className="col-md-6">
      <div
        className="upload-box"
        onClick={() => document.getElementById("backInput").click()}
      >
        {backPreview ? (
          <div className="position-relative">
            {backFile?.type === "application/pdf" ? (
              <div className="pdf-preview text-center p-3">
                <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                <p className="small mt-2">{backFile.name}</p>
              </div>
            ) : (
              <img
                src={backPreview}
                className="upload-preview"
                alt="Back of ID"
              />
            )}
            <button
              type="button"
              className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
              style={{ width: "20px", height: "20px", fontSize: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                // Clear back preview and file
                setBackPreview(null);
                setBackFile(null);
                // If you're using form state, update it here
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="upload upload-btn button-style-3"
            onClick={e => {
              e.stopPropagation();
              document.getElementById("backInput").click();
            }}
          >
            Upload Back
          </button>
        )}
        <input
          id="backInput"
          type="file"
          accept="image/png, image/jpeg, application/pdf"
          style={{ display: "none" }}
          onChange={onBackChange}
        />
      </div>
      {errors.id_back && <div className="text-danger mt-2">{errors.id_back}</div>}
    </div>
  </div>
</div>

        {/* Contact Number & Email Address */}
        <div className="row">
          <div className="my-4 col-md-6">
            <label className="form-label fw-bold">Contact Number</label>
            <input
              type="number"
              className="form-control  verify_input"
              value={contactNumber}
              placeholder="Please enter your contact number"
              onChange={e => setContactNumber(e.target.value)}
              required
            />
            {errors.contact_number && <div className="text-danger">{errors.contact_number}</div>}
          </div>
          <div className="my-4 col-md-6">
            <label className="form-label fw-bold">Email Address</label>
            <input
              type="email"
              className="form-control  verify_input"
              value={emailAddress}
              onChange={e => setEmailAddress(e.target.value)}
              required
            />
            {errors.email_address && <div className="text-danger">{errors.email_address}</div>}
          </div>
        </div>

        {/* Country Dropdown */}
        <div className="mb-4 form-child position-relative">
          <label className="form-label fw-bold">Country</label>
          <select
            className="form-control  verify_input"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {/* SVG Dropdown Arrow */}
          <div className="input-icon-wrapper verify_svg"  >
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
          {errors.country && <div className="text-danger">{errors.country}</div>}
        </div>

        {/* Submit Button */}
  {/* Submit Button */}
        <button type="submit" className="button-style-2" disabled={loading}>
          {loading
            ? isEdit ? "Updating..." : "Submitting..."
            : isEdit ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default IndividualVerificationForm;
