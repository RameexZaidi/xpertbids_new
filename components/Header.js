// components/Header.js
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect , useRef  } from 'react';
import LoginModal from './LoginModal';
import SeoHeader from './SeoHeader';
import SignupModal from './SignupModal';
import { useRouter } from 'next/router'
import Link from 'next/link';
import axios from "axios";
import WalletBalance from '../components/walletDisplay';
import UserProfile from "../components/UserProfile";
import DesktopCategoriesDropdown from './DesktopCategoriesDropdown';
import Search from './Search'; 
import CategoriesDropdown from './CategoriesDropdown';
import NotificationDropdown from "./NotificationDropdown"; //  Import Dynamic Notifications

export default function Header() {






  
  // If any JS is needed (like openMobileMenu, closeMobileMenu),
  // ensure that is handled either here or via refs.
  // For now, we assume the JS from script.js handles it.
  const [activeModal, setActiveModal] = useState(null);
  const { data: session } = useSession();
  //const userProfileRef = useRef(null);
  const userProfileRefDesktop = useRef(null);
const userProfileRefMobile = useRef(null);
  // ← add this:
  // const [expandedCat, setExpandedCat] = useState(null);
  // const toggleExpand = (id) => {
  //   setExpandedCat(prev => (prev === id ? null : id));
  // };
  //const [isNotificationOpen, setNotificationOpen] = useState(false);
  // const [isNotificationOpen, setNotificationOpen] = useState(false);

const [isUserSettingsOpenDesktop, setUserSettingsOpenDesktop] = useState(false);
const [isUserSettingsOpenMobile, setUserSettingsOpenMobile] = useState(false);
  // const [isUserSettingsOpen, setUserSettingsOpen] = useState(false);//
  // const [cats, setCats] = useState([])

  const [isSearchOpen, setSearchOpen] = useState(false);
  const router = useRouter()
  // Handlers for toggling menus
  //const toggleNotificationPopup = () => setNotificationOpen(!isNotificationOpen);
  // const toggleNotificationPopup = () => setNotificationOpen(!isNotificationOpen);
  // const toggleUserSettingPopup = () => setUserSettingsOpen(!isUserSettingsOpen);s
  //const openMobileMenu = () => setMobileMenuOpen(true);
  //const closeMobileMenu = () => setMobileMenuOpen(false);
const toggleUserSettingPopupDesktop = () => {
  setUserSettingsOpenDesktop(prev => !prev);
};

const toggleUserSettingPopupMobile = () => {
  setUserSettingsOpenMobile(prev => !prev);
};
  const handleOpenModal = (modal) => {
    setActiveModal(modal); // Set "signup" or "signin"
  };
useEffect(() => {
  const handleClickOutside = (event) => {
    // Desktop Dropdown
    if (
      userProfileRefDesktop.current &&
      !userProfileRefDesktop.current.contains(event.target) &&
      !event.target.closest(".user-profile-setting-desktop")
    ) {
      setUserSettingsOpenDesktop(false);
    }

    // Mobile Dropdown
    if (
      userProfileRefMobile.current &&
      !userProfileRefMobile.current.contains(event.target) &&
      !event.target.closest(".user-profile-setting-mobile")
    ) {
      setUserSettingsOpenMobile(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);





  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "true") {
      setActiveModal("signin");
    }
  }, [session]);
  const handleCloseModal = () => {
    setActiveModal(null); // Close all modals
  };
  const handleLogin = (userData) => {
    setUser(userData); // Update user state on login
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data to localStorage
    handleCloseModal(); // Close modal after login
  };
  const handleLogout = async () => {
    try {
      
      if (session?.user?.token) {
        await axios.post(
          "https://admin.xpertbid.com/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`, //  Laravel token
              Accept: "application/json",
            },
          }
        );
      }
      // Clean up manually stored stuff
    localStorage.removeItem("nextauth.message");
    sessionStorage.clear();

    // Force cookie deletion (optional)
    document.cookie = "next-auth.session-token=; Max-Age=0; path=/;";

      // Then sign out of NextAuth
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error during logout:", error);
      await signOut({ callbackUrl: "/" }); // fallback to just NextAuth logout
    }
  };

  // const handleSearchChange = (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);

  //   if (query.length > 2) {
  //     debounceSearch(query);
  //   } else {
  //     setSearchResults([]);
  //   }
  // };

  // const debounceSearch = (() => {
  //   let timer;
  //   return (query) => {
  //     if (timer) clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       fetchSearchResults(query);
  //     }, 300);
  //   };
  // })();

  // const fetchSearchResults = async (query) => {
  //   setIsSearching(true);
  //   try {
  //     const response = await axios.get(`https://admin.xpertbid.com/api/search-auctions`, {
  //       params: { query },
  //     });
  //     setSearchResults(response.data.auctions);
  //   } catch (error) {
  //     console.error("Search error:", error);
  //   }
  //   setIsSearching(false);
  // };
  return (
    <>
    <SeoHeader />
     <Search
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
      />

    <header>
      <div className="header-inner">
        <div className="container-fluid">

          <nav className="navbar navbar-expand-xl" id="">

            <Link className="logo me-auto me-sm-4 mb-2" href={"/"}>
              <img src="/assets/images/header-logo.png" alt="" />
            </Link>
            {session ? (
              <>
       
             {/* Dynamic Notifications */}
             <div className='d-inline d-xl-none ms-sm-auto'  > 
                     <p className="sear-icon d-inline d-xl-none p-2 py-3  me-2 me-lg-none">
                      <button
          type="button"
          className="search-icon-btn"
          onClick={() => setSearchOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18.3332 18.3332L16.6665 16.6665" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
        </button> 
        </p>
                <NotificationDropdown />
                </div>
                {/* User Profile Settings */}
                <div className="user-profile-setting-container d-flex d-xl-none me-2">
                  <button className="user-profile-setting" onClick={toggleUserSettingPopupMobile}>
                  <UserProfile />
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>

                   {isUserSettingsOpenMobile && (

                    <div id="userProfileSettingPopup" className="user-profile-setting-popup" ref={userProfileRefMobile}>
                      <div className='user-profile-setting-content'>
                        <ul className="user-setting-menu">
                          <li>
                            <Link href={"/account"}>
                              <img src="/assets/images/profile-setting.svg" alt="Settings" />{" "}
                              Account Settings
                            </Link>
                          </li>
                          <li>
                            <Link href={"/wallet"}>
                              <img src="/assets/images/wallet.svg" alt="Wallet" /> My Wallet
                            </Link>
                          </li>
                          {/*<li>
                                   <Link href={"/transportation"}>
                                    <img src="/assets/images/order-box.svg" alt="Order Transportation" />{" "}
                                    Order Transportation
                                  </Link>
                                  </li>*/}
                          <li>
                            <Link href={"/favourites"}>
                              <img src="/assets/images/setting-heart.svg" alt="Favorites" /> My
                              Favorites
                            </Link>
                          </li>
                          <li>
                            <Link href={"/MyListings"}>
                              <img src="/assets/images/mainListing.svg" alt="Listings" /> My
                              Listings
                            </Link>
                          </li>
                          <li>
                            <Link href={"/mybid"}>
                              <img src="/assets/images/myBids.svg" alt="Bids" /> My Bids
                            </Link>
                          </li>
                          {/* <li>
                            <Link href={"/Invoices"}>
                              <img src="/assets/images/invoice.svg" alt="Invoices" /> Invoices
                            </Link>
                          </li> */}
                          <li>
                                <Link href={"/payment-requests"}>
                                <i className="fa-solid fa-money-check me-1"></i> Payment Request
                                </Link>
                              </li>
                          <li>
                            <li>
                          <Link href="/verification">
                            <i className="fa-solid fa-id-card me-1"></i> Verification
                          </Link>
                        </li>

                            <button className="transparent-button" onClick={() => handleLogout()} >
                              <img src="/assets/images/logout.svg" alt="Logout" /> Log Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : ("")}

            {!session ? (
              <>

                <div className="nav-item registration-btns d-flex d-xl-none ms-auto">
                  <button className="SignupButton signup me-2" onClick={() => handleOpenModal("signup")}>Sign Up</button>
                  <button className="loginButton login me-2" onClick={() => handleOpenModal("signin")}>Login</button>
                </div>
              </>
            ) : ("")}

            <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse menuBar" id="navbarSupportedContent">
              {/* replace existing inline search form with icon */}
            {/* <button
          type="button"
          className="search-icon-btn"
          onClick={() => setSearchOpen(true)}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button> */}

              {/* <form className="d-flex search-forms" role="search">
               
                {isSearching && <p className="searching-message">Searching...</p>}
                {searchResults.length > 0 && (
                  <ul className="search-result">
                    {searchResults.map((auction) => (
                      <li key={auction.id}>
                        <Link href={`/product/${auction.id}`}>{auction.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </form> */}


              {!session ? (
                <>
                    <ul className="navbar-nav"> <div
    className="search-trigger"
    onClick={() => setSearchOpen(true)}
    onFocus={() => setSearchOpen(true)}
    tabIndex={0}                  /* taake focus mil sake */
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18.3332 18.3332L16.6665 16.6665" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
    <input
      type="text"
      readOnly
      className="search-box"
      placeholder="Search auctions"
    />
  </div>
                    {/* <li className="nav-item">
                      <Link className="nav-link" href={"/categories"}>
                        Categories
                      </Link>

                    </li> */}
             {/* <li className="nav-item ">
                    <Link className={`nav-link ${router.pathname  === '/categories' ? 'active' : ''}`} href="/categories" role="button" >
                      Categories
                    </Link>

                  </li> */}
                   {/* <li className="nav-item"> <Link className="nav-link" href="/vehicle"> Vehicle </Link> </li>
                   <li className="nav-item"> <Link className="nav-link" href="/service"> Services </Link> </li>
                   <li className="nav-item"> <Link className="nav-link" href="/realestate"> Realestate </Link> </li> */}
             {/* Header Dropdown - Single Column */}
<div className="d-none d-xl-block">
     <DesktopCategoriesDropdown />
     </div>
     <div className="d-block d-xl-none">

     <CategoriesDropdown />
     </div>
       
   
                        <li className="nav-item">
        <Link
          href="about_us"
          className={`nav-link  ${
            router.pathname === '/about_us' ? 'active' : ''
          }`}
        >
          About
        </Link>
      </li>

                         <li className="nav-item">
        <Link
          href="/about-our-partner"
          className={`nav-link  ${
            router.pathname === '/about-our-partner' ? 'active' : ''
          }`}
        >
          Directory
        </Link>
      </li>

                               <li className="nav-item">
        <Link
          href="/contact"
          className={`nav-link ${
            router.pathname === '/contact' ? 'active' : ''
          }`}
        >
          Contact Us
        </Link>
      </li>
         

         
                    {/* <li className="nav-item dropdown  d-none d-xl-block">
                    <Link className="nav-link" href={"/about_us"} id="aboutUsDropdown">
                      About
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="aboutUsDropdown">
                      <li>
                        <Link className="dropdown-item" href={"/about-our-partner"}>
                          Directory
                        </Link>
                      </li>
                    </ul>
                  </li>
                    <li className="nav-item dropdown d-block d-xl-none">
                    <Link className="nav-link" href={"/about_us"} id="aboutUsDropdown">
                      About
                    </Link>
                    </li>

                      <li className="nav-item dropdown d-block d-xl-none">
                        <Link className="nav-link" href={"/about-our-partner"}>
                          Directory
                        </Link>
                      </li> */}




                  </ul>

                  <div className="nav-item registration-btns d-none d-xl-flex"> 
                    <button className="loginButton login me-4" onClick={() => handleOpenModal("signin")}>Login</button>
                    <button className="SignupButton signup me-2" onClick={() => handleOpenModal("signup")}>Sign Up</button>
                    <Link className=" sellnow mx-3 my-3 px-3" href="/sell " style={{ color:"#fff !important"}}>Sell Now</Link>
                  </div>
                </>

              ) : (
                // Show username and logout button if the user is logged in
          <>
                  {/* Notifications */}

                  <ul className="navbar-nav dashboard-nav"
                    id="navbarDesktop">
                    <li className="nav-item">
                      <Link className={`nav-link ${router.pathname === '/userDashboard' ? 'active' : ''}`} href="/userDashboard">Dashboard</Link>
                    </li>
<div className="d-none d-xl-block">
     <DesktopCategoriesDropdown />
     </div>
     <div className="d-block d-xl-none">

     <CategoriesDropdown />
     </div>
                   <li className="nav-item">
        <Link
          href="about_us"
          className={`nav-link   ${
            router.pathname === '/about_us' ? 'active' : ''
          }`}
        >
          About
        </Link>
      </li>
                   <li className="nav-item">
        <Link
          href="/about-our-partner"
          className={`nav-link  ${
            router.pathname === '/about-our-partner' ? 'active' : ''
          }`}
        >
          Directory
        </Link>
      </li>

                                     <li className="nav-item">
        <Link
          href="/contact"
          className={`nav-link  ${
            router.pathname === '/contact' ? 'active' : ''
          }`}
        >
          Contact Us
        </Link>
      </li>

            <li className="nav-item">
 
<Link href="/sell" className="d-xl-none text-white sellnow nav-sellnow   ">
                            Sell Now
                          </Link>

                          </li>

                    {/* <li className="nav-item">
                      <Link className="nav-link" href={"/categories"}>
                        Categories
                      </Link>
                      </li>

                           <li className="nav-item">
                            <Link className="nav-link" href="/vehicle">
                            Vehicle
                             </Link>
                             </li>

                             <li className="nav-item">
                              <Link className="nav-link" href="/service">
                              Services
                               </Link>
                               </li>
                               <li className="nav-item">
                           <Link className="nav-link" href="/realestate">
                           Realestate
                         </Link>
                     </li>

                    <li className="nav-item dropdown  d-none d-xl-block">
                    <Link className="nav-link" href={"/about_us"} id="aboutUsDropdown">
                      About
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="aboutUsDropdown">
                      <li>
                        <Link className="dropdown-item" href={"/about-our-partner"}>
                          Directory
                        </Link>
                      </li>
                    </ul>
                  </li>
                    <li className="nav-item dropdown d-block d-xl-none">
                    <Link className="nav-link" href={"/about_us"} id="aboutUsDropdown">
                      About
                    </Link>
                    </li>

                      <li className="nav-item dropdown d-block d-xl-none">
                        <Link className="nav-link" href={"/about-our-partner"}>
                          Directory
                        </Link>
                      </li>
 */}

                  </ul>
                  <div className="registration-btns-dashboard ms-auto dashboard-menu">
                    {/* User Balance */}
                    <p className="user-amount d-none d-xl-flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984" stroke="#23262F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 6V18" stroke="#23262F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#23262F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                      <Link className="amount" href={'/wallet'}><span ><WalletBalance/></span></Link>
                    </p>
                    <p className="sear-icon d-none d-xl-inline">
                      <button
          type="button"
          className="search-icon-btn"
          onClick={() => setSearchOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18.3332 18.3332L16.6665 16.6665" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
        </button> 
        </p>



                    {/* Notifications */}
                    <div className='d-none d-xl-flex'>
                    <NotificationDropdown />
                    </div>
                    {/* User Profile Settings */}
                    <div className="user-profile-setting-container d-none d-xl-inline">
                      <button className="user-profile-setting" onClick={toggleUserSettingPopupDesktop}>
                      <UserProfile />

                        <i className="fa-solid fa-chevron-down"></i>
                      </button>
  

                     {isUserSettingsOpenDesktop && (

                        <div id="userProfileSettingPopup" className="user-profile-setting-popup" ref={userProfileRefDesktop}>
                          <div className='user-profile-setting-content'>
                            <ul className="user-setting-menu">
                              <li>
                                <Link href={"/account"}>
                                  <img src="/assets/images/profile-setting.svg" alt="Settings" />{" "}
                                  Account Settings
                                </Link>
                              </li>
                              <li>
                                <Link href={"/wallet"}>
                                  <img src="/assets/images/wallet.svg" alt="Wallet" /> My Wallet
                                </Link>
                              </li>
                              {/*<li>
                                   <Link href={"/transportation"}>
                                    <img src="/assets/images/order-box.svg" alt="Order Transportation" />{" "}
                                    Order Transportation
                                  </Link>
                                  </li>*/}
                              <li>
                                <Link href={"/favourites"}>
                                  <img src="/assets/images/setting-heart.svg" alt="Favorites" /> My
                                  Favorites
                                </Link>
                              </li>
                              <li>
                                <Link href={"/MyListings"}>
                                  <img src="/assets/images/mainListing.svg" alt="Listings" /> My
                                  Listings
                                </Link>
                              </li>
                              <li>
                                <Link href={"/mybid"}>
                                  <img src="/assets/images/myBids.svg" alt="Bids" /> My Bids
                                </Link>
                              </li>
                              {/* <li>
                                <Link href={"/Invoices"}>
                                  <img src="/assets/images/invoice.svg" alt="Invoices" /> Invoices
                                </Link>
                              </li> */}
                              <li>
                                <Link href={"/payment-requests"}>
                                <i className="fa-solid fa-money-check me-1"></i> Payment Request
                                </Link>
                              </li>
                                 <li>
                          <Link href="/account?tab=identity_verification">
                            <i className="fa-solid fa-id-card me-1"></i> Verification
                          </Link>
                        </li>
                              <li>
                                <button className="transparent-button" onClick={() => handleLogout()} >
                                  <img src="/assets/images/logout.svg" alt="Logout" /> Log Out
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>



                    {/* Mobile Menu */}

                  </div>
<Link href="/sell" className="d-none d-xl-block sellnow nav-sellnow">
                            Sell Now
                          </Link>
                  {/* Sell Now Button */}

                  {/* <p>Welcome, {session.user.name}!</p>
                    <button onClick={() => handleLogout()}>Logout</button>*/}
                </>
              )
              }

            </div>


            <div id="mobile-menu">
              <div id="closeMobileMenu" className="closeMobileMenu">
                <i className="fa-solid fa-xmark" onClick={() => { /* closeMobileMenu() */ }}></i>
              </div>
              <ul className="mobile-buttons-web">
                <li className="mobile-child-menu">
                  <form className="d-flex search-forms" role="search">
                    <button className="search-btn" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                    <input className="search-box" type="search" placeholder="Search any auction listing here" aria-label="Search" />
                  </form>
                </li>
                <li className="mobile-child-menu"><Link href="/sell" className="mobile-sellnow">Sell Now</Link></li>
                <ul className="navbar-nav">
                 <li className="nav-item">
  <Link
    href="/categories"
                        className={`nav-link ${
                          router.pathname === '/categories' ? 'text-primary' : ''
                        }`}
    role="button"
  >
    Categories
  </Link>
</li>
                  <li className="nav-item ">
                    <Link className="{`nav-link ${
                          router.pathname === '/categories' ? 'text-primary' : ''
                        }`} " href="/marketplace.html" role="button ">
                      Marketplace
                    </Link>

                  </li>
                  {/* <li className="nav-item dropdown">
                    <Link className="nav-link" href={"/about_us"} >
                      About
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="aboutUsDropdown">
                      <li>
                        <Link className="dropdown-item" href={"/about-our-partner"}>
                          Directory
                        </Link>
                      </li>
                    </ul>
                  </li> */}
                </ul>
              </ul>
            </div>
          </nav>
        </div>
      </div>


      <SignupModal isOpen={activeModal === "signup"} onClose={handleCloseModal} onSignup={handleLogin} />
      <LoginModal isOpen={activeModal === "signin"} onClose={handleCloseModal} onLogin={handleLogin} />
    </header>
    </>
  )
}
