import BidPage from "../components/bid";
import FavoriteIcon from "../components/toggleFavorite"
// import profileImage from "../components/ProfileImage"
//import UserProfile from "./UserProfile";

 // Local upload
 
  
 
 const defaultProfileImage = "/assets/images/Group-1.png"; // Make sure this exists in your public folder

 const ProductDetails = ({ product }) => {
    const profileImage =
    product[1]?.profile && product[1].profile.trim() !== ""
      ? product[1].profile.startsWith("https")
        ? product[1].profile // External URL
        : `https://admin.xpertbid.com/${product[1].profile}`
      : defaultProfileImage;
    return (
      <div className="product-details-brief-parent">
        <h2 className="product-heading">{product[0].title}</h2>
        <div className="owned-by-and-favoruite">
          <div className="owned">
          <img
              src={profileImage}
              alt={product[0].name}
              onError={(e) => { e.target.src = defaultProfileImage; }} // Fallback if image fails to load

              style={{ width: "40px", height: "40px", borderRadius: "40%" , objectFit:"cover" }}
            />
            <div className="customer-name">
              <span className="owner">Owned By</span>
              <p className="name">{product[1].name}</p>
            </div>
          </div>
          <div className="favourite">
          <FavoriteIcon auctionId={product[0].id} isFavorite={product[0].isFavorite} />
            
          </div>
        </div>
        
        <BidPage product={product[0]}/>
        
        
      </div>
    
  );
}  
export default ProductDetails;