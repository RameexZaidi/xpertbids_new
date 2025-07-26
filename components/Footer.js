import Link from "next/link";
//import { encodeURIComponent } from 'next/dist/shared/lib/router/utils/encode-uri';
import { Oval } from "react-loader-spinner";
import axios from 'axios';
import { useState, useEffect } from "react";

// components/Footer.js
export default function Footer() {
    const [cats, setCats]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

  useEffect(() => {
    axios
      .get("https://admin.xpertbid.com/api/get-category")
      .then(res => setCats(res.data.categories || []))
      .catch(err => {
        console.error(err);
        setError("Could not load categories.");
      })
      .finally(() => setLoading(false));
  }, []);
    const half = Math.ceil(cats.length / 2);

    return (
      <footer className="footer">
        <div className="container-fluid">
          <div id="qlwapp" className="qlwapp qlwapp-free qlwapp-button qlwapp-bottom-left qlwapp-all qlwapp-rounded qlwapp-js-ready desktop" bis_skin_checked="1">
	<div className="qlwapp-container" bis_skin_checked="1">
		
		<a className="qlwapp-toggle" data-action="open" data-phone="971567603938" data-message="Hi XpertBid team!
I’m interested in participating in your upcoming  auctions. Which events do you have coming up, and what categories of items will be featured? Looking forward to your recommendations!" role="button" tabIndex="0" target="_blank" href="https://wa.me/971567603938?text=Hi%20XpertBid%20team!%20I’m%20interested%20in%20participating%20in%20your%20upcoming%20auctions.%20Which%20events%20do%20you%20have%20coming%20up%20and%20what%20categories%20of%20items%20will%20be%20featured?" bis_skin_checked="1">
							<span className="fa-brands fa-whatsapp gameon"></span>
					</a>
	</div>
</div>          <div className="row ">
            <div className="col-xl-3  col-sm-6 footer-child1">
              <div className="logo">
                <Link href="/">
                  <img src="/assets/images/footer-logo.png " alt="" 
                  />
                </Link>
              </div>
              <p>First ever UAE  based auction platform, providing you a one stop shop, auction marketplace/ Platform. From RealEstate, Vehicles, bulk goods and much more, XpertBid powers auctions that deliver value, security, and results one auction at a time.
</p>              <div className="social-icons my-3">
                <Link href="https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq"   target="_blank"
            rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></Link>
                <Link
            href="https://www.linkedin.com/company/xpertbid/"
            target="_blank"
            rel="noopener noreferrer"
            >
            <i className="fa-brands fa-linkedin"></i>
            </Link>   
               <Link href="https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook"></i></Link>
                <Link href="#"><i className="fa-brands fa-x-twitter"></i></Link>
              </div>
            </div>
            <div className="col-xl-3   col-sm-6 footer-child3">
              <div className="footer-menu ps-0 ps-sm-4">
                <p className="foot-menu-heading mt-4"> Get To Know Us</p>
                <ul>
                    <li><Link href="./about_us">About Us</Link></li>
                    <li><Link href="./Privacy_Policy">Privacy Policy</Link></li>
                    <li><Link href="./Terms_Conditions">Terms & Conditions</Link></li>
                    <li><Link href="./contact"> Contact Us</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3   col-sm-6 footer-child2">
              <div className="footer-menu">
                <p className="foot-menu-heading mt-3">Categories</p>
                 {loading && (
                <div className="d-flex justify-content-center">
                  <Oval height={30} width={30} ariaLabel="Loading categories" />
                </div>
              )}
              {error && <p className="text-danger">{error}</p>}

              {!loading && !error && (
                <ul className="ps-0">
                  {cats.slice(0, half).map(cat => (
                    <li key={cat.slug}>
                      <Link
                        href={{
                          pathname: "/marketplace",
                          query: { category: cat.slug },
                        }}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Column 2: Second half of categories */}
          <div className="col-xl-3 col-sm-6 footer-child3 mt-0 mt-sm-5">
            <div className="footer-menu ps-0 ps-sm-4">
              
              {loading && (
                <div className="d-flex justify-content-center">
                  <Oval height={30} width={30} ariaLabel="Loading categories" />
                </div>
              )}
              {error && <p className="text-danger">{error}</p>}

              {!loading && !error && (
                <ul className="ps-0">
                  {cats.slice(half).map(cat => (
                    <li key={cat.slug}>
                      <Link
                        href={{
                          pathname: "/marketplace",
                          query: { category: cat.slug },
                        }}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          </div>
        </div>
      </footer>
      
    );
    
  }
  