import { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function FilteredCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://admin.xpertbid.com/api/get-category");
        const allCategories = response.data.categories || [];
        const filtered = allCategories.filter((cat) => cat.id >= 190 && cat.id <= 200);
        setCategories(filtered);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      {loading ? (
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
        <section className="browsecategories">
          <div className="container-fluid">
            <div className="row cate-heading-parent">
              <div className="col-md-6 cate-heading">
                <h2 className="browse-heading">Vehicle Categories</h2>
              </div>
            </div>

            <div className="swiper-featured-product">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 2000, disableOnInteraction: false }}
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
                {categories.map((cat, i) => (
                  <SwiperSlide key={i}>
                    <Link href={`/subcategory/${cat.name}`} className="product-box">
                      <div className="cate-card" style={{ height: "284px" }}>
                        <div className="row images-portion">
                          <div className="col-12 image-1" style={{ height: "200px" }}>
                            <img
                              src={`https://admin.xpertbid.com//${cat.image}`}
                              alt={cat.name}
                            />
                          </div>
                        </div>
                        <div className="cate-title text-start">
                          <h2>{cat.name}</h2>
                        </div>
                        <div className="cate-lisitng text-start">
                          <span>{cat.count || cat.listings} Listings</span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
      `}</style>
    </>
  );
}