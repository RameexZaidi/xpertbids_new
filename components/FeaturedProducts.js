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
        const response = await fetch("https://admin.xpertbid.com/api/get-featured");
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
        <div className="container-fluid p-0">
          <div className="featured-heading"><h2>Featured Listings  </h2></div>
          <div className="swiper-featured-product">


              {/* Repeat slides as needed */}
            
                {products.length > 0 ? (
                    <div style={{ overflow: 'visible' }}>
                 <Swiper
  modules={[Navigation, Autoplay]}
  navigation
  loop={products.length > 1}
  autoplay={{ delay: 3000, disableOnInteraction: false }}
  centeredSlides={true}
  spaceBetween={40}
  breakpoints={{
    360:  { slidesPerView: 1, centeredSlides: true },
    640:  { slidesPerView: 2, centeredSlides: true },
    1024: { slidesPerView: 3, centeredSlides: true },
    1300: {
      slidesPerView: 3.5,       // 3 full cards + half peek
      centeredSlides: true,     // center mode
      spaceBetween: 40,         // gap between slides
    },
  }}
>
{products.map((product, index) => {
  let imgPath = "";
  try {
    const album = JSON.parse(product.album);
    imgPath = Array.isArray(album) ? album[0] : album;
    imgPath = imgPath?.replace(/^\/+/, "");
  } catch  {
     // console.error(e);
    imgPath = product.album?.replace(/^\/+/, "");
  }

  return (
    <SwiperSlide key={index}>
      <div className="pro-image">
        <Link href={`/product/${product.slug}`} className="product-box">
          <img
            src={`https://admin.xpertbid.com/${imgPath}`}
            alt={product.name} className="img-fluid"
          />
        </Link>
        <CountdownTimer startDate={product.start_date} endDate={product.end_date} />
      </div>
      <div className="pro-title" style={{ color: "black" }}>
        <h2>
          <Link href={`/product/${product.slug}`} className="text-color-black">
            {product.title}
          </Link>
        </h2>
      </div>
      <div className="pro-meta">
        <div className="pro-price">
          <span>Current Bid</span>
          <p className="price">
           
            {product.bids_max_bid_amount} PKR
          </p>
        </div>
        <div className="pro-buy-btn">
          <div className="pro-bid-btn">
            <Link href={`/product/${product.slug}`}>Place Bid</Link>
          </div>
        </div>
      </div>
    </SwiperSlide>
  );
})}
                </Swiper>
                </div>
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
