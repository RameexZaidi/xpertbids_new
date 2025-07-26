import { useState , useEffect } from "react";
import TransactionHistory from "../components/transcations";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WalletBalance from "../components/walletDisplay";
import MultiStepModal from "../components/MultiStepModal"; // Import MultiStepModal
import AddMoneyModal from "../components/payment_method"; // Import AddMoneyModal
// import { useSession } from "next-auth/react";
import PopupSequence from "../components/PopupSequence"; // Import Popup Component
import AddPaymentMethodModal from "../components/AddPaymentMethodModal"; // Import Modal

const WalletPage = () => {
  // const { data: session } = useSession();
  const [isMultiStepModalOpen, setIsMultiStepModalOpen] = useState(false); // State for MultiStepModal
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false); // State for AddMoneyModal
  const [showPopup, setShowPopup] = useState(false);
  //const [isModalOpen, setIsModalOpen] = useState(false);

    const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false); // Modal State
  
    const openPaymentMethodModal = () => {
      setIsPaymentMethodModalOpen(true); // Open Modal
    };
  
    const closePaymentMethodModal = () => {
      setIsPaymentMethodModalOpen(false); // Close Modal
    };
  useEffect(() => {
    // Check if user has seen popups before
    const popupShown = localStorage.getItem("hasSeenPopups");

    if (!popupShown) {
      setShowPopup(true); // Show popups if not seen before
    }
  }, []);
  

 
  const handlePopupClose = () => {
    setShowPopup(false);
    localStorage.setItem("hasSeenPopups", "true"); // Mark as shown in localStorage
  };

  const openMultiStepModal = () => {
    setIsAddMoneyModalOpen(false); // Ensure AddMoneyModal is closed
    setIsMultiStepModalOpen(true); // Open MultiStepModal
  };

  const openAddMoneyModal = () => {
    setIsMultiStepModalOpen(false); // Ensure MultiStepModal is closed
    setIsAddMoneyModalOpen(true); // Open AddMoneyModal
  };

  const closeMultiStepModal = () => setIsMultiStepModalOpen(false); // Close MultiStepModal
  const closeAddMoneyModal = () => setIsAddMoneyModalOpen(false); // Close AddMoneyModal

  return (
    <>
      <Header />

      {showPopup && <PopupSequence onComplete={handlePopupClose} />} {/* Show Popup Only Once */}

      <section className="data-wallet">
        <div className="container-fluid">
          <h1 className="main-heading">My Wallet</h1>

          <div className="balance-inquery-and-payment">
            <div className="row">
              <div className="col-lg-6 col-md-4">
                <div className="available-balance">
                  <p>Available balance</p>
                  <div className="balance">
                    <i className="fa-solid fa-dollar-sign"></i>
                    <span className="balance-number">
                      <WalletBalance />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-8">
                <div className="payment-methods-btns">
                <button 
                    className="payment-methods" 
                    id="openPaymentMethod"
                    onClick={openPaymentMethodModal} // Open Modal on Click
                  >
                    Payment Methods
                  </button>
                  <button className="button-style-3" onClick={openAddMoneyModal}>
                    Add Money
                  </button>
                  <button className="button-style-2" onClick={openMultiStepModal}>
                    Get Paid
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="transections-save-cards">
            <div className="row">
              <div className="col-md-12">
                {/* <div className="transections">
                  <h3 className="heading">Recent Transactions</h3>
                </div> */}

                <div className="table-parent">
                  <TransactionHistory />
                </div>
              </div>
             
            </div>
          </div>

        </div>
      </section>

      <Footer />
       {/* Add Payment Method Modal */}
       <AddPaymentMethodModal 
        isOpen={isPaymentMethodModalOpen} 
        onClose={closePaymentMethodModal} />

      {/* AddMoneyModal */}
      <AddMoneyModal isOpen={isAddMoneyModalOpen} onClose={closeAddMoneyModal} />

      {/* MultiStepModal */}
      <MultiStepModal isOpen={isMultiStepModalOpen} onClose={closeMultiStepModal} />
    </>
  );
};

export default WalletPage;
