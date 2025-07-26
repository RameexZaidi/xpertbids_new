import React, { useState, useEffect } from "react";
import Link from "next/link";
import ListPackeg from "../components/ListPackeg"; // Adjust the path if needed

const ListingCard = ({ listing }) => {
  const [isListPackegOpen, setIsListPackegOpen] = useState(false);
const [isPromoteDisabled, setIsPromoteDisabled] = useState(listing.featured_name === "home_featured");
 
    const [isPromoted, setIsPromoted] = useState(false);
    console.log(isPromoted);

  // Key to store promoted state in localStorage for this listing
  const localStorageKey = `promoted_${listing.id}`;

  // Check localStorage on mount to see if this listing is already promoted.
  useEffect(() => {
    const promoted = localStorage.getItem(localStorageKey);
    if (promoted === "true") {
      setIsPromoteDisabled(true);
        setIsPromoted(true);   
    }
  }, [localStorageKey]);
 const handleClick = () => {
    if (isPromoteDisabled) return;
    setIsPromoted(true);
    setIsListPackegOpen(true);
  };

  // Callback when the package is purchased successfully.
  const handlePurchaseSuccess = () => {
    setIsListPackegOpen(false);
    setIsPromoteDisabled(true);
    localStorage.setItem(localStorageKey, "true");
  };

  // Callback when the popup is closed without successful purchase.
  const handlePopupClose = () => {
    setIsListPackegOpen(false);
  };
console.log(listing);
  return (
    <div className={`listing-card col-12${listing.featured_name === "home_featured" ? " listing_promoted" : ""}`}>
      <div className="row">
        <div className="col-lg-7 listing-detail">
          <div className="row">
            <div className="col-md-3">
              <div className="listing-img">
                <img
                  src={`https://admin.xpertbid.com${JSON.parse(listing.album)[0]}`}
                  alt={listing.title}
                />
              </div>
            </div>
            <div className="col-md-9">
              <h3 className="listing-product-title">{listing.title}</h3>
              <div className="listing-product-bid-time">
                <div className="row">
                  <div className="col-sm-5 bid-and-price">
                    <p className="listing-bid-label">Highest Bid</p>
                    <p className="listingPrice">
                      <i className="fa-solid fa-dollar-sign"></i>
                      <span className="listingPriceNumber">{listing.currentBid}</span>
                      USD
                    </p>
                  </div>
                  <div className="col-sm-7 bid-and-time">
                    <p className="listing-bid-end-label">End in</p>
                    <p className="listingTime">
                      <span className="listingDate">{listing.start_date}</span> at{" "}
                      <span className="lisitngTime">{listing.end_date}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div className="col-lg-5 edit-promote">
 <span
  className="listingPromote"
  onClick={!isPromoteDisabled ? handleClick : undefined}
  style={{
    cursor: isPromoteDisabled ? "not-allowed" : "pointer",
    opacity: isPromoteDisabled ? 0.6 : 1,
    backgroundColor: isPromoteDisabled ? "#12D18E" : "#52d4862e",
    color: isPromoteDisabled ? "#fff" : "#32A861",
  }}
>
  {isPromoteDisabled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M14.9257 8.93341H12.3507V2.93341C12.3507 1.53341 11.5924 1.25008 10.6674 2.30008L10.0007 3.05841L4.35908 9.47508C3.58408 10.3501 3.90908 11.0667 5.07574 11.0667H7.65074V17.0667C7.65074 18.4667 8.40907 18.7501 9.33407 17.7001L10.0007 16.9417L15.6424 10.5251C16.4174 9.65008 16.0924 8.93341 14.9257 8.93341Z"
        fill="white"
      />
    </svg>
  ) : (
    <img
      src="/assets/images/flash.svg"
      alt="Promote"
      width={20}
      height={20}
    />
  )}
  Promote
</span>

          <button className="button-style-1 editListing">
            <Link className="nav-link" href={`/product/${listing.id}`}>
              View Listing
            </Link>
          </button>
          {isListPackegOpen && (
            <ListPackeg
              isOpen={isListPackegOpen}
              onPurchaseSuccess={handlePurchaseSuccess} // Called on successful purchase
              onClose={handlePopupClose} // Called when popup is cancelled
              listing={listing}  
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
