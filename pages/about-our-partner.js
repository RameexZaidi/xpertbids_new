import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About_Our_partner = () => {
    return (
        <>
        <Header />
                     <section className="py-5 sbs position-relative bg-light our-partner">
    {/* Optional dot‐pattern in top-right */}


    <div className="container ">
      <h2 className="text-center  main-heading-about mb-5">About Our Partners</h2>

      {/* Row 1: Text Left, Image Right */}
      <div className="row align-items-center gap-3  my-5 py-5 justify-content-between">
        <div className="col-md-5 order-md-2 order-1">
          <p className="mb-4 text-secondary ">
           Established in 2020, Craxx is a fashion brand created for all those who enjoy indulging themselves in the latest lifestyle trends as a mean to express themselves.Craxx has separate product lines in order to cater to all segments and their growing demands, be it men or women. Within each line, a variety of products are offered catering to a range of different styles and preferences, from highly fashionable on trend pieces to more casual, every day attire and basic apparel.
          </p>
          <p className="text-secondary">
           This makes us a customer&rsquo;s one-stop high-street destination for all western wear wardrobe demands. Furthermore, Craxx believes in providing its clients affordable good quality clothing all in one package. A package of excellent quality and service to cater your everyday looks. Craxx denim is designed to grasp your body structure and provide a comfortable fit to enhance your look. Our products promise to deliver at all times.
          </p>
        </div>
        <div className="col-md-5 text-md-end">
          <div
            className="bg-white rounded-3 shadow-sm w-100"
            style={{ height: "300px" , alignContent:"center"}}
          >
            <img src="assets/images/craxx.jpg" style={{height:"auto" , width:"100%"}}/>
          </div>
          
        </div>
      </div>

      {/* Row 2: Image Left, Text Right */}
      <div className="row align-items-center gap-3  my-5 py-5 justify-content-between">
        <div className="col-md-5 order-md-1 mb-4 mb-md-0">
          <div
            className=" patex rounded shadow-sm w-100"
            style={{ height: "300px" , alignContent:"center" }}
          >
            <img src="assets/images/patex.jpg" style={{width:"100%"}} />
        </div>
        </div>
        <div className="col-md-5 order-md-2">
          <p className="mb-4 text-secondary">
          Pakitex Boards (Pvt) Ltd., a family-owned company in Pakistan, has established itself as a leader in the production of quality engineered wood products.  We take pride in our &apos;PATEX&apos; brand, which has gained widespread recognition for its premium Chipboard.
          </p>
          <p className="text-secondary">
            Patex Studios is a melamine tableware brand offering stylish and high-quality products. Our Melamine Dinner ware feature a double-glazed finish, ensuring a scratch-resistant and elegant look for any occasion.
          </p>
        </div>
      </div>

      {/* Row 3: Text Left, Image Right */}
      <div className="row align-items-center my-5 gap-3 py-5 justify-content-between">
        <div className="col-md-5 order-md-2 order-1">
          <p className="mb-4 text-secondary">
           NOBLE TEXTILE MILLS Setting Uniform Trends Since 1973 Manufacturer of Uniform Fabric for Schools, Colleges, Restaurants, Hospitals and Corporate. a company of NOBLE GROUP Noble Textile Mills are the pioneers of uniform textile in Pakistan, known for their high quality fabric and fine stitching of garments.
          </p>
          <p className="text-secondary">
          
          </p>
        </div>
        <div className="col-md-5 text-md-end">
          <div
            className="nobel rounded shadow-sm w-100 ms-auto"
            style={{ height: "300px" ,alignContent:"center" }}
          >
          <img src="assets/images/nobel.png" style={{ width:"100%"}}/>
        </div>
        </div>
      </div>
    </div>
  </section>

          
        < Footer />
  </>
 );
};
        
export default About_Our_partner;
        