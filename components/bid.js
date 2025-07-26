import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import LoginModal from "@/components/LoginModal"; // adjust path if needed
import SuccessPopup from "../components/SuccessPopup"; // adjust the path as needed
import ErrorPopup from "../components/ErrorPopup"; // adjust the path as needed
import WarningPopup from "../components/warning"; // adjust the path as needed
const BidPage = ({ product }) => {
  const { data: session } = useSession();
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  //const [warning, setWarning] = useState({});
  const [highestBid, setHighestBid] = useState(0);
  const [activeModal, setActiveModal] = useState(null); // for login modal
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningPopupMessage, setWarningPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false); // disable button during request
  const [verifyUrl, setVerifyUrl] = useState("");


  // Fetch Highest Bid
  const fetchHighestBid = async () => {
    try {
      const response = await axios.get(
        `https://admin.xpertbid.com/api/highest-bid/${product.id}`
      );
      if (response.data.success) {
        setHighestBid(response.data.highest_bid);
      }
    } catch (error) {
      console.error("Error fetching the highest bid:", error);
    }
  };

  useEffect(() => {
    console.log("Product data:", product);
    fetchHighestBid();
    const interval = setInterval(() => {
      fetchHighestBid();
    }, 5000);
    return () => clearInterval(interval);
  }, [product.id]);

  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Place Bid
  const handlePlaceBid = async () => {
    setMessage("");
    setErrors({});
    setIsPlacingBid(true);
    // Check if user is logged in
    if (!session || !session.user?.token) {
      setActiveModal("signin");
      setIsPlacingBid(false);
      return;
    }
  // Convert bid amount and minimum bid to numbers
  const userBid = parseFloat(bidAmount);
  const minBid = parseFloat(product.minimum_bid);

  // Agar user bid, minimum bid se kam hai to error dikhayein
  if (userBid < minBid) {
    setErrorPopupMessage(`Your bid must be greater than or equal to the minimum bid of ${minBid} USD.`);
    setErrorPopupSubMessage("");
    setShowErrorPopup(true);
    setIsPlacingBid(false);
    return;
  }
    try {
      await axios.post(
        "https://admin.xpertbid.com/api/bids",
        { auction_id: product.id, bid_amount: bidAmount },
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      //console.log(warn);

      setShowSuccessPopup(true);
      setBidAmount("");
      fetchHighestBid();
    }  catch (error) {
      const data = error.response?.data;
    
      if (data?.is_verified === false) {
        // show the warning popup instead of redirect
        setWarningPopupMessage(data.message);
        setVerifyUrl(data.verify_url || "/account?tab=identity_verification");
        setShowWarningPopup(true);
        return;
      }
    
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0][0];
        setErrorPopupMessage(firstError);
        setShowErrorPopup(true);
      } else {
        setErrorPopupMessage(data?.message || "An unexpected error occurred.");
        setShowErrorPopup(true);
      }
    } finally {
      setIsPlacingBid(false);
    }
    
  };

  // Close success popup and then refresh the page
  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    window.location.reload();
  };

  return (
    <>
      {/* Login Modal */}
      <LoginModal
        isOpen={activeModal === "signin"}
        onClose={() => setActiveModal(null)}
      />

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        message="Bid Placed Successfully"
        subMessage="Your bid has been recorded!"
      />

      {/* Error Popup */}
      {showErrorPopup && (
        <ErrorPopup
          isOpen={showErrorPopup}
          onClose={() => {
            setShowErrorPopup(false);
            setErrorPopupMessage("");
            setErrorPopupSubMessage("");
          }}
          message={errorPopupMessage}
          subMessage={errorPopupSubMessage}
        />
      )}
      {showWarningPopup && (
  <WarningPopup
    isOpen={showWarningPopup}
    onClose={() => {
      setShowWarningPopup(false);
      setWarningPopupMessage("");  // Reset message
    
    }}
    message={warningPopupMessage}
    subMessage={
       <button onClick={() => window.location.href = verifyUrl} className="btn btn-black">
              Identity Verification
            </button>
         }
  />
)}
      <div className="bid-rank-and-time">
        <div className="bid-price-and-rank">
          <span className="rank">Highest Bid</span>
          <div className="price">
            <i className="fa-solid fa-dollar-sign"></i>
            <span className="price-no">{highestBid}</span> USD
          </div>
        </div>
        <div className="bid-time-and-date">
          <span className="endin">End in</span>
          <p className="date">{formatDate(product.end_date)}</p>
        </div>
      </div>

      <input type="hidden" value={product.id} />

      {/* (Optional inline alerts can be removed as we're using popups) */}
      {message && <div className="alert alert-success">{message}</div>}
      {errors.general && <div className="alert alert-danger">{errors.general}</div>}

      <div className="input-group">
        <input
          type="number"
          placeholder="USD"
          className={`currency-and-price ${
            errors.bid_amount ? "is-invalid" : ""
          }`}
          value={bidAmount}
          onChange={(e) => {
            setBidAmount(e.target.value);
            setErrors((prev) => ({ ...prev, bid_amount: "" }));
          }}
        />
        {errors.bid_amount && (
          <div className="invalid-feedback">{errors.bid_amount[0]}</div>
        )}
      </div>

      <div className="bid-place-button">
        <button
          className="place-bid mt-3"
          onClick={handlePlaceBid}
          disabled={isPlacingBid}
        >
          {isPlacingBid ? "Placing Bid..." : "Place Bid"}
        </button>
      </div>

      <div className="min-bid-and-estimate">
        <div className="minimum-bid">
          Minimum bid: <span className="bid-no">{product.minimum_bid}</span> USD.
        </div>
        <div className="estimate-bid">
          Estimate: <span className="bid-esti-no1">{product.reserve_price}</span> USD.
        </div>
      </div>

      <style jsx>{`
        .is-invalid {
          border: 1px solid red;
        }
      `}</style>
    </>
  );
};

export default BidPage;
