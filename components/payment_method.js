// Next.js Component for Add Money Modal
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import StripePayment from '../components/StripePayment';
import PayPalPayment from '../components/paypal';
const AddMoneyModal = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [selectedMethod, setSelectedMethod] = useState("");
  const userToken = session?.user?.token;

const closeHandler = () => {
    onClose();
  };


  return (
    
    isOpen && (

                <div id="paymentMethodChoose" className="payment-method-choose-parent" style={{ display: isOpen ? 'block' : 'none' }}>
                    <div className="payment-method-choose">
                        <button className="close-payment-method-choose"
                            id="closePaymentMethodChoose" onClick={closeHandler}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <div className="close-payment-method-choose">
                            <h3>Add Money To Wallet</h3>
                        </div>
                        {/* <div className="get-paid-price">
                            <i className="fa-solid fa-dollar-sign"></i>
                            <input className="form-control" value={amount}
                            onChange={(e) =>
                            setAmount(e.target.value)
                            }></input>
                        </div> */}
                        <p className="get-paid-note">Minimum amount you can add
                            is $50.</p>
                        
                            <div className="row">
                                <div className="col-12 form-child">
                                  <div className="position-relative w-auto">
                             <select
                                 id="payment-method"
                                 className="no-arrow pop-input"
                                 value={selectedMethod}
                                 onChange={(e) => setSelectedMethod(e.target.value)}>
                                  <option>Select</option>

                                 <option value="stripe">Stripe</option>
                                 {/* <option value="paypal">PayPal</option> */}
                             </select>
 <div className="select-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.08188 8.94986L10.6019 15.4699C11.3719 16.2399 12.6319 16.2399 13.4019 15.4699L19.9219 8.94986"
        stroke="#606060"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
</div>
                                </div>
                            </div>
                        
                        
                    
                
        
          {selectedMethod === "stripe" && (
            
                <StripePayment token={userToken} user={session.user.id}/>
          )}

          {selectedMethod === "paypal" && (
                
                
                <PayPalPayment token={userToken}/>
                
          )}

          {/* <button className="submit-button" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </button> */}
          </div>
          </div>
      
    )
    
  );
};

export default AddMoneyModal;
