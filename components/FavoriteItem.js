// components/FavoriteItem.js
import Link from 'next/link';
import CountdownTimer from './countdown';

// Utility to normalize item.image into an array of URLs
function getImageUrls(imageField) {
  if (!imageField) return [];
  if (Array.isArray(imageField)) {
    return imageField;
  }
  if (typeof imageField === 'string') {
    // Try JSON parse first
    try {
      const parsed = JSON.parse(imageField);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Not valid JSON, fall back to splitting
    }
    // Strip brackets/quotes and split by comma
    return imageField
      .replace(/[\[\]"]+/g, '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

const FavoriteItem = ({ item }) => {
  const urls = getImageUrls(item.image);
  const firstImage = urls[0] || '/assets/images/placeholder.jpg'; // fallback if no image
console.log(item);

  return (
    <div className="col-lg-4 col-md-6 col-sm-12 mkt-child">
      <div className="market-card">
        <div className="mkt-img">
          <Link href={`/product/${item.slug}`} className="product-box">
            <img
              src={`https://admin.xpertbid.com/${firstImage}`}
              alt={item.name}
            />
          </Link>
          <CountdownTimer startDate={item.start_date} endDate={item.end_date} />
          <div className="favourite-icon">
           
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  fill="red">
          <path
            d="M16.44 3.1001C14.63 3.1001 13.01 3.9801 12 5.3301C10.99 3.9801 9.37 3.1001 7.56 3.1001C4.49 3.1001 2 5.6001 2 8.6901C2 9.8801 2.19 10.9801 2.52 12.0001C4.1 17.0001 8.97 19.9901 11.38 20.8101C11.72 20.9301 12.28 20.9301 12.62 20.8101C15.03 19.9901 19.9 17.0001 21.48 12.0001C21.81 10.9801 22 9.8801 22 8.6901C22 5.6001 19.51 3.1001 16.44 3.1001Z"
          />
        </svg>
          </div>
        </div>
        <div className="mkt-body">
          <div className="mkt-pro-head">
            <h3>
              <Link href={`/product/${item.slug}`} className="product-box">
                {item.name}
              </Link>
            </h3>
          </div>
          <div className="mkt-detail">
            <div className="mkt-crt-bid">
              <span className="crnt-bid">Current Bid</span>
              <div className="mkt-bid-price">
                <i className="fa-solid fa-dollar-sign"></i>
                <span className="price">{item.currentBid}</span> USD
              </div>
            </div>
            <div className="mkt-bid-btn">
              <Link href={`/product/${item.slug}`}>Place Bid</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItem;