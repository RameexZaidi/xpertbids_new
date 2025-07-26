import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductHeader from "../../components/ProductHeader";
import ProductImages from "../../components/ProductImages";
import ProductDetails from "../../components/ProductDetails";
import BidHistory from "../../components/BidHistory";
import OtherItems from "../../components/OtherItems";
import { Oval } from "react-loader-spinner"; // Import the loader

const ProductPage = () => {
  const router = useRouter();
  const productId = router.query.slug; // Get the productId from the URL

  const [product, setProduct] = useState(null); // Product data state
  const [bids, setBids] = useState([]);         // Bid history state
  const [owner, setOwner] = useState([]);       // Product owner
  const [relatedItems, setRelatedItems] = useState([]); // Related items
  const [loading, setLoading] = useState(true); // Loading state for API

  useEffect(() => {
    if (!productId) return; // Wait until the router query is available

    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productResponse = await axios.get(
          `https://admin.xpertbid.com/api/product/${productId}`
        );
        const productData = productResponse.data;
        setProduct(productData.product.product[0]);
        setBids(productData.product.bids);
        setOwner(productData.product.owner[0]);
        setRelatedItems(productData.product.relatedItems);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);
  
  //console.log('rage',owner);
  return (
    <>
      <Header />
      {loading ? (
        // Show loader while loading
        <div className="loader-container">
          <Oval 
            height={80}
            width={80}
            color="#3498db"
            secondaryColor="#f3f3f3"
            ariaLabel="loading-indicator"
          />
        </div>
      ) : (
        <>
      <ProductHeader views={product.views || 0} link={`https://xpertbid.com/product/${product.id}`} productId={product.id}/>
      <section className="product-image-and-brief">
        <div className="container-fluid">
          <div className={`products-brief-parent${product.featured_name === "home_featured" ? " listing_promoted" : ""}`}>
           
            <div className="row">
              <div className="col-md-6">
                <ProductImages mainImage={product.image} albumImages={product.album} />
              </div>
              <div className="col-md-6">
               <div
  style={{
    display: product.featured_name === "home_featured" ? "block" : "none"
  }}
>
                <button type="button" className="pro_feature" disable><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="me-2" viewBox="0 0 16 16" fill="none">
  <path d="M11.939 7.14644H9.87903V2.34644C9.87903 1.22644 9.27236 0.999769 8.53236 1.83977L7.99903 2.44644L3.4857 7.57977C2.8657 8.27977 3.1257 8.8531 4.05903 8.8531H6.11903V13.6531C6.11903 14.7731 6.7257 14.9998 7.4657 14.1598L7.99903 13.5531L12.5124 8.41977C13.1324 7.71977 12.8724 7.14644 11.939 7.14644Z" fill="#32A861"/>
</svg>Featured</button>
</div>
                <ProductDetails product={[product,owner]} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="product-detailed-info">
        <div className="container-fluid">
            <div className="product-detailed-info-parent">
                <div className="row justify-content-between">
                <div className="col-lg-6 col-md-6">
                  <h2 className="description">Description</h2>
                  <p className="description-paragraph">{product.description}</p>

                  <div className="years-and-location">
                    <h3 className="details">Details</h3>
                    <div className="row detail-1">
                      {/* <div className="col-sm-6">
                        <div className="condition-time">
                          <span className="condition">Condition</span>
                          <span className="time">{product.product_condition}</span>
                        </div>
                      </div> */}
                      <div className="col-12">
                        <div className="years-no">
                          <span className="year">Year</span>
                          <span className="no">{product.product_year}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="details">Location</h3>
                    <div className="col-12">
                      <div className="location">
                        <i className="fa-solid fa-location-dot"></i>
                        {product.product_location}
                      </div>
                    </div>
                  </div>
                </div>
            
            <div className="col-lg-4 col-md-6">
              <BidHistory bids={bids} />
            </div>
            </div>
          </div>
      </div>
          
      </section>
      <OtherItems items={relatedItems} />
      </>
    )}

    <style jsx>{`
      .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
    `}</style>
      <Footer />
    </>
  );
};

export default ProductPage;
