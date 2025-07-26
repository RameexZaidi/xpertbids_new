// pages/verification.js

import React, { useState } from "react";
import IndividualVerificationForm from "@/components/IndividualVerificationForm";
import CorporateVerificationForm from "@/components/CorporateVerificationForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function VerificationPage() {
  const [tab, setTab] = useState("individual");

  const tabs = [
    { key: "individual", label: "Individual" },
    { key: "corporate",  label: "Corporate"  },
  ];

  const renderForm = () => {
    switch (tab) {
      case "corporate":
        return <CorporateVerificationForm />;
      default:
        return <IndividualVerificationForm />;
    }
  };

  return (
         <>
             <Header />
    <div className="container mt-5 profile">
      <ul className="nav nav-tabs mb-4">
        {tabs.map((t) => (
          <li key={t.key} className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === t.key ? "active-tabs" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {renderForm()}
    </div>
      <Footer />
        </>
  );
}
