import React, { useState, useEffect } from "react";

const DateOfBirthSelector = ({ dob, setDob, errors }) => {
  const currentYear = new Date().getFullYear();
  // Years from 1900 to current
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // compute number of days in selected month/year
  const daysInMonth = year && month
    ? new Date(year, month, 0).getDate()
    : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // whenever any select changes, update dob
  useEffect(() => {
    if (year && month && day) {
      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      setDob(`${year}-${mm}-${dd}`);
    }
  }, [year, month, day]);

  return (
    <div>
      <div className="d-flex gap-2 mb-2">
        <select
          className="form-select"
          value={year}
          onChange={e => {
            setYear(e.target.value);
            setMonth("");
            setDay("");
            setDob("");
          }}
        >
          <option value="">Year</option>
          {years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={month}
          onChange={e => {
            setMonth(e.target.value);
            setDay("");
            setDob("");
          }}
          disabled={!year}
        >
          <option value="">Month</option>
          {months.map(m => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={day}
          onChange={e => setDay(e.target.value)}
          disabled={!month}
        >
          <option value="">Day</option>
          {days.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* display selected dob */}
      <input
        type="text"
        readOnly
        className="form-control mb-1"
        placeholder="YYYY-MM-DD"
        value={dob}
        required
      />

      {errors?.dob && (
        <div className="text-danger">{errors.dob}</div>
      )}
    </div>
  );
};

export default DateOfBirthSelector;
