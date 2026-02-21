import { useCallback, useMemo } from "react";

function useNotification(notifications, setNotifications) {
  const addNotification = useCallback(
    ({ type = "info", message, duration = 3000, details = null }) => {
      const newNotification = {
        id: crypto.randomUUID(),
        type,
        message,
        details,
        duration,
        createdAt: Date.now(),
      };
      if (notifications.length >= 5) {
        setNotifications((prev) => [...prev.slice(1), newNotification]);
        return;
      }
      setNotifications((prev) => [...prev, newNotification]);
    },
    [setNotifications, notifications.length],
  );

  const removeNotification = useCallback(
    (id) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications],
  );

  const notificationValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
    }),
    [notifications, addNotification, removeNotification],
  );
  return notificationValue;
}

export { useNotification };
