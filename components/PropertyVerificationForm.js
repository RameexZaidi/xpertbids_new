// components/PropertyVerificationForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter }  from "next/router";
import SuccessPopup   from "@/components/SuccessPopup";
// components/PropertyVerificationForm.js
import ErrorPopup     from "@/components/ErrorPopup";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export default function PropertyVerificationForm({
  initialData = {},
  isEdit = false,
}) {
  const { data: session } = useSession();
  const router            = useRouter();
  
  // — form fields —
  const [propertyType, setPropertyType]       = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [titleDeedNumber, setTitleDeedNumber] = useState("");


  // — file uploads & previews —
  const [propertyDocs, setPropertyDocs] = useState([]);
  const [previews, setPreviews]         = useState([]);

  // — UI state —
  const [errors, setErrors]           = useState({});
  const [fileCountError, setFileCountError] = useState("");
  const [loading, setLoading]         = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError]     = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // prefill on edit:
  useEffect(() => {
    if (isEdit && initialData) {
      setPropertyType(initialData.property_type || "");
      setPropertyAddress(initialData.property_address || "");
      setTitleDeedNumber(initialData.title_deed_number || "");
      // preview existing docs
      const baseUrl = BASE.replace(/\/api$/, "");
      const docs = Array.isArray(initialData.property_documents)
        ? initialData.property_documents.map(p => `${baseUrl}/${p}`)
        : [];
      setPreviews(docs);
    }
  }, [isEdit, initialData]);


  // file input change
  const onDocsChange = e => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setFileCountError("You can upload up to 3 documents.");
      e.target.value = null;
      return;
    }
    setFileCountError("");
    setPropertyDocs(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };
// ...
const handleSubmit = async e => {
  e.preventDefault();
  setErrors({});
  setShowSuccess(false);
  setShowError(false);

const fd = new FormData()
fd.append("property_type", propertyType)
fd.append("property_address", propertyAddress)
fd.append("title_deed_number", titleDeedNumber)
propertyDocs.forEach(f => fd.append("property_documents[]", f))


  setLoading(true);
  try {
   if (isEdit) {
  // tell Laravel “this is actually a PUT”
  fd.append("_method", "PUT");
  await axios.post(
    `https://admin.xpertbid.com/api/property-verifications/${initialData.id}`,
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );

      setSuccessMessage("Property verification submitted successfully.");
    }
    setShowSuccess(true);
  } catch (err) {
    console.error("server said:", err.response?.data);
    const resp = err.response?.data || {};
    if (resp.errors) {
      setErrors(resp.errors);
      setErrorMessage(Object.values(resp.errors).flat().join(" "));
    } else {
      setErrorMessage(resp.message || "Submission failed.");
    }
    setShowError(true);
  } finally {
    setLoading(false);
  }
};
// ...

  return (
    <div className="container mt-5">
      {showSuccess && (
        <SuccessPopup
          isOpen={showSuccess}
          onClose={() => {
            if (isEdit) {
              router.push("/");       // change as needed
            } else {
              window.location.reload();
            }
          }}
          message={successMessage}
          subMessage=""
        />
      )}
      {showError && (
        <ErrorPopup
          isOpen={showError}
          onClose={() => setShowError(false)}
          message={errorMessage}
          subMessage=""
        />
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "20px" }}>
        <h4 className="mb-4 pop-head">
          {isEdit ? "Edit Property Verification" : "Property Verification"}
        </h4>

        {/* Property Type */}
        <div className="mb-3">
          <label className="form-label fw-bold">Property Type</label>
          <input
            type="text"
            className="form-control verify_input"
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
            required
          />
          {errors.property_type && (
            <div className="text-danger">{errors.property_type}</div>
          )}
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label fw-bold">Property Address</label>
          <input
            type="text"
            className="form-control verify_input"
            value={propertyAddress}
            onChange={e => setPropertyAddress(e.target.value)}
            required
          />
          {errors.property_address && (
            <div className="text-danger">{errors.property_address}</div>
          )}
        </div>

        {/* Title Deed */}
        <div className="mb-3">
          <label className="form-label fw-bold">Title Deed Number</label>
          <input
            type="text"
            className="form-control verify_input"
            value={titleDeedNumber}
            onChange={e => setTitleDeedNumber(e.target.value)}
            required
          />
          {errors.title_deed_number && (
            <div className="text-danger">{errors.title_deed_number}</div>
          )}
        </div>

      
      

        {/* Documents */}
        <div className="identity-upload-section mb-4">
          <label className="form-label fw-bold">Upload Ownership & NOC Documents</label>
          <ul className="liss mb-3">
            <li>Click to select files (PNG/JPG/PDF).</li>
            <li>Maximum 3 documents.</li>
            <li>Ensure clarity and full edges are visible.</li>
          </ul>
          <div
            className="upload-box p-3"
            onClick={() => document.getElementById("docsInput").click()}
          >
            {previews.length > 0 ? (
              <div className="d-flex flex-wrap">
                {previews.map((src,i) => (
                  <img key={i} src={src} className="upload-preview m-1" alt={`Doc ${i+1}`} />
                ))}
              </div>
            ) : (
              <button type="button" className="upload upload-btn button-style-3">
                Upload Documents
              </button>
            )}
            <input
              id="docsInput"
              type="file"
              accept="image/png, image/jpeg, application/pdf"
              multiple
              style={{ display: "none" }}
              onChange={onDocsChange}
              required={!isEdit}
            />
          </div>
          {fileCountError && <div className="text-danger">{fileCountError}</div>}
          {errors.property_documents && (
            <div className="text-danger">{errors.property_documents}</div>
          )}
        </div>

        <button type="submit" className="button-style-2" disabled={loading}>
          {loading
            ? isEdit ? "Updating..." : "Submitting..."
            : isEdit ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
