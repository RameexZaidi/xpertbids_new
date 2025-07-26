// components/CountrySelect.jsx
import React from "react";

export default function CountrySelect({
  profile,
  handleInputChange,
  errors,
  countries,
}) {
  const handleCountryChange = (e) => {
    // 1) country_id set karen
    handleInputChange(e);

    // 2) jis country ka ID select hua, uska name bhi set karen
    const selected = countries.find(
      (c) => c.id.toString() === e.target.value
    );
    if (selected) {
      handleInputChange({
        target: { name: "country_name", value: selected.name },
      });
    }
  };

  // find karen jo country abhi selected hai, taa ke uska flag dikhayen
  const selectedCountry = countries.find(
    (c) => c.id === Number(profile.country_id)
  );

  return (
    <div className="col-md-6 form-child position-relative">
      <label>Country*</label>
      <select
        name="country_id"
        value={profile.country_id}
        onChange={handleCountryChange}
        className="form-control"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* flag icon */}
      {selectedCountry && (
        <img
          src={`https://countryflagsapi.com/svg/${selectedCountry.iso2.toLowerCase()}`}
          alt={`${selectedCountry.name} flag`}
          className="input-icon-wrapper"
        />
      )}

      {errors?.country_id && (
        <small className="text-danger">{errors.country_id[0]}</small>
      )}
    </div>
  );
}
