import React from "react";
import Link from "next/link";
import CountdownTimer from "./countdown";
const AuctionCard = ({ auction }) => {
  return (
    <div className="col-sm-6 col-md-4 col-lg-4 mkt-child">
              <div className="market-card">
                 <Link href={`/product/${auction.slug}`}>
                <div className="mkt-img">
                  <img
                     src={`https://admin.xpertbid.com/${auction.image.replace(/\\/g, '/')}`}
                    alt={auction.name}
                  />
                  <CountdownTimer startDate={auction.start_date} endDate={auction.end_date} />
                </div>
                <div className="mkt-body">
                  <div className="mkt-pro-head">
                    <h3>{auction.title} </h3>
                  </div>
                  <div className="mkt-detail">
                    <div className="mkt-crt-bid">
                      <span className="crnt-bid" style={{color:"#23262F"}}>Current Bid</span>
                      <div className="mkt-bid-price">
                        <i className="fa-solid fa-dollar-sign"></i>
                        <span className="price">{auction.currentBid}</span> USD
                      </div>
                   </div>
                    <div className="mkt-bid-btn">
                      <Link href={`/product/${auction.slug}`}>Place Bid</Link>
                    </div>
                  </div>
                   
                </div>
                </Link>
              </div>
            </div>
  );
};

export default AuctionCard;