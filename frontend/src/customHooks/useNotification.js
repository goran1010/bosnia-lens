import { useCallback, useMemo } from "react";

export default function useNotification(notifications, setNotifications) {
  const addNotification = useCallback(
    ({ type = "info", message, duration = 5000 }) => {
      const newNotification = {
        id: crypto.randomUUID(),
        type,
        message,
        duration,
        createdAt: Date.now(),
      };
      setNotifications((prev) => [...prev, newNotification]);
    },
    [setNotifications],
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
