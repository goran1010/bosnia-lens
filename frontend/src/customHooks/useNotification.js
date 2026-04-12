import { useState } from "react";

function useNotification() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = ({ type = "info", message, duration = 3000 }) => {
    const newNotification = {
      id: crypto.randomUUID(),
      type,
      message,
      duration,
      createdAt: Date.now(),
    };

    setNotifications((prev) => {
      if (prev.length >= 5) {
        return [...prev.slice(1), newNotification];
      }
      return [...prev, newNotification];
    });
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const notificationValue = {
    notifications,
    addNotification,
    removeNotification,
  };

  return { notificationValue };
}

export { useNotification };
