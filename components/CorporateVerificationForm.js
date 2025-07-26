import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import SuccessPopup from "@/components/SuccessPopup";
import ErrorPopup from "@/components/ErrorPopup";
import DateOfBirthSelector from "@/components/DateOfBirthSelector";

axios.defaults.withCredentials = true;
const BASE = "https://admin.xpertbid.com/api";
const CorporateVerificationForm = ({ initialData = {}, isEdit = false }) => {
  const { data: session } = useSession();

  // --- Prefill form state from initialData if editing ---
  const [legalEntityName, setLegalEntityName]       = useState(initialData.legal_entity_name || "");
  const [registeredAddress, setRegisteredAddress]   = useState(initialData.registered_address || "");
  const [incorporationDate, setIncorporationDate]   = useState(initialData.date_of_incorporation || "");
  const [entityType, setEntityType]                 = useState(initialData.entity_type || "");
  const [country, setCountry]                       = useState(initialData.country || "");
  const [countries, setCountries]                   = useState([]);

  // Files + previews
  const [businessDocuments, setBusinessDocuments]   = useState([]);
  const [businessPreview, setBusinessPreview]       = useState(
    Array.isArray(initialData.business_documents)
      ? initialData.business_documents.map(p => `${BASE.replace(/\/api$/, "")}/${p}`)
      : []
  );
  const [fileCountError, setFileCountError]         = useState("");

  // UI state
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showError, setShowError]   = useState(false);
  const [errorMsg, setErrorMsg]     = useState("");

  // Load countries
  useEffect(() => {
    axios.get(`https://admin.xpertbid.com/api/get-countries`)
      .then(res => setCountries(res.data.country || []))
      .catch(console.error);
  }, []);

  // Handle file selection
  const onBusinessChange = e => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setFileCountError("You can’t upload more than 3 documents.");
      e.target.value = "";
      return;
    }
    setFileCountError("");
    setBusinessDocuments(files);
    setBusinessPreview(files.map(f => URL.createObjectURL(f)));
  };

  // Submit handler: POST + _method override for PUT when editing
  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setShowSuccess(false);
    setShowError(false);
    setLoading(true);

    const fd = new FormData();
    fd.append("legal_entity_name", legalEntityName);
    fd.append("registered_address", registeredAddress);
    fd.append("date_of_incorporation", incorporationDate);
    fd.append("entity_type", entityType);
    businessDocuments.forEach(file => fd.append("business_documents[]", file));
    fd.append("country", country);
    if (isEdit) fd.append("_method", "PUT");

    try {
      await axios.post(
        isEdit
          ? `https://admin.xpertbid.com/api/corporate-verifications/${initialData.id}`
          : `https://admin.xpertbid.com/api/corporate-verifications`,
        fd,
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      setSuccessMsg(isEdit
        ? "Corporate verification updated successfully."
        : "Corporate verification submitted successfully."
      );
      setShowSuccess(true);
    } catch (err) {
      const resp = err.response?.data || {};
      if (resp.errors) {
        setErrors(resp.errors);
        setErrorMsg(Object.values(resp.errors).flat().join(" "));
      } else {
        setErrorMsg(resp.message || "Submission failed.");
      }
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {showSuccess && (
        <SuccessPopup
          isOpen={showSuccess}
          onClose={() => isEdit ? window.location.href = "/" : window.location.reload()}
          message={successMsg}
          subMessage=""
        />
      )}
      {showError && (
        <ErrorPopup
          isOpen={showError}
          onClose={() => setShowError(false)}
          message={errorMsg}
          subMessage=""
        />
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "20px" }}>
        <h4 className="mb-5 heading">
          {isEdit ? "Edit Corporate Verification" : "Corporate Verification"}
        </h4>

        {/* Legal Entity Name */}
        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label fw-bold">Legal Entity Name</label>
            <input
              type="text"
              className="form-control verify_input"
              value={legalEntityName}
              onChange={e => setLegalEntityName(e.target.value)}
              placeholder="Please enter your legal entity name"
              required
            />
            {errors.legal_entity_name && (
              <div className="text-danger">{errors.legal_entity_name}</div>
            )}
          </div>

          {/* Registered Address */}
          <div className="mb-3 col-md-6">
            <label className="form-label fw-bold">Registered Address</label>
            <input
              type="text"
              className="form-control verify_input"
              value={registeredAddress}
              onChange={e => setRegisteredAddress(e.target.value)}
              placeholder="Please enter your registered address"
              required
            />
            {errors.registered_address && (
              <div className="text-danger">{errors.registered_address}</div>
            )}
          </div>
        </div>

        {/* Date of Incorporation */}
        <div className="mb-3">
          <label className="form-label fw-bold">Date of Incorporation</label>
          <DateOfBirthSelector
            dob={incorporationDate}
            setDob={setIncorporationDate}
            errors={errors}
          />
        </div>

        {/* Entity Type */}
        <div className="mb-3">
          <label className="form-label fw-bold">Type of Entity</label>
          <input
            type="text"
            className="form-control verify_input"
            value={entityType}
            onChange={e => setEntityType(e.target.value)}
            placeholder="Please enter your type of entity"
            required
          />
          {errors.entity_type && (
            <div className="text-danger">{errors.entity_type}</div>
          )}
        </div>

        {/* Business Documents Upload */}
      <div className="identity-upload-section mb-4">
  <h4 className="form-label fw-bold mb-3">Upload your documents</h4>
  <ul className="liss mb-3">
    <li>Click the box below to select files.</li>
    <li>Only PNG/JPEG images accepted.</li>
<li>You can&apos;t upload more than 3 documents.</li>  </ul>
  <div
    className="upload-box"
    onClick={() => document.getElementById("businessInput").click()}
  >
    {businessPreview.length > 0 ? (
      <div className="d-flex flex-wrap">
        {businessPreview.map((src, i) => {
          const file = businessDocuments[i];
          const isPdf = (file && file.type === "application/pdf") || 
                        (!file && src.toLowerCase().endsWith(".pdf"));
          
          return (
            <div key={`doc-${i}`} className="position-relative m-1">
              {isPdf ? (
                <div className="pdf-preview p-2 border text-center" style={{ width: "120px" }}>
                  <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                  <p className="small mt-1 text-truncate" style={{ maxWidth: "110px" }}>
                    {file ? file.name : src.split("/").pop()}
                  </p>
                </div>
              ) : (
                <img
                  src={src}
                  className="upload-preview"
                  alt={`Doc ${i + 1}`}
                  style={{ width: "120px", height: "90px", objectFit: "contain" }}
                />
              )}
              <button
                type="button"
                className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
                style={{ width: "20px", height: "20px", fontSize: "10px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Remove from both preview and documents array
                  const newPreviews = [...businessPreview];
                  const newDocuments = [...businessDocuments];
                  newPreviews.splice(i, 1);
                  newDocuments.splice(i, 1);
                  setBusinessPreview(newPreviews);
                  setBusinessDocuments(newDocuments);
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    ) : (
      <button type="button" className="upload upload-btn button-style-3">
        Upload Business Documents
      </button>
    )}

    <input
      id="businessInput"
      type="file"
      accept="image/png, image/jpeg, application/pdf"
      multiple
      style={{ display: "none" }}
      onChange={onBusinessChange}
      required={!isEdit}
    />
  </div>
  {fileCountError && <div className="text-danger mt-2">{fileCountError}</div>}
  {errors.business_documents && (
    <div className="text-danger">{errors.business_documents}</div>
  )}
</div>

        {/* Country */}
        <div className="mb-4 form-child position-relative">
          <label className="form-label fw-bold">Country</label>
          <select
            className="form-control verify_input"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          {errors.country && <div className="text-danger">{errors.country}</div>}
        </div>

        {/* Submit */}
        <button type="submit" className="button-style-2" disabled={loading}>
          {loading ? (isEdit ? "Updating..." : "Submitting...") : (isEdit ? "Update" : "Submit")}
        </button>
      </form>
    </div>
  );
};

export default CorporateVerificationForm;
