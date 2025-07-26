import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import SuccessPopup from "@/components/SuccessPopup"; // adjust path as needed
import ErrorPopup from "@/components/ErrorPopup"; // adjust path as needed

const ListPackeg = ({ isOpen, onClose, onPurchaseSuccess, listing }) => {
  const { data: session } = useSession();
  const [walletBalance, setWalletBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Popup states for success and error
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");

  // Flag state: tracks if the plan is purchased so that the promote button remains disabled if purchased
  const [isPlanPurchased, setIsPlanPurchased] = useState(false);

  // Fetch the wallet balance when component mounts or when session changes
  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (session?.user) {
        try {
          const response = await axios.get("https://admin.xpertbid.com/api/wallet", {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
              "Cache-Control": "no-store",
            },
          });
          console.log("Wallet API response:", response.data); // Debug: log the response data
          setWalletBalance(response.data.balance);
        } catch (err) {
          console.error("Error fetching wallet balance", err);
        }
      }
    };
    fetchWalletBalance();
  }, [session]);

  // Handler for buying a plan with a given price
  const handleBuyPlan = async (price) => {
    // Clear previous messages and popups
    setErrorMessage("");
    setShowErrorPopup(false);
    setShowSuccessPopup(false);

    // Check if the wallet has sufficient balance
    if (walletBalance < price) {
      setErrorPopupMessage("Your wallet is empty");
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
      return;
    }

    try {
      // Make the API call to deduct the money
      const response = await axios.post(
        "https://admin.xpertbid.com/api/wallet/deduct",
        {
            amount: price,
           product_id: listing.id,
           title:      listing.title,
           category_id: listing.category_id,
           album:      JSON.stringify(listing.album),
          },
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );

      // Check if successful (adjust logic based on your API response)
      if (response.status === 200 || response.data.message === "Amount deducted successfully") {
        // Update the wallet balance locally and mark the plan as purchased
        setWalletBalance((prev) => prev - price);
        setSuccessPopupMessage("Plan purchased successfully!");
        setSuccessPopupSubMessage("We have deducted 54 USD from your wallet.");
        setShowSuccessPopup(true);
        setIsPlanPurchased(true);
        // Do not call onPurchaseSuccess or close the modal immediately; wait until the user closes the success popup.
      } else {
        setErrorPopupMessage("Deduction failed. Please try again.");
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      setErrorPopupMessage("Error processing transaction");
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
    }
  };

  // Reset transient states when modal closes (if plan wasn't purchased)
  useEffect(() => {
    if (!isOpen && !isPlanPurchased) {
      setShowSuccessPopup(false);
      setShowErrorPopup(false);
      setErrorMessage("");
    }
  }, [isOpen, isPlanPurchased]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => {
            setShowSuccessPopup(false);
            // After closing the success popup, trigger parent's onPurchaseSuccess callback and then close this modal.
            if (onPurchaseSuccess) {
              onPurchaseSuccess();
            }
            onClose();
            window.location.reload(); // Refresh the page when the popup is closed
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
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Purchase your package</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          {/* Modal Body */}
          <div className="modal-body">
            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
            <div className="row w-100 justify-content-center">
              <div className="col-lg-10 mb-3">
                <div className="pricing-card p-3 shadow-lg">
                  <div className="d-flex justify-content-between border-bottom1 mb-4 align-items-center">
                    <div>
                      <h2 className="">Featured Listing</h2>
                      <p className="text-muted">
                        Your lot will be showcased to thousands of buyers across the platform.
                      </p>
                      <ul className="listing-features">
                        <li>Prominent display in the Promoted Listings section</li>
                        <li>Priority placement in relevant search results and categories</li>
                        <li>Higher visibility = More bids = Faster sales</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-dark px-3 py-2"
                      onClick={() => handleBuyPlan(54)}
                      disabled={isPlanPurchased}
                    >
                      Buy Plan for 54 USD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Optionally, add a modal footer here */}
        </div>
      </div>
    </div>
  );
};

export default ListPackeg;
