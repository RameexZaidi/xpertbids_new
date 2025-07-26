import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
const ProductImages = ({ albumImages }) => {
  // Parse the album JSON string
  const parsedAlbum = JSON.parse(albumImages.replace(/\\/g, '')); // Replace escape characters and parse
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      
                <div className="product-images-parent m-0">
                  <div className="product-main-image">
                  
                    <Swiper
                      style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                        margin:"0px",
                      }}
                      spaceBetween={10}
                      navigation={true}
                      thumbs={{ swiper: thumbsSwiper }}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper2 m-0"
                    >
                      {parsedAlbum.map((image, index) => (
                            <SwiperSlide key={index} style={{margin:"0px",}}>
                              <div className=" pro-image-main" >
                                <img
                                  src={`https://admin.xpertbid.com/${image}`}
                                  alt={`Album Slide ${index}`}
                                />
                              </div>
                            </SwiperSlide>
                      ))}
                    </Swiper>  
                  </div>

                  {/* Image Album (Slider) */}
                  <div className="product-images-album"  style={{ height:"100px",}}>
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper"
                      id='bid_image'
                    >
                      {parsedAlbum.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className="pro-image" style={{height:"100%"}}>
                            <img
                              src={`https://admin.xpertbid.com/${image}`}
                              alt={`Album Slide ${index}`}
                              className='newimg'
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* <div className="product-images-album">
                    <div className="swiper-product-imageAlbum" id="swiper-product-imageAlbum">
                      <div className="swiper-wrapper">
                        {parsedAlbum.map((image, index) => (
                          <div className="swiper-slide" key={index}>
                            <div className="pro-image">
                              <img
                                src={`https://admin.xpertbid.com/${image}`}
                                alt={`Album Slide ${index}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>  
                    </div>
                  </div> */}
                </div>
              
              {/* Add more elements as needed */}
           
    </>
  );
};

export default ProductImages;
