// components/HeroSection.js
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components
import { Navigation, Autoplay } from "swiper/modules"; // For Swiper >= 9.x
import { Oval } from "react-loader-spinner"; // Import the loader

export default function HeroSection() {
  const [sliderData, setSliderData] = useState([]);

  // Fetch slider data from API
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await axios.get(
          "https://admin.xpertbid.com/api/get-slider-realstate"
        );
        // Wrap the data in an array if it's not already an array
        const data = response.data;
        setSliderData(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching slider data:", error);
      }
    };

    fetchSliderData();
  }, []);

  return (
    <section className="hero-section">
      <div className="container-fluid">
        {sliderData.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              slidesPerView={3}
              spaceBetween={30}
              loop
              breakpoints={{
                360: { slidesPerView: 1 },
                640: { slidesPerView: 1 },
                1024: { slidesPerView: 1 },
                1367: { slidesPerView: 1 },
              }}
            >
              {sliderData.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="row">
                    <div className="col-lg-6 left-section text-start">
                      <h2 className="hero-sec">{slide.title}</h2>
                      <h1 className="hero-sec">{slide.subtitle}</h1>
                      <p>{slide.description}</p>
                      <div className="hero-sec-btn">
                        <Link className="explore-more" href={"/marketplace"}>
                          Explore More
                        </Link>
                        <Link href={"/sell"} className="sellnow">
                          Sell Now
                        </Link>
                      </div>
                      <div className="happy-clients">
                        <div className="client-ratings">
                          <h3>430K+</h3>
                          <span>Listings</span>
                        </div>
                        <div className="client-ratings">
                          <h3>159K+</h3>
                          <span>Creators</span>
                        </div>
                        <div className="client-ratings">
                          <h3>87K+</h3>
                          <span>Collections</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 right-section">
                      <img
                        src={`https://admin.xpertbid.com/${slide.image}`}
                        alt={slide.title}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <div className="loader-container">
            <Oval
              height={80}
              width={80}
              color="#3498db"
              secondaryColor="#f3f3f3"
              ariaLabel="loading-indicator"
            />
          </div>
        )}
      </div>
    </section>
  );
}
