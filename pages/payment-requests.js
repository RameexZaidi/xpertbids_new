import React from "react";
import PaymentRequests from "../components/PaymentRequests";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const PaymentRequestsPage = () => {
  return (
   <>
         <Header />
    
    <div className="container py-5">
    <div className="invoices-main-heading">
      <h2 className="">My Payment Requests</h2>
      </div>
      <div className="invoices-table">
      <PaymentRequests />
    </div>
    </div>
   
   
    < Footer/>
    </>
  );
 
};


export default PaymentRequestsPage;
