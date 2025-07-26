// components/FeaturedProducts.js
import { useState, useEffect } from "react";
import Link from "next/link";
import CountdownTimer from "./countdown";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Autoplay } from "swiper/modules"; // Use this for Swiper >= 9.x

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
      
  
      const fetchProducts = async () => {
        const response = await fetch("https://admin.xpertbid.com/api/get-realestate");
        const data = await response.json();
        //console.log(product);
        setProducts(data.product || []);
       // setFilteredProducts(data.product || []); // Default to all products
      };
  
    
      fetchProducts();
    }, []);
    //console.log(products);
    return (
      <section className="featured-product">
        <div className="container-fluid">
          <div className="featured-heading"><h2>Realestate </h2></div>
          <div className="swiper-featured-product">
               
            
              {/* Repeat slides as needed */}
                {products.length > 0 ? (
                  <Swiper
                    modules={[Navigation,Autoplay]} // Ensure proper module usage
                    navigation
                    autoplay={{
                      delay: 2000, // Time between slides (in milliseconds)
                      disableOnInteraction: false, // Continue autoplay after user interaction
                    }}
                    slidesPerView={4}
                    spaceBetween={30}
                    loop
                    breakpoints={{
                      360: { slidesPerView: 1 },
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                      1300: { slidesPerView: 4 },
                    }}
                  >
                  {products.map((product, index) => (
                    <SwiperSlide key={index}>
                      <Link href={`/product/${product.id}`} className="product-box">
                      <div className="pro-image">
                     
                  <img
                    src={`https://admin.xpertbid.com/${JSON.parse(product.album.replace(/\\/g, ''))}`}
                    alt={product.name}
                  />
                    <CountdownTimer startDate={product.start_date} endDate={product.end_date} />
                  </div>
                  <div className="pro-title">
                    <h2>{product.title}</h2>
                  </div>
                  <div className="pro-meta">
                    <div className="pro-price">
                      <span>Current Bid</span>
                      <p className="price"><i className="fa-solid fa-dollar-sign"></i>{product.bids_max_bid_amount} USD</p>
                    </div>
                    <div className="pro-buy-btn">
                      <div className="pro-bid-btn">
                      <Link href={`/product/${product.id}`}>Place Bid</Link>
                      </div>
                    </div>
                  </div>
                  </Link>
                    </SwiperSlide>
                
                  
                
                  ))}
                </Swiper>
            ) : (
              <p>No products found.</p>
            )}
          </div>
            {/* <div className="swiper-arrows">
              <div className="swiper-button-prev"><i className="fa-solid fa-arrow-left"></i></div>
              <div className="swiper-button-next"><i className="fa-solid fa-arrow-right"></i></div>
            </div> */}
          </div>
      </section>
    );
  }
  