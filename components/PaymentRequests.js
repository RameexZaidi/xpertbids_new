import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const PaymentRequests = () => {
  const { data: session } = useSession();
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session) return; // Ensure user is authenticated

    const fetchPaymentRequests = async () => {
      try {
        const response = await axios.get("https://admin.xpertbid.com/api/payment-requests", {
          headers: {
            Authorization: `Bearer ${session.user.token}`, // Use token for authentication
          },
        });
        setPaymentRequests(response.data);
      } catch{
        setError("Failed to fetch payment requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentRequests();
  }, [session]);

  if (loading) return <p>Loading payment requests...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="payment-requests-container">
      
      
      <table className="payment-requests-table table table-striped">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paymentRequests.length > 0 ? (
            paymentRequests.map((request) => (
              <tr key={request.id}>
                <td>${request.amount}</td>
                <td>{request.payment_method?.paymentMethod || "N/A"}</td>
                <td className={`status-${request.status}`}>{request.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No payment requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
   
  );
};

export default PaymentRequests;
