import { useEffect, useState, useRef } from "react";
import api from "../api/axiosConfig";
import "./NotificationBell.css";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const dropdownRef = useRef(null);
  const prevUnreadRef = useRef(0);
  const toastTimerRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount(true); // initial load, don't toast on first check
    const interval = setInterval(() => fetchUnreadCount(false), 15000);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const fetchUnreadCount = async (isInitial) => {
    try {
      const res = await api.get("/notifications/unread-count");
      const newCount = res.data.count;

      if (!isInitial && newCount > prevUnreadRef.current) {
        fetchLatestNotificationForToast();
      }

      prevUnreadRef.current = newCount;
      setUnreadCount(newCount);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLatestNotificationForToast = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data && res.data.length > 0) {
        const latest = res.data[0]; // assumes newest first
        showToast(latest.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => setToast(null), 6000);
  };

  const closeToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDropdown = async () => {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen) {
      await fetchNotifications();
      try {
        await api.put("/notifications/mark-read");
        setUnreadCount(0);
        prevUnreadRef.current = 0;
      } catch (err) {
        console.error(err);
      }
    }
  };

  const timeAgo = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!user) return null;

  return (
    <>
      <div className="notif-bell-wrapper" ref={dropdownRef}>
        <button className="notif-bell-btn" onClick={toggleDropdown}>
          🔔
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </button>

        {open && (
          <div className="notif-dropdown">
            <div className="notif-dropdown-header">Notifications</div>
            {notifications.length === 0 ? (
              <div className="notif-empty">No notifications yet 📭</div>
            ) : (
              <div className="notif-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.isRead ? "notif-unread" : ""}`}
                  >
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-time">{timeAgo(n.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="notif-toast">
          <div className="notif-toast-body">
            <span className="notif-toast-sender">Telangana Special</span>
            <span className="notif-toast-text">{toast}</span>
          </div>
          <button className="notif-toast-close" onClick={closeToast}>
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default NotificationBell;