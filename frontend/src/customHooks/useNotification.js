import { useCallback, useMemo, useState } from "react";

function useNotification() {
  const [notifications, setNotifications] = useState([]);

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

      setNotifications((prev) => {
        if (prev.length >= 5) {
          return [...prev.slice(1), newNotification];
        }
        return [...prev, newNotification];
      });
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
  return { notificationValue };
}

export { useNotification };
