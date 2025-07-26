import React, { useState, useEffect } from "react";
import TabNavigation from "../components/TabNavigation";
import AuctionCard from "../components/AuctionCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { Oval } from "react-loader-spinner"; // Import the loader

const BiddingTabs = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const { data: session } = useSession();
  
const tabs = [
  { id: "active", label: "Active Bids", imageSrc: "/assets/images/active_bids.png" },
  { id: "won", label: "Won Auctions", imageSrc: "/assets/images/won_bids.png" },
  { id: "lost", label: "Lost Auctions", imageSrc: "/assets/images/lost_bids.png" },
];


  useEffect(() => {
    const fetchAuctions = async () => {
      if (!session?.user?.token) return;

      setLoading(true); // Show loader
      try {
        const response = await fetch(
          `https://admin.xpertbid.com/api/auctions?status=${activeTab}`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        const data = await response.json();
        setAuctions(data.auctions || []);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchAuctions();
  }, [activeTab, session]);

  return (
    <>
       <Header />
    <section className="biddings-tabs">
      <div className="container-fluid">
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="tab-content">
          {tabs.map((tab) => (
            <div
              className={`tab-pane fade ${activeTab === tab.id ? "show active" : ""}`}
              id={tab.id}
              role="tabpanel"
              key={tab.id}
            >
           
                <div className="row makt-parent">
                  {loading ? (
                    <div className="loader-container d-flex justify-content-center align-items-center" style={{ minHeight: '250px' }}>
                      <Oval
                        height={80}
                        width={80}
                        color="#3498db"
                        secondaryColor="#3498db"
                        ariaLabel="oval-loading"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                      />
                    </div>
                  ) : auctions.length > 0 ? (
                    auctions.map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))
                  ) : (
                    <div className="bid-main-heading">
                      {tab.imageSrc && (
                        <img src={tab.imageSrc} alt={tab.id} className="tab-image" />
                      )}
                      <p className="text-center text-muted">
                        {activeTab === "active" && "You have no active bids yet."}
                        {activeTab === "won" && "You haven't won any auctions yet."}
                        {activeTab === "lost" && "You haven't lost any auctions yet."}
                      </p>
                    </div>
                  )}
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default BiddingTabs;
