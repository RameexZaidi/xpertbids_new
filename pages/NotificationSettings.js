import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Header from "../components/Header";
import DeletePopup from "@/components/DeletePopup"; // Make sure this path is correct
import ErrorPopup from "@/components/ErrorPopup";   // Make sure this path is correct

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("most-recent");
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // Popup states for deletion and error
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePopupMessage, setDeletePopupMessage] = useState("");
  const [deletePopupSubMessage, setDeletePopupSubMessage] = useState("");

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("https://admin.xpertbid.com/api/notifications", {
          headers: { Authorization: `Bearer ${session.user.token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Delete notification without native confirmation
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`https://admin.xpertbid.com/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });

      // Remove the deleted notification from the state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );

      // Trigger the DeletePopup
      setDeletePopupMessage("Notification deleted successfully!");
      setDeletePopupSubMessage("");
      setShowDeletePopup(true);
    } catch (error) {
      console.error("Error deleting notification:", error);
      setErrorPopupMessage("Error! Failed to delete the notification.");
      setErrorPopupSubMessage("");
      setShowErrorPopup(true);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read_at;
    if (filter === "earlier")
      return new Date(notification.created_at) < new Date("2022-01-01");
    return true; // Default is "most-recent"
  });

  return (
    <>
      <Header />
      {/* Delete Popup */}
      {showDeletePopup && (
        <DeletePopup
          isOpen={showDeletePopup}
          onClose={() => setShowDeletePopup(false)}
          message={deletePopupMessage}
          subMessage={deletePopupSubMessage}
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
      <section className="allNotifications">
        <div className="container-fluid">
          <div className="listing-main-heading">
            <h2>Notifications</h2>
            <select
              name="notificationFilter"
              id="notificationFilter"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="most-recent">Most Recent</option>
              <option value="earlier">Earlier</option>
              <option value="unread">Unread</option>
            </select>
          </div>

          {loading && <p>Loading notifications...</p>}

          {!loading &&
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`allNotificationPopup col-12 ${
                  notification.read_at ? "allNotificationPopupReaded" : ""
                }`}
              >
                <div className="allNotifyContent">
                  <div className="notifyContent">
                    <div className="notifyPopImage">
                      <img
                        src={notification.image_url || "./assets/images/message-text.svg"}
                        alt="Notification Icon"
                      />
                    </div>
                    <div className="notifyMsg">
                      <p className="notimsg">
                        {notification.title || "Notification Title"}
                      </p>
                      <p className="noti-time">
                        <span className="noti-date">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>,{" "}
                        <span className="time">
                          {new Date(notification.created_at).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div
                    className="notify-remove"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default Notifications;
