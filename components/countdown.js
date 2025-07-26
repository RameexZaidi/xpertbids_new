import React, { useState, useEffect } from "react";

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end - now; // milliseconds remaining

      if (diff <= 0) {
        // Auction khatam ya date pass
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        setIsActive(false);
        return;
      }

      setIsActive(true);

      // Millisecond constants
      const msInMin  = 1000 * 60;
      const msInHour = msInMin * 60;
      const msInDay  = msInHour * 24;

      // Din nikaalo
      const days = Math.floor(diff / msInDay);
      const remAfterDays = diff % msInDay;

      // Ghante nikaalo
      const hours = Math.floor(remAfterDays / msInHour);
      const remAfterHours = remAfterDays % msInHour;

      // Minutes nikaalo
      const minutes = Math.floor(remAfterHours / msInMin);

      setTimeLeft({ days, hours, minutes });
    };

    // Initial aur phir har second update
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="counter">
      {isActive ? (
        <>
          <span className="day">{timeLeft.days}d </span>
          <span className="hour">{timeLeft.hours}h </span>
          <span className="minute">{timeLeft.minutes}m</span>
        </>
      ) : (
        <span>Countdown not started or has ended</span>
      )}
    </div>
  );
};

export default CountdownTimer;
