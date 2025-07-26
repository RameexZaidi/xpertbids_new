import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SuccessPopup from "@/components/SuccessPopup";
import ErrorPopup from "@/components/ErrorPopup";
import WarningPopup from "@/components/warning";

const EditAuction = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const fileInputRef = useRef(null);

  // Form state
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
  // Album handling
  const [albumFiles, setAlbumFiles] = useState([]);        // new files selected
  const [oldAlbum, setOldAlbum] = useState([]);            // old image URLs (API se)
  // States
  const [categories, setCategories] = useState([]);
  const filteredCategories = categories;
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage] = useState("");
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningPopupMessage, setWarningPopupMessage] = useState("");
  const [verifyUrl, setVerifyUrl] = useState("");
  // Property/Vehicle
  const [vehicleMakeModel, setVehicleMakeModel] = useState("");
  const [yearOfManufacture, setYearOfManufacture] = useState("");
  const [chassisVin, setChassisVin] = useState("");
  const [vehicleDocuments, setVehicleDocuments] = useState([]); // File[]
  const [vehiclePreview, setVehiclePreview] = useState([]); // URL[]
  const [vehicleCountry, setVehicleCountry] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [titleDeedNumber, setTitleDeedNumber] = useState("");
  const [propertyDocs, setPropertyDocs] = useState([]); // File[]
  const [propertyPreviews, setPropertyPreviews] = useState([]); // URL[]
  const [fileCountError, setFileCountError] = useState("");




  // Fetch auction details for edit
  useEffect(() => {
       console.log("AUCTION API:", `https://admin.xpertbid.com/api/auctions/${id}`);

    if (!id || !session?.user?.token) return;
    axios.get(`https://admin.xpertbid.com/api/auctions/${id}`, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    }).then(res => {
      const data = res.data.auction || res.data;
       console.log('Fetched Auction:', data); // <<== Yeh line zaroor daalo
      setFormData({
        title: data.title || "",
        user_id: data.user_id || "",
        category_id: data.category_id ? String(data.category_id) : "",
        sub_category_id: data.sub_category_id ? String(data.sub_category_id) : "",
        child_category_id: data.child_category_id ? String(data.child_category_id) : "",
        description: data.description || "",
        minimum_bid: data.minimum_bid || "",
        reserve_price: data.reserve_price || "",
        start_date: data.start_date ? data.start_date.substr(0,10) : "",
        end_date: data.end_date ? data.end_date.substr(0,10) : "",
        product_year: data.product_year || "",
        product_location: data.product_location || "",
        create_category: data.create_category || "",
      });
     let albumArr = [];
if (Array.isArray(data.album)) {
  albumArr = data.album;
} else if (typeof data.album === "string") {
  try { albumArr = JSON.parse(data.album); } catch { albumArr = []; }
}

const fullAlbum = albumArr.map(img =>
  img.startsWith("http")
    ? img
    : `https://admin.xpertbid.com/${img.startsWith("/") ? img.slice(1) : img}`
);
setOldAlbum(fullAlbum);

      // Set property/vehicle specific data if available
      if (data.property_verification) {
        setPropertyType(data.property_verification.property_type || "");
        setPropertyAddress(data.property_verification.property_address || "");
        setTitleDeedNumber(data.property_verification.title_deed_number || "");
        // set property images (documents field could be array or JSON string, depends on your API)
     let docs = [];
  if (Array.isArray(data.property_verification.property_documents)) {
    docs = data.property_verification.property_documents;
  } else if (typeof data.property_verification.property_documents === "string") {
    try { docs = JSON.parse(data.property_verification.property_documents); } catch {}
  }
// Aap har doc ko full URL bana dein:
const fullDocs = docs.map(doc => 
  `https://admin.xpertbid.com/${doc.startsWith('/') ? doc.slice(1) : doc}`
);

// Ab aap propertyPreviews ko yeh hi array set karo
setPropertyPreviews(fullDocs);
}
      if (data.vehicle_verification) {
        setVehicleMakeModel(data.vehicle_verification.vehicle_make_model || "");
        setYearOfManufacture(data.vehicle_verification.year_of_manufacture || "");
        setChassisVin(data.vehicle_verification.chassis_vin || "");
        setVehicleCountry(data.vehicle_verification.country || "");
       // set vehicle images (docs field could be array or JSON string)
      let vdocs = [];
      if (Array.isArray(data.vehicle_verification.vehicle_documents)) {
        vdocs = data.vehicle_verification.vehicle_documents;
      } else if (typeof data.vehicle_verification.vehicle_documents === "string") {
        try {
          vdocs = JSON.parse(data.vehicle_verification.vehicle_documents);
        } catch {}
      }
     const fullVDocs = vdocs.map(doc => 
  `https://admin.xpertbid.com/${doc.startsWith('/') ? doc.slice(1) : doc}`
);
setVehiclePreview(fullVDocs);
    }
  });
}, [id, session]);

  useEffect(() => {
    axios.get("https://admin.xpertbid.com/api/get-category")
      .then(res => setCategories(res.data.categories || []));
  }, []);

  useEffect(() => {
    axios.get("https://admin.xpertbid.com/api/get-countries")
      .then(res => setCountries(res.data.country));
  }, []);

  useEffect(() => {
    if (!formData.category_id) return;
    axios.get(`https://admin.xpertbid.com/api/get-subcategories/${formData.category_id}`)
      .then(res => setSubCategories(res.data.subcategories));
  }, [formData.category_id]);

  useEffect(() => {
    if (!formData.sub_category_id) return;
    axios.get(`https://admin.xpertbid.com/api/get-childern/${formData.sub_category_id}`)
      .then(res => setChildCategories(res.data.subcategories));
  }, [formData.sub_category_id]);

  // Album Image Change
  const handleAlbumChange = e => {
    const files = Array.from(e.target.files || []);
    setAlbumFiles(files);
    setOldAlbum([]); // New image select ho to purani images hatado
  };

  // Property Docs Change
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

  // Vehicle Docs Change
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

  // Form Input Change
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "category_id") {
      setFormData(prev => ({
        ...prev,
        sub_category_id: "",
        child_category_id: "",
      }));
      setSubCategories([]);
      setChildCategories([]);
    }
    if (name === "sub_category_id") {
      setFormData(prev => ({ ...prev, child_category_id: "" }));
      setChildCategories([]);
    }
  };

  // Submit Handler (Edit/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const auctionFd = new FormData();
      Object.keys(formData).forEach(key => {
        auctionFd.append(key, formData[key]);
      });
      // Album (new selected files, warna kuch na bhejo, backend oldAlbum rakh lega)
      albumFiles.forEach(file => auctionFd.append("album[]", file));
      // Property/Vehicle docs
      propertyDocs.forEach(file => auctionFd.append("property_documents[]", file));
      vehicleDocuments.forEach(f => auctionFd.append("vehicle_documents[]", f));
      // Add property/vehicle fields if selected
      auctionFd.append("property_type", propertyType);
      auctionFd.append("property_address", propertyAddress);
      auctionFd.append("title_deed_number", titleDeedNumber);
      auctionFd.append("vehicle_make_model", vehicleMakeModel);
      auctionFd.append("year_of_manufacture", yearOfManufacture);
      auctionFd.append("chassis_vin", chassisVin);
      auctionFd.append("country", vehicleCountry);


        // --- Validation BEFORE API call ---
  if (albumFiles.length === 0 && oldAlbum.length === 0) {
    setErrorPopupMessage("Please upload at least one album image.");
    setShowErrorPopup(true);
    return;
  }
  if (formData.category_id === "222" && propertyDocs.length === 0 && propertyPreviews.length === 0) {
    setErrorPopupMessage("Please upload property documents.");
    setShowErrorPopup(true);
    return;
  }
  if (formData.category_id === "311" && vehicleDocuments.length === 0 && vehiclePreview.length === 0) {
    setErrorPopupMessage("Please upload vehicle documents.");
    setShowErrorPopup(true);
    return;
  }
       await axios.post(
      `https://admin.xpertbid.com/api/auctions_update/${id}`,
      auctionFd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    );

    setSuccessPopupMessage("Auction updated successfully!");
    setShowSuccessPopup(true);

  } catch (error) {
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
      setShowErrorPopup(true);
    } else {
      setErrorPopupMessage(error.message || "Submission failed.");
      setShowErrorPopup(true);
    }
  } finally {
    setIsSubmitting(false);
  }
};
  
  // LOADING GUARD
  if (!id || !session?.user?.token) {
    return (
      <>
        <Header />
        <div className="container-fluid p-0 p-xl-5 py-5 text-center">
          <div className="spinner-border" role="status" />
          <div>Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

   // Jab popup close ho, is function ko call karo
  const handleClose = () => {
    setShowSuccessPopup(false)
    router.push('/')  // Home (/) par redirect
  }
  // --- Render ---
  return (
    <>
      <Header />
        {/* POPUPS */}
    <SuccessPopup
  isOpen={showSuccessPopup}
  message={successPopupMessage}
  subMessage={successPopupSubMessage}
onClose={handleClose}
/>
<ErrorPopup
  isOpen={showErrorPopup}
  message={errorPopupMessage}
  subMessage={errorPopupSubMessage}
  onClose={() => setShowErrorPopup(false)}
/>
<WarningPopup
  isOpen={showWarningPopup}
  message={warningPopupMessage}
  url={verifyUrl}
  onClose={() => setShowWarningPopup(false)}
/>


      {/* Success/Error/Warning popups yahan rakh lo... */}

      <div className="container-fluid p-0 p-xl-5 py-5">
        <form onSubmit={handleSubmit} className="px-4 p-sm-5">
          <div className="row"> <div className="sell-head">
                <h1 className="up-listing pt-3 mb-3 mb-lg-5 ">
                  Edit your listing
                </h1>
              </div>
              <div className="col-12 col-lg-6">
             
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
  <div className="upload-box p-3" onClick={() => document.getElementById("docsInput").click()}>
    {propertyDocs.length > 0 ? (
      <div className="d-flex flex-wrap">
        {propertyDocs.map((file, i) => {
          const src = propertyPreviews[i];
          const isPdf = file.type === "application/pdf";
          
          return (
            <div key={i} className="position-relative m-1" style={{ width: "90px" }}>
              {isPdf ? (
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center pdf-preview"
                >
                  <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                  <div className="small text-truncate">{file.name}</div>
                </a>
              ) : (
                <img
                  src={src}
                  className="upload-preview"
                  alt={`Doc ${i + 1}`}
                  style={{ width: "90px", height: "90px" }}
                />
              )}
              <button
                type="button"
                className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
                style={{ width: "20px", height: "20px", fontSize: "10px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  const newDocs = [...propertyDocs];
                  const newPreviews = [...propertyPreviews];
                  newDocs.splice(i, 1);
                  newPreviews.splice(i, 1);
                  setPropertyDocs(newDocs);
                  setPropertyPreviews(newPreviews);
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    ) : propertyPreviews.length > 0 ? (
      <div className="d-flex flex-wrap">
        {propertyPreviews.map((src, i) => {
          const isPdf = typeof src === "string" && src.toLowerCase().endsWith(".pdf");
          const finalSrc = src.startsWith("http") ? src : process.env.NEXT_PUBLIC_API_BASE_URL + src;
          
          return (
            <div key={i} className="position-relative m-1" style={{ width: "90px" }}>
              {isPdf ? (
                <a
                  href={finalSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center pdf-preview"
                >
                  <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                  <div className="small text-truncate">{src.split("/").pop()}</div>
                </a>
              ) : (
                <img
                  src={finalSrc}
                  className="upload-preview"
                  alt={`Doc ${i + 1}`}
                  style={{ width: "90px", height: "90px" }}
                />
              )}
              <button
                type="button"
                className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
                style={{ width: "20px", height: "20px", fontSize: "10px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  const newPreviews = [...propertyPreviews];
                  newPreviews.splice(i, 1);
                  setPropertyPreviews(newPreviews);
                  // You might want to add API call here to delete the document from backend
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
      accept="image/png, image/jpeg,application/pdf"
      multiple
      style={{ display: "none" }}
      onChange={onDocsChange}
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
  <div className="upload-box" onClick={() => document.getElementById("vehicleInput").click()}>
    {vehicleDocuments.length > 0 ? (
      // Show newly selected files with cancel buttons
      <div className="d-flex flex-wrap">
        {vehiclePreview.map((src, i) => {
          const file = vehicleDocuments[i];
          const isPdf = file && file.type === "application/pdf";
          
          return (
            <div key={i} className="position-relative m-1" style={{ width: "90px" }}>
              {isPdf ? (
                <a href={src} target="_blank" rel="noopener noreferrer" className="text-center pdf-preview">
                  <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                  <div className="small text-truncate">{file.name}</div>
                </a>
              ) : (
                <img
                  src={src}
                  className="upload-preview"
                  alt={`Doc ${i + 1}`}
                  style={{ maxHeight: "90px" }}
                />
              )}
              <button
                type="button"
                className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
                style={{ width: "20px", height: "20px", fontSize: "10px" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the file input
                  const newFiles = [...vehicleDocuments];
                  const newPreviews = [...vehiclePreview];
                  newFiles.splice(i, 1);
                  newPreviews.splice(i, 1);
                  setVehicleDocuments(newFiles);
                  setVehiclePreview(newPreviews);
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    ) : vehiclePreview.length > 0 ? (
      // Show old vehicle docs (URLs from API) with cancel buttons
      <div className="d-flex flex-wrap">
        {vehiclePreview.map((src, i) => {
          const isPdf = typeof src === "string" && src.toLowerCase().endsWith(".pdf");
          const finalSrc = src.startsWith("http") ? src : process.env.NEXT_PUBLIC_API_BASE_URL + src;
          
          return (
            <div key={i} className="position-relative m-1" style={{ width: "90px" }}>
              {isPdf ? (
                <a href={finalSrc} target="_blank" rel="noopener noreferrer" className="text-center pdf-preview">
                  <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                  <div className="small text-truncate">{src.split("/").pop()}</div>
                </a>
              ) : (
                <img
                  src={finalSrc}
                  className="upload-preview"
                  alt={`Doc ${i + 1}`}
                  style={{ maxHeight: "90px" }}
                />
              )}
              <button
                type="button"
                className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
                style={{ width: "20px", height: "20px", fontSize: "10px" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the file input
                  const newPreviews = [...vehiclePreview];
                  newPreviews.splice(i, 1);
                  setVehiclePreview(newPreviews);
                  // You might also want to update your form state/API to remove this document
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
            {/* Right side image preview section */}
            <div className="col-lg-6 d-flex flex-column justify-content-between">
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

  {/* Show image previews if files are selected */}
  {albumFiles.length > 0 ? (
    albumFiles.map((file, idx) => {
      const objectUrl = URL.createObjectURL(file);
      return (
        <div key={idx} className="position-relative">
          <img
            src={objectUrl}
            alt={`Upload Preview ${idx + 1}`}
            className="rounded"
            style={{
              width: "130px",
              height: "100px",
              objectFit: "contain",
            }}
            onLoad={() => URL.revokeObjectURL(objectUrl)}
          />
          <button
            type="button"
            className="position-absolute top-0 end-0 btn btn-secondary btn-sm p-0"
            style={{ width: "20px", height: "20px", fontSize: "10px" }}
            onClick={(e) => {
              e.stopPropagation();
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
  ) : oldAlbum.length > 0 ? (
    // Show existing images from API with delete option
    oldAlbum.map((src, idx) => (
      <div key={idx} className="position-relative">
        <img
          src={src.startsWith('http') ? src : `https://admin.xpertbid.com/${src.startsWith('/') ? src.slice(1) : src}`}
          alt={`Existing Image ${idx + 1}`}
          className="rounded"
          style={{
            width: "130px",
            height: "100px",
            objectFit: "contain",
          }}
        />
        <button
          type="button"
          className="position-absolute top-0 end-0 btn btn-danger btn-sm p-0"
          style={{ width: "20px", height: "20px", fontSize: "10px" }}
          onClick={(e) => {
            e.stopPropagation();
            const newOldAlbum = [...oldAlbum];
            newOldAlbum.splice(idx, 1);
            setOldAlbum(newOldAlbum);
            // You might want to add API call here to delete the image from backend
          }}
        >
          ×
        </button>
      </div>
    ))
  ) : (
    // Show placeholder when no images
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
    You can upload multiple images, and they should be in PNG, GIF, WEBP, JPG, JPEG. The image dimensions must be at least 800 x 600 pixels to ensure optimal clarity and resolution.
  </p>
  <button
    type="button"
    className="btn btn-secondary mt-2"
    onClick={() => fileInputRef.current.click()}
  >
    Upload
  </button>
</div>
  <div className="pe-5 pt-3 d-flex  justify-content-end">
              <button
                type="submit"
                className="btn btn-black mt-3 mx-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
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

export default EditAuction;
