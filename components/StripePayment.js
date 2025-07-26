import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import SuccessPopup from "./SuccessPopup"; // Adjust this import path as needed
import ErrorPopup from "./ErrorPopup"; // Adjust this import path as needed

const stripePromise = loadStripe('pk_test_fKZAzAVqh3g3fg7ruTOEFwE600oylgtoVu');

const CheckoutForm = ({ token }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Use separate states for error message and its popup flag
  const [errorMsg, setErrorMsg] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe or elements not loaded');
      return;
    }

    try {
      setLoading(true);
      // Clear any previous error
      setErrorMsg('');
      setShowErrorPopup(false);
      console.log('Sending request to create payment intent');

      // Call Laravel API to create a payment intent
      const { data } = await axios.post(
        'https://admin.xpertbid.com/api/stripe-payment',
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      console.log('Payment intent created:', data);

      // Confirm payment with Stripe
      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        console.log('Payment confirmation error:', error);
        setErrorMsg(error.message);
        setShowErrorPopup(true);
      } else {
        console.log('Payment successful. Showing SuccessPopup.');
        setShowSuccessPopup(true);
      }
    } catch (err) {
      console.log('Error in payment process:', err);
      let errMsg = '';

      if (err.response && err.response.data) {
        if (err.response.data.message) {
          errMsg = err.response.data.message;
        } else if (err.response.data.error) {
          errMsg = err.response.data.error;
        } else {
          errMsg = JSON.stringify(err.response.data);
        }
      } else {
        errMsg = err.message;
      }
      setErrorMsg(errMsg);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          className="form-control mb-3 paypalinput pop-input my-4"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <CardElement />
        </div>
        <button
          type="submit"
          className="submit-button btn btn-paypal bg-dark text-light px-5 text-center mt-4 py-2 w-100"
          style={{ fontSize: '25px' }}
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
      {showSuccessPopup && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          message="Payment successful!"
          subMessage="Your payment has been recorded!"
          onClose={() => {
            setShowSuccessPopup(false);
            window.location.reload();
          }}
        />
      )}
      {showErrorPopup && (
        <ErrorPopup
          isOpen={showErrorPopup}
          message={errorMsg}
          subMessage=""
          onClose={() => {
            setShowErrorPopup(false);
            setErrorMsg('');
          }}
        />
      )}
    </>
  );
};

const StripePayment = (token) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm token={token} />
    </Elements>
  );
};

export default StripePayment;
