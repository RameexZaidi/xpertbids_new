import { useSession, getSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SuccessPopup from "../components/SuccessPopup";
import ErrorPopup from "../components/ErrorPopup";
import WarningPopup from "../components/warning";

const Sell = ({ serverSession }) => {
  const { data: clientSession } = useSession();
  const session = clientSession || serverSession;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    user_id: "",
    category_id: "",
    sub_category_id: "",
    child_category_id: "",
    description: "",
    minimum_bid: "",
    reserve_price: "",
    start_date: "",
    end_date: "",
    product_year: "",

    product_location: "",
    create_category: "",
  });
  const [albumFiles, setAlbumFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
const [fileCountError, setFileCountError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningPopupMessage, setWarningPopupMessage] = useState("");
 // Vehicle verification state
 const [vehicleMakeModel, setVehicleMakeModel] = useState("");
 const [yearOfManufacture, setYearOfManufacture] = useState("");
 const [chassisVin, setChassisVin] = useState("");
 const [vehicleDocuments, setVehicleDocuments] = useState([]);     // File[]
 const [vehiclePreview, setVehiclePreview]     = useState([]);     // URL[]
 const [vehicleCountry, setVehicleCountry]     = useState("");
 // Property verification state
 const [propertyType, setPropertyType]       = useState("");
 const [propertyAddress, setPropertyAddress] = useState("");
 const [titleDeedNumber, setTitleDeedNumber] = useState("");
 const [propertyDocs, setPropertyDocs]       = useState([]);   // File[]
 const [propertyPreviews, setPropertyPreviews] = useState([]); // URL[]
// handle property docs selection & preview (max 3)
 const onDocsChange = e => {
  const files = Array.from(e.target.files || []);
   if (files.length > 3) {
     setFileCountError("You can’t upload more than 3 documents.");
     return;
   }
   setFileCountError("");
   setPropertyDocs(files);
   setPropertyPreviews(files.map(f => URL.createObjectURL(f)));
 };
 // handle vehicle docs selection & preview
const onVehicleChange = e => {
  const files = Array.from(e.target.files || []);
  if (files.length > 3) {
    setFileCountError("You can’t upload more than 3 documents.");
    return;
  }
  setFileCountError("");
  setVehicleDocuments(files);
  setVehiclePreview(files.map(f => URL.createObjectURL(f)));
};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countriesRes = await axios.get(
          "https://admin.xpertbid.com/api/get-countries"
        );
        setCountries(countriesRes.data.country);
      } catch (error) {
        console.error("Error fetching identity data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://admin.xpertbid.com/api/get-category"
        );
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: session.user.id,
      }));
    }
  }, [session]);

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const error = validateFile(file);
        if (error) {
          alert(error);
          return;
        }
        setFormData((prev) => ({ ...prev, [name]: file }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category_id") {
      try {
        const response = await axios.get(
          `https://admin.xpertbid.com/api/get-subcategories/${value}`
        );
        setSubCategories(response.data.subcategories);
        setFormData((prev) => ({
          ...prev,
          sub_category_id: "",
          child_category_id: "",
        }));
        setChildCategories([]);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }

    if (name === "sub_category_id") {
      try {
        const response = await axios.get(
          `https://admin.xpertbid.com/api/get-childern/${value}`
        );
        setChildCategories(response.data.subcategories);
        setFormData((prev) => ({ ...prev, child_category_id: "" }));
      } catch (error) {
        console.error("Error fetching child categories:", error);
      }
    }
  };

  const validateFile = (file) => {
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!validTypes.includes(file.type)) {
      return "Only PNG, JPG, and WEBP files are allowed.";
    }
    if (file.size > maxSize) {
      return "File size must be less than 2MB.";
    }
    return null;
  };

  const handleAlbumChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const validFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      if (error) {
        alert(error);
        continue;
      }
      validFiles.push(file);
    }
    setAlbumFiles(validFiles);
  };

 const handleSubmit = async (e) => {
  console.log("category_id type/value:", typeof formData.category_id, formData.category_id);
  e.preventDefault();
  if (albumFiles.length === 0) {
    setErrorPopupMessage("Please select an image before publishing the auction.");
    setErrorPopupSubMessage("");
    setShowErrorPopup(true);
    return;
  }
  setIsSubmitting(true);

  try {
    // —————————————————————————————
    // 1) Pehle Auction create karo
    // —————————————————————————————
    const auctionFd = new FormData();
    Object.keys(formData).forEach(key => {
      auctionFd.append(key, formData[key]);
    });
    albumFiles.forEach(file => auctionFd.append("album[]", file));
    auctionFd.append("image", albumFiles[0]);

    const auctionRes = await axios.post(
      "https://admin.xpertbid.com/api/auctions_store",
      auctionFd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    );
    console.log(" Auction created:", auctionRes.data);

    const auctionId = auctionRes.data.auction?.id;
    if (!auctionId) {
      throw new Error("auctionId not found ");
    }
   // 2) If property category, send property-verifications
  if (formData.category_id === "222") {
  console.log("🚀 Firing property-verifications API…");
     const propFd = new FormData();
     propFd.append("property_type", propertyType);
     propFd.append("property_address", propertyAddress);
     propFd.append("title_deed_number", titleDeedNumber);
     propFd.append("country", formData.product_location); // reuse location
     propertyDocs.forEach(file => propFd.append("property_documents[]", file));
     propFd.append("auction_id", auctionId);

     await axios.post(
       "https://admin.xpertbid.com/api/property-verifications",
       propFd,
       { headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.user.token}`,
        },}
     );
   }
    // —————————————————————————————
    // 2) Agar category 311 hai to Vehicle Verification POST karo
    // —————————————————————————————
    if (formData.category_id === "311") {
      const vehicleFd = new FormData();
      vehicleFd.append("vehicle_make_model", vehicleMakeModel);
      vehicleFd.append("year_of_manufacture", yearOfManufacture);
      vehicleFd.append("chassis_vin", chassisVin);
      vehicleDocuments.forEach(f => vehicleFd.append("vehicle_documents[]", f));
      vehicleFd.append("country", vehicleCountry);
      vehicleFd.append("auction_id", auctionId);

      const vehicleRes = await axios.post(
        "https://admin.xpertbid.com/api/vehicle-verifications",
        vehicleFd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      console.log(" Vehicle verification created:", vehicleRes.data);
    }

    // —————————————————————————————
    // 3) Success Popup & Reset
    // —————————————————————————————
    setSuccessPopupMessage("Your auction has been successfully created.");
    setSuccessPopupSubMessage("after verification, it will be live.");
    setShowSuccessPopup(true);

    setFormData({
      title: "",
      user_id: session.user.id,
      category_id: "",
      sub_category_id: "",
      child_category_id: "",
      description: "",
      minimum_bid: "",
      reserve_price: "",
      start_date: "",
      end_date: "",
      product_year: "",
      product_location: "",
      create_category: "",
    });
    setAlbumFiles([]);
    setVehicleDocuments([]);
    setVehiclePreview([]);
    setErrors({});
  } catch (error) {
    console.error("Submit Error:", error);
    const data = error.response?.data;
    if (data?.is_verified === false) {
      setWarningPopupMessage(data.message);
      setVerifyUrl(data.verify_url || "/account?tab=identity_verification");
      setShowWarningPopup(true);
    } else if (error.response?.status === 422) {
      const errs = error.response.data.errors;
      setErrors(errs);
      const combined = Object.values(errs).flat().join(" ");
      setErrorPopupMessage(combined);
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
    } else {
      setErrorPopupMessage(error.message || "Submission failed.");
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
    }
  } finally {
    setIsSubmitting(false);
  }
};


  // No filter, all categories shown:
  const filteredCategories = categories;

  return (
    <>
      <Header />
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
      {/* Warning Popup */}
      {showWarningPopup && (
        <WarningPopup
          isOpen={showWarningPopup}
          onClose={() => {
            setShowWarningPopup(false);
            setWarningPopupMessage("");
            
          }}
          message={warningPopupMessage}
          subMessage={
            <button onClick={() => window.location.href = verifyUrl} className="btn btn-black">
              Identity Verification
            </button>
          }
        />
      )}

      <div className="container-fluid p-0 p-xl-5  py-5">
        <form onSubmit={handleSubmit} className="px-4 p-sm-5">
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="sell-head">
                <h1 className="up-listing pt-3 mb-3 mb-lg-5 ">
                  Upload your listing
                </h1>
              </div>
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title">Item Name</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter your title here"
                  className="form-control verify_input color-white"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                {errors.title && (
                  <p className="error text-danger">{errors.title[0]}</p>
                )}
              </div>
              {/* Main Category Dropdown */}
              <div className="form-group">
                <label htmlFor="category">Select Category</label>
                <select
                  id="category"
                  name="category_id"
                  className="form-control verify_input color-white"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your category</option>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors?.category_id && (
                  <p className="error text-danger">
                    {errors.category_id[0]}
                  </p>
                )}
              </div>
              {/* Show Sub & Child Categories ONLY if category_id is NOT 213, 214, 215, 216 */}
              {![
                213, 214, 215, 216,
              ].includes(Number(formData.category_id)) && (
                <>
                  {/* Sub Category */}
                  <div className="form-group">
                    <label htmlFor="sub_category">Select Sub Category</label>
                    <select
                      id="sub_category"
                      name="sub_category_id"
                      className="form-control verify_input color-white"
                      value={formData.sub_category_id}
                      onChange={handleInputChange}
                      required
                      disabled={
                        !formData.category_id || subCategories.length === 0
                      }
                    >
                      <option value="">Select your subcategory</option>
                      {subCategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                    {errors?.sub_category_id && (
                      <p className="error text-danger">
                        {errors.sub_category_id[0]}
                      </p>
                    )}
                  </div>
                  {/* Child Category */}
                  <div className="form-group">
                    <label htmlFor="child_category">
                      Select Child Category
                    </label>
                    <select
                      id="child_category"
                      name="child_category_id"
                      className="form-control verify_input color-white"
                      value={formData.child_category_id}
                      onChange={handleInputChange}
                      required
                      disabled={
                        !formData.sub_category_id || childCategories.length === 0
                      }
                    >
                      <option value="">Select your child category</option>
                      {childCategories.map((childCategory) => (
                        <option key={childCategory.id} value={childCategory.id}>
                          {childCategory.name}
                        </option>
                      ))}
                    </select>
                    {errors?.child_category_id && (
                      <p className="error text-danger">
                        {errors.child_category_id[0]}
                      </p>
                    )}
                  </div>
                </>
              )}


              {/* ── PROPERTY VERIFICATION ── */}
{formData.category_id === "222" && (
  <>
   
    <h3 className="up-listing my-5">Property Verification </h3>

    {/* Property Type */}
    <div className="form-group">
      <label>Property Type</label>
      <input
        type="text"
        className="form-control verify_input"
        value={propertyType}
        placeholder="Please enter property type"
        onChange={e => setPropertyType(e.target.value)}
        required
      />
    </div>

    {/* Property Address */}
    <div className="form-group">
      <label>Property Address</label>
      <input
        type="text"
        placeholder="Please enter property address"
        className="form-control verify_input"
        value={propertyAddress}
        onChange={e => setPropertyAddress(e.target.value)}
        required
      />
    </div>

    {/* Title Deed Number */}
    <div className="form-group">
      <label>Title Deed Number</label>
      <input
        type="text"
        placeholder="Please enter title deed number"
        className="form-control verify_input"
        value={titleDeedNumber}
        onChange={e => setTitleDeedNumber(e.target.value)}
        required
      />
    </div>

    {/* Documents upload (Ownership & NOC) */}
    <div className="identity-upload-section mb-4">
      <h4 className="form-label fw-bold mb-3">
        Upload Ownership & NOC Documents
      </h4>
      <ul className="liss mb-3">
        <li>Click the box to select your files (PNG/JPG).</li>
        <li>Maximum 3 documents.</li>
        <li>Ensure each image is clear and all edges are visible.</li>
      </ul>
      <div
        className="upload-box p-3"
        onClick={() => document.getElementById("docsInput").click()}
      >
        {propertyPreviews.length > 0 ? (
          <div className="d-flex flex-wrap">
            {propertyPreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                className="upload-preview m-1"
                alt={`Doc ${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <button type="button" className="upload upload-btn button-style-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M7.50065 14.167V9.16699L5.83398 10.8337" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 9.16699L9.16667 10.8337" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.3327 8.33366V12.5003C18.3327 16.667 16.666 18.3337 12.4993 18.3337H7.49935C3.33268 18.3337 1.66602 16.667 1.66602 12.5003V7.50033C1.66602 3.33366 3.33268 1.66699 7.49935 1.66699H11.666" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.3327 8.33366H14.9993C12.4993 8.33366 11.666 7.50033 11.666 5.00033V1.66699L18.3327 8.33366Z" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
            Upload Ownership & NOC Documents
          </button>
        )}
        <input
          id="docsInput"
          type="file"
          accept="image/png, image/jpeg"
          multiple
          style={{ display: "none" }}
          onChange={onDocsChange}
          required
        />
      </div>
      {fileCountError && <div className="text-danger">{fileCountError}</div>}
      {errors.property_documents && (
        <div className="text-danger">{errors.property_documents}</div>
      )}
    </div>
  </>
)}
              {/* ── VEHICLE VERIFICATION ── */}
              {formData.category_id === "311" && (
  <>
    <h3 className="up-listing my-5">Vehicle Verification </h3>

    {/* Make & Model */}
    <div className="form-group">
      <label>Vehicle Make & Model</label>
      <input
        type="text"
        placeholder="Please enter vehicle make & model"
        className="form-control verify_input "
        value={vehicleMakeModel}
        onChange={e => setVehicleMakeModel(e.target.value)}
        required
      />
    </div>

    {/* Year */}
    <div className="form-group">
      <label>Year of Manufacture</label>
      <input
        type="number"
        placeholder="Please enter year of manufacture"
        className="form-control verify_input "
        value={yearOfManufacture}
        onChange={e => setYearOfManufacture(e.target.value)}
        required
      />
    </div>

    {/* Chassis/VIN */}
    <div className="form-group">
      <label>Chassis / VIN</label>
      <input
        type="text"
        placeholder="Please enter chassis / VIN"
        className="form-control verify_input "
        value={chassisVin}
        onChange={e => setChassisVin(e.target.value)}
        required
      />
    </div>

    {/* Documents upload */}
   {/* Document Upload */}
        <div className="identity-upload-section mb-4">
          <h4 className="form-label fw-bold mb-3">Upload Vehicle Documents</h4>
          <ul className="liss mb-3">
            <li>Click to select up to 3 files (PNG ● JPEG ● PDF).</li>
            <li>Ensure clarity and full edges visible.</li>
          </ul>
          <div
            className="upload-box"
            onClick={() => document.getElementById("vehicleInput").click()}
          >
            {vehiclePreview.length > 0 ? (
              <div className="d-flex flex-wrap">
                {vehiclePreview.map((src, i) => {
                  const file = vehicleDocuments[i];
                  // PDF preview
                  if (file.type === "application/pdf") {
                    return (
                      <a
                        key={i}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="m-1 text-center pdf-preview"
                        style={{ width:  "90px" }}
                      >
                        <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                        <div className="small">{file.name}</div>
                      </a>
                    );
                  }
                  // Image preview
                  return (
                    <img
                      key={i}
                      src={src}
                      className="upload-preview m-1"
                      alt={`Doc ${i + 1}`}
                      style={{ maxHeight:  "90px" }}
                    />
                  );
                })}
              </div>
            ) : (
              <button type="button" className="upload upload-btn button-style-3">
                {/* SVG upload icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M7.50065 14.167V9.16699L5.83398 10.8337" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.5 9.16699L9.16667 10.8337" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.3327 8.33366V12.5003C18.3327 16.667 16.666 18.3337 12.4993 18.3337H7.49935C3.33268 18.3337 1.66602 16.667 1.66602 12.5003V7.50033C1.66602 3.33366 3.33268 1.66699 7.49935 1.66699H11.666" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.3327 8.33366H14.9993C12.4993 8.33366 11.666 7.50033 11.666 5.00033V1.66699L18.3327 8.33366Z" stroke="#23262F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Upload Vehicle Documents
              </button>
            )}
            <input
              id="vehicleInput"
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              multiple
              style={{ display: "none" }}
              onChange={onVehicleChange}
              required
            />
          </div>
          {fileCountError && <div className="text-danger">{fileCountError}</div>}
          {errors.vehicle_documents && (
            <div className="text-danger">{errors.vehicle_documents}</div>
          )}
        </div>

    {/* Country */}
    <div className="form-group d-none">
      <label>Country</label>
      <select
        className="form-control verify_input "
        value={vehicleCountry}
        onChange={e => setVehicleCountry(e.target.value)}
        
      >
        <option value="">Select Country</option>
        {countries.map(c => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>
    </div>
  </>
)}
              {/* Show Create Category ONLY if category_id === 213, 214, 215, 216 */}
              {[213, 214, 215, 216].includes(
                Number(formData.category_id)
              ) && (
                <div className="form-group">
                  <label htmlFor="create_category">
                    Create Your Own Category
                  </label>
                  <input
                    name="create_category"
                    id="create_category"
                    placeholder="Create Your Own Category"
                    className="form-control verify_input color-white"
                    value={formData.create_category}
                    onChange={handleInputChange}
                    required
                  />
                  {errors?.create_category && (
                    <p className="error text-danger">
                      {errors.create_category[0]}
                    </p>
                  )}
                </div>
              )}
              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Item Description</label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Please write something about your item here"
                  className="form-control verify_input color-white"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
                {errors?.description && (
                  <p className="error text-danger">
                    {errors.description[0]}
                  </p>
                )}
              </div>
              {/* Country */}
              <div className="form-group">
                <label>Select Country</label>
                <select
                  name="product_location"
                  className="form-control verify_input color-white"
                  value={formData.product_location}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries?.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Condition and Year */}
              <div className="row">
                
                <div className="col-12 ">
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      name="product_year"
                      id="product_year"
                      className="form-control verify_input color-white"
                      value={formData.product_year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Pricing */}
              <div className="row">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="minimum_bid">Minimum Price</label>
                    <input
                      type="number"
                      placeholder="00"
                      name="minimum_bid"
                      id="minimum_bid"
                      className="form-control verify_input color-white"
                      value={formData.minimum_bid}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="reserve_price">Starting Bid Price</label>
                    <input
                      type="number"
                      placeholder="00"
                      name="reserve_price"
                      id="reserve_price"
                      className="form-control verify_input color-white"
                      value={formData.reserve_price}
                      onChange={handleInputChange}
                      required
                    />
                    {errors?.reserve_price && (
                      <p className="error text-danger">
                        {errors.reserve_price[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Dates */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      id="start_date"
                      className="form-control verify_input color-white"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                    {errors?.start_date && (
                      <p className="error text-danger">
                        {errors.start_date[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="end_date">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      id="end_date"
                      className="form-control verify_input color-white"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      min={new Date(
                        new Date().setDate(new Date().getDate() + 1)
                      )
                        .toISOString()
                        .split("T")[0]}
                      required
                    />
                    {errors?.end_date && (
                      <p className="error text-danger">
                        {errors.end_date[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column: Image Upload and Buttons */}
            <div className="col-lg-6">
              <div className="pe-5 pt-3 d-none d-lg-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-black mt-3 mx-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : "Publish"}
                </button>
              </div>
            <div className="album shadow-lg p-5 text-center d-flex flex-wrap gap-2">
  <input
    type="file"
    id="album"
    name="album[]"
    ref={fileInputRef}
    style={{ display: "none" }}
    onChange={handleAlbumChange}
    multiple
  />

  {albumFiles.length > 0 ? (
    albumFiles.map((file, idx) => {
      const objectUrl = URL.createObjectURL(file);
      return (
        <div key={idx} className="position-relative" style={{ width: "130px", height: "100px" }}>
          <img
            src={objectUrl}
            alt={`Upload Preview ${idx + 1}`}
            className="rounded"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            onLoad={() => URL.revokeObjectURL(objectUrl)}
          />
          <button
            type="button"
            className="position-absolute top-8 end-0 btn btn-secondary btn-sm p-0"
            style={{ width: "20px", height: "20px", fontSize: "10px" }}
            onClick={() => {
              const newFiles = [...albumFiles];
              newFiles.splice(idx, 1);
              setAlbumFiles(newFiles);
            }}
          >
            ×
          </button>
        </div>
      );
    })
  ) : (
    <img
      src="/assets/images/upload.png"
      alt="Placeholder"
      className="rounded"
      style={{
        width: "130px",
        height: "100px",
        objectFit: "contain",
      }}
    />
  )}

  <p className="pt-3 pb-1 uppara">
    You can upload multiple images, and they should be in PNG, GIF,
    WEBP, JPG, JPEG. The image dimensions must be at least 800 x 600
    pixels to ensure optimal clarity and resolution.
  </p>
  <button
    type="button"
    className="btn btn-secondary mt-2"
    onClick={() => fileInputRef.current.click()}
  >
    Upload
  </button>
</div>
              <div className="pe-5 pt-3 d-flex d-lg-none justify-content-end">
                <button
                  type="submit"
                  className="btn btn-black mt-3 mx-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { props: {} };
  }

  return {
    props: {
      serverSession: session,
    },
  };
}

export default Sell;
