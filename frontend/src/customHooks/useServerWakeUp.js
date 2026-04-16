import { useEffect } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ALLOWED_ATTEMPTS = 30;
const DELAY_BETWEEN_ATTEMPTS = 2000;
const LONG_WAIT_TIME = 3000;

function useServerWakeUp({ setLongWait, setServerIsDown }) {
  useEffect(() => {
    // Limit the number of wake-up attempts to prevent infinite loops
    let currentNumberOfAttempts = 0;
    const longWaitTimer = setTimeout(() => {
      setLongWait(true);
    }, LONG_WAIT_TIME);

    async function checkServer() {
      if (currentNumberOfAttempts >= ALLOWED_ATTEMPTS) {
        clearTimeout(longWaitTimer);
        setServerIsDown(true);
        setLongWait(false);
        console.error(
          "Server can't be reached after multiple attempts. Please try again later.",
        );
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api`, {
          method: "GET",
          mode: "cors",
        });
        await response.json();
        if (!response.ok) {
          setTimeout(() => {
            currentNumberOfAttempts++;
            checkServer();
          }, DELAY_BETWEEN_ATTEMPTS);
          return;
        }

        setLongWait(false);
        clearTimeout(longWaitTimer);
      } catch (err) {
        console.error(err);
        setTimeout(() => {
          currentNumberOfAttempts++;
          checkServer();
        }, DELAY_BETWEEN_ATTEMPTS);
      }
    }

    checkServer();
    return () => {
      clearTimeout(longWaitTimer);
    };
  }, [setLongWait, setServerIsDown]);
}

export { useServerWakeUp };
