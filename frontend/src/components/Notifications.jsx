import { useContext, useEffect, useRef } from "react";
import { NotificationContext } from "../utils/NotificationContext";

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
function Notifications() {
  const { notifications, removeNotification } = useContext(NotificationContext);
  const timerMapRef = useRef(new Map());

  useEffect(() => {
    let newTimerRef = timerMapRef.current;
    // Set timers for new notifications only
    notifications.forEach((notification) => {
      if (notification.duration && !newTimerRef.has(notification.id)) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
          newTimerRef.delete(notification.id);
        }, notification.duration);

        newTimerRef.set(notification.id, timer);
      }
    });

    // Clean up timers for notifications that were removed
    return () => {
      newTimerRef.forEach((timer, id) => {
        const stillExists = notifications.some(
          (notification) => notification.id === id,
        );
        if (!stillExists) {
          clearTimeout(timer);
          newTimerRef.delete(id);
        }
      });
    };
  }, [notifications, removeNotification]);

  if (!notifications.length) return null;

  return (
    <div className="fixed top-10 z-50 flex flex-col gap-3 right-10 select-none opacity-80 hover:opacity-100">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`relative px-4 py-3 rounded-lg shadow-lg text-white min-w-[250px] flex flex-col justify-center items-center ${getNotificationStyles(
            notification.type,
          )}`}
        >
          <p>{notification.message}</p>
          {notification.details && (
            <p className="text-sm opacity-80">{notification.details}</p>
          )}

          <button
            onClick={() => removeNotification(notification.id)}
            className="absolute top-2 right-2 text-sm opacity-80 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export { Notifications };
