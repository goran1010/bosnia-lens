import { useEffect } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;
const ALLOWED_ATTEMPTS = import.meta.env.VITE_ALLOWED_ATTEMPTS_TO_WAKE_UP;
const DELAY_BETWEEN_ATTEMPTS = import.meta.env
  .VITE_DELAY_BETWEEN_WAKE_UP_ATTEMPTS;

function useServerWakeUp({ setLongWait, setServerIsDown }) {
  useEffect(() => {
    // Limit the number of wake-up attempts to prevent infinite loops
    let numberOfAttempts = 0;
    const longWaitTimer = setTimeout(() => {
      setLongWait(true);
    }, 4000);

    async function checkServer() {
      if (numberOfAttempts >= ALLOWED_ATTEMPTS) {
        clearTimeout(longWaitTimer);
        setServerIsDown(true);
        setLongWait(false);
        console.error(
          "Server can't be reached after multiple attempts. Please try again later.",
        );
        return;
      }
      try {
        const response = await fetch(`${URL}/api`, {
          method: "GET",
          mode: "cors",
        });
        await response.json();
        if (!response.ok) {
          setTimeout(() => {
            numberOfAttempts++;
            checkServer();
          }, DELAY_BETWEEN_ATTEMPTS);
          return;
        }

        setLongWait(false);
        clearTimeout(longWaitTimer);
      } catch (err) {
        console.error("Error waking up server:", err);
        setTimeout(() => {
          numberOfAttempts++;
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
