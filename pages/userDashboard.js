import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardRecord from "../components/DashboardRecord";
import ListingCard from "../components/ListingCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import StepModals from "../components/StepModals";
import Link from "next/link";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    listings: 0,
    biddings: 0,
    wallet: 0,
  });

  // Check if user logged in for the first time
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (!localStorage.getItem("hasLoggedIn")) {
        console.log("First-time login detected!", isFirstLogin);
        setIsFirstLogin(true);
        localStorage.setItem("hasLoggedIn", "true");
      }
    } else {
      console.log(status, "working");
    }
  }, [status, session]);

  // Fetch dashboard data
  useEffect(() => {
    if (!session?.user?.token) {
      return; // No token, so don't call API
    }
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "https://admin.xpertbid.com/api/dashboard",
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        console.log("Dashboard API response:", response.data);
        
        const auctionArray = Array.isArray(response.data.auction)
          ? response.data.auction
          : [];
        const bidsCount =
          typeof response.data.bid === "number" ? response.data.bid : 0;
        
        // Handle wallet as number, string, or object with a balance property
        let walletAmount = 0;
        if (typeof response.data.wallet === "number") {
          walletAmount = response.data.wallet;
        } else if (typeof response.data.wallet === "string") {
          walletAmount = Number(response.data.wallet);
        } else if (
          typeof response.data.wallet === "object" &&
          response.data.wallet !== null &&
          response.data.wallet.balance !== undefined
        ) {
          walletAmount = Number(response.data.wallet.balance) || 0;
        }
        
        setDashboardData({
          listings: auctionArray.length,
          biddings: bidsCount,
          wallet: walletAmount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [session]);

  const [listings, setListings] = useState([]);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!session) {
        return; // Wait for session to initialize
      }
      try {
        const response = await axios.get(
          "https://admin.xpertbid.com/api/listings",
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        setListings(response.data.auction || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [session]);

  return (
    <>
      <Header />
      <StepModals />
      <section className="dashboard-records">
        <div className="container-fluid">
          <div className="row">
<h1 class="mkt-sec my-4">Dashboard</h1>

            <div className="col-md-4">
              <DashboardRecord
                image="./assets/images/dashboard-listing.svg"
                score={dashboardData.listings}
                title="Listings"
              />
            </div>
            <div className="col-md-4">
              <DashboardRecord
                image="./assets/images/dashboard-bidding.svg"
                score={dashboardData.biddings}
                title="Biddings"
              />
            </div>
            <div className="col-md-4">
              <DashboardRecord
                image="./assets/images/dashboard-wallet.svg"
                score={
                  <>
                    <i className="fa-solid fa-dollar-sign"></i>
                    {dashboardData.wallet}
                  </>
                }
                title="Wallet"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="container listing-main-heading">
        <h2>My Listings</h2>
        <Link className="button-style-3" href="/MyListings">
          See all
        </Link>
      </div>
      <section className="listing">
        <div className="container dashboard-listing">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <p>No listings available.</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Dashboard;
