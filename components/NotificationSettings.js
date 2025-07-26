import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import SuccessPopup from "@/components/SuccessPopup"; // adjust the path as needed
import ErrorPopup from "@/components/ErrorPopup"; // adjust the path as needed

const NotificationSettings = () => {
  const { data: session } = useSession();

  // Notification preferences state
  const [preferences, setPreferences] = useState({
    inspiration: false,
    newsletter: false,
    biddingConditions: {
      outbid: false,
      republished: false,
      oneDayReminder: false,
      oneHourReminder: false,
      fifteenMinutesReminder: false,
    },
  });

  const [loading, setLoading] = useState(false);
  // We will no longer display inline message; we'll use popup below.
  // const [message, setMessage] = useState("");

  // Validation or other errors coming from the backend
  const [errors, setErrors] = useState({});

  // Popup states for success and error
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");

  // Fetch notification settings when component mounts
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await axios.get(
          "https://admin.xpertbid.com/api/user/notifications",
          {
            headers: { Authorization: `Bearer ${session.user.token}` },
          }
        );
        // Set preferences with biddingConditions defaulting if not present.
        setPreferences({
          ...response.data,
          
          //inspiration: response.data.inspiration || false,
          //newsletter: response.data.newsletter || false,
          biddingConditions: {
            outbid: response.data.outbid || false,
            republished: response.data.republished || false,
            oneDayReminder: response.data.oneDayReminder || false,
            oneHourReminder: response.data.oneHourReminder || false,
            fifteenMinutesReminder: response.data.fifteenMinutesReminder || false,
          },
        });
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        setErrorPopupMessage("Could not fetch notification settings.");
        setErrorPopupSubMessage("");
        setShowErrorPopup(true);
      }
    };

    if (session && session.user) {
      fetchNotificationSettings();
    }
  }, [session]);

  const handleCheckboxChange = (e, key, parentKey = null) => {
    const { checked } = e.target;
    setPreferences((prev) => {
      if (parentKey) {
        return {
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [key]: checked,
          },
        };
      }
      return {
        ...prev,
        [key]: checked,
      };
    });
  };

  const saveNotificationSettings = async () => {
    // Clear previous errors and popups
    setErrors({});
    setShowSuccessPopup(false);
    setShowErrorPopup(false);

    try {
      setLoading(true);
      await axios.post(
        "https://admin.xpertbid.com/api/user/notifications",
        preferences,
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      // On successful update, trigger the success popup.
      setSuccessPopupMessage("Notification settings saved successfully!");
      setSuccessPopupSubMessage("Your notification preferences have been updated.");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      // If validation errors are returned.
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors, errors);
        const combinedErrors = Object.values(error.response.data.errors)
          .flat()
          .join(" ");
        setErrorPopupMessage(combinedErrors);
        setErrorPopupSubMessage("");
      } else {
        setErrorPopupMessage(
          error.response?.data?.message || "Failed to save notification settings."
        );
        setErrorPopupSubMessage("");
      }
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile" id="notification-settings">
      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          message={successPopupMessage}
          subMessage={successPopupSubMessage}
        />
      )}
      {/* Error Popup */}
      {showErrorPopup && (
        <ErrorPopup
          isOpen={showErrorPopup}
          onClose={() => setShowErrorPopup(false)}
          message={errorPopupMessage}
          subMessage={errorPopupSubMessage}
        />
      )}
      <div className="profile-heading-and-button">
        <h3>Notification Settings</h3>
        <button
          className="button-style-2"
          onClick={saveNotificationSettings}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Notification Settings"}
        </button>
      </div>
      <p className="mb-5">
        Manage your notification preferences to stay updated on auction wins, bids, and important updates. Customize how
        and when you would like to receive alerts.
      </p>
      <div className="notify-setting-inner-box">
  <h4>Newsletters</h4>
  <p className="mb-3">
    Inspiration in your inbox! You can always unsubscribe later if you change your mind.
  </p>

  <div className="nofify-form-1">
    <div className="col-12 notify-child">
      <input
        type="checkbox"
        name="inspiration"
        id="inspiration"
        checked={preferences.inspiration}
        onChange={(e) => handleCheckboxChange(e, "inspiration")}
      />
      <div className="label-and-info">
        <label htmlFor="inspiration" className="font-weight-bold">Inspiration</label>
        <p>Inspiration in your inbox! You can always unsubscribe later if you change your mind.</p>
      </div>
    </div>

    <div className="col-12 notify-child">
      <input
        type="checkbox"
        name="newsletter"
        id="newsletter"
        checked={preferences.newsletter}
        onChange={(e) => handleCheckboxChange(e, "newsletter")}
      />
      <div className="label-and-info">
        <label htmlFor="newsletter" className="font-weight-bold">Other newsletters</label>
        <p>Sometimes we may send newsletters with other interesting and relevant information.</p>
      </div>
    </div>
  </div>
</div>

      <div className="notify-setting-inner-box">
        <h4>Bidding</h4>
        <div className="nofify-form-1">
          {Object.entries(preferences.biddingConditions || {}).map(
            ([key, value], index) => (
              <div className="col-12 notify-child" key={index}>
                <input
                  type="checkbox"
                  name={key}
                  id={key}
                  checked={value}
                  onChange={(e) =>
                    handleCheckboxChange(e, key, "biddingConditions")
                  }
                />
                <div className="label-and-info">
                  <label htmlFor={key}>
                    {key === "outbid" && "Let me know when I am outbid"}
                    {key === "republished" &&
                      "Let me know when items are republished"}
                    {key === "oneDayReminder" &&
                      "Remind me 1 day before bidding closes"}
                    {key === "oneHourReminder" &&
                      "Remind me 1 hour before bidding closes"}
                    {key === "fifteenMinutesReminder" &&
                      "Remind me 15 minutes before bidding closes"}
                  </label>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
