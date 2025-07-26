 export default function BidHistory ({ bids }) {
  const defaultProfileImage = "/assets/images/Group-1.png"; // Ensure this exists inside the public folder

  return (
    <div className="bid-history-parent">
      <h2 className="description">Bid History</h2>
      {bids && bids.length > 0 ? (
         bids.map((bid) => (
          <div className="history-user parent" key={bid.id}>
            <div className="history-user-profile">
            <img
                src={
                  bid?.userImage && bid.userImage.trim() !== ""
                    ? bid.userImage.startsWith("https")
                      ? bid.userImage // External URL
                      : `https://admin.xpertbid.com/${bid.userImage}` // Local upload
                    : defaultProfileImage
                }
                style={{ width: "30px", height: "30px", borderRadius: "40%", objectFit: "cover" }}
            />

                
               
              <div className="username-and-date ms-3">
                {/* <p className="history-user-name">{bid.userName}</p> */}
                <span className="date">{bid.date }</span>
              </div>
            </div>
            <div className="history-user-payAmount">
              <p className="history-no">{bid.amount}</p>
              <p className="history-currency">USD</p>
            </div>
          </div>
        ))
        ) : (
        <p>No Bid History</p>
      )}
    </div>
);
}
//  export default BidHistory;
