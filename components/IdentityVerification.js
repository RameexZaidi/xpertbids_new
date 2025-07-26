import React, { useState } from "react";
import IndividualVerificationForm from "./IndividualVerificationForm";
import CorporateVerificationForm  from "./CorporateVerificationForm";


const Identity = () => {
  const [tab, setTab] = useState("individual");

  const tabs = [
    { key: "individual", label: "Individual" },
    { key: "corporate",  label: "Corporate"  },

  ];

  const renderForm = () => {
    switch (tab) {
      case "corporate":  return <CorporateVerificationForm />;

      default:           return <IndividualVerificationForm />;
    }
  };

  return (
    <div className="container mt-5 profile">
      <ul className="nav nav-tabs mb-4">
        {tabs.map(t => (
          <li key={t.key} className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === t.key ? "active-tabs " : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
      {renderForm()}
    </div>
  );
};

export default Identity;
