import { useContext, useEffect } from "react";
import NotificationContext from "../utils/NotificationContext";

function getNotificationStyles(type) {
  switch (type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500 text-black";
    case "info":
    default:
      return "bg-blue-500";
  }
}

export default function Notifications() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  useEffect(() => {
    const timers = notifications.map((notification) => {
      if (!notification.duration) return null;

      return setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    });

    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  if (!notifications.length) return null;

  return (
    <div className="fixed top-10 z-50 flex flex-col gap-3 right-10 select-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white min-w-[250px] flex justify-between items-center ${getNotificationStyles(
            notification.type,
          )}`}
        >
          <span>{notification.message}</span>

          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-sm opacity-80 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
