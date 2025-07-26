import React, { useState, useEffect ,useRef} from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
const NotificationDropdown = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
const notificationRef = useRef(null);
  // Fetch notifications when user logs in
  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target) &&
      !event.target.closest(".notification")
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [notificationRef, setIsOpen]); 
  // Fetch Notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "https://admin.xpertbid.com/api/notifications",
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  // Mark Single Notification as Read
  const markAsRead = async (id) => {
    try {
      await axios.post(
        `https://admin.xpertbid.com/api/notifications/read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark All Notifications as Read
  const markAllAsRead = async () => {
    try {
      await axios.post(
        "https://admin.xpertbid.com/api/notifications/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Delete Notification
  const deleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(
          `https://admin.xpertbid.com/api/notifications/${id}`,
          {
            headers: { Authorization: `Bearer ${session.user.token}` },
          }
        );
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  return (
    <>
  
    <div className="notification-container">

      <button className="notification nav-notification rounded me-2 me-lg-0" style={{border:"none"}} onClick={() => setIsOpen(!isOpen)}>
        <img src="/assets/images/notificationIcon.svg" alt="Notifications" />

        {/* Show Unread Notification Count */}
        {notifications.filter((n) => !n.read_at).length > 0 && (
          <span className="notif-badge">
            {notifications.filter((n) => !n.read_at).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-popup" ref={notificationRef}>
          <div className="notification-content">
            <h3>{notifications.length > 0 ? "Notifications" : "No new notifications"}</h3>
            {notifications.length > 0 && (
              <button className="markAsRead" onClick={markAllAsRead}>
                <img src="/assets/images/double-tick.svg" alt="Mark All" /> Mark all as read
              </button>
            )}
          </div>

          <div className="notification-body">
            {loading && <p>Loading notifications...</p>}
            {!loading &&
              notifications.map((notification) => (
                <div key={notification.id} className={`notification-popup-bar ${notification.read_at ? "read" : ""}`}>
                  <div className="notificationPopupMessage">
                    <div className="notification-popup-bar-img-1">
                      <img src={notification.image_url || "/assets/images/message-text.svg"} alt="Notification Icon" />
                    </div>
                    <div className="notify-message-and-time">
                      <p className="bid-notify-msg">{notification.title}</p>
                      <p className="bid-notify-time">
                        <span className="notify-date">{new Date(notification.created_at).toLocaleDateString()}</span>
                        , <span className="time">{new Date(notification.created_at).toLocaleTimeString()}</span>
                      </p>
                    </div>
                    <div className="notify-actions">
                      {/* Mark as Read Icon (✔) */}
                      {!notification.read_at && (
                        <button className="mark-as-read-btn" onClick={() => markAsRead(notification.id)}>
                          <i className="fa-solid fa-check"></i>
                        </button>
                      )}
                      {/* Delete Notification */}
                      <button className="delete-btn noti" onClick={() => deleteNotification(notification.id)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="notification-footer">
            <Link href={"/NotificationSettings"}>See All Notifications</Link>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default NotificationDropdown;
