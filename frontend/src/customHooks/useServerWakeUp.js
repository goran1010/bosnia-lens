import { useEffect, useRef } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ALLOWED_ATTEMPTS = 30;
const DELAY_BETWEEN_ATTEMPTS = 2000;
const SERVER_STATUS_NOTIFICATION_ID = "server-status";

function useServerWakeUp({ addNotification, removeNotification, t }) {
  const isServerLiveRef = useRef(false);

  useEffect(() => {
    const translate =
      typeof t === "function"
        ? t
        : (key) => {
            if (key === "longWait.wakingUp") {
              return "Server is waking up.";
            }
            if (key === "longWait.unreachable") {
              return "Server is currently unavailable.";
            }
            return key;
          };

    // Limit the number of wake-up attempts to prevent infinite loops
    let isCancelled = false;
    let currentNumberOfAttempts = 0;
    let retryTimeoutId;

    addNotification({
      id: SERVER_STATUS_NOTIFICATION_ID,
      type: "warning",
      message: translate("longWait.wakingUp"),
      duration: null,
      persistent: true,
    });

    async function checkServer() {
      if (isCancelled) {
        return;
      }

      if (currentNumberOfAttempts >= ALLOWED_ATTEMPTS) {
        addNotification({
          id: SERVER_STATUS_NOTIFICATION_ID,
          type: "error",
          message: translate("longWait.unreachable"),
          duration: null,
          persistent: true,
        });
        console.error(
          "Server can't be reached after multiple attempts. Please try again later.",
        );
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api`, {
          method: "GET",
          mode: "cors",
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
          retryTimeoutId = setTimeout(() => {
            currentNumberOfAttempts++;
            checkServer();
          }, DELAY_BETWEEN_ATTEMPTS);
          return;
        }
        isServerLiveRef.current = true;
        removeNotification(SERVER_STATUS_NOTIFICATION_ID);
      } catch (err) {
        if (isCancelled || err?.name === "AbortError") {
          return;
        }

        console.error(err);
        retryTimeoutId = setTimeout(() => {
          currentNumberOfAttempts++;
          checkServer();
        }, DELAY_BETWEEN_ATTEMPTS);
      }
    }

    checkServer();

    return () => {
      isCancelled = true;
      clearTimeout(retryTimeoutId);
      removeNotification(SERVER_STATUS_NOTIFICATION_ID);
    };
  }, [addNotification, removeNotification, t]);

  return isServerLiveRef.current;
}

export { useServerWakeUp };
