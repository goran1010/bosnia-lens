import { useEffect, useRef } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useServerWakeUp({ setLongWait, setServerIsDown }) {
  const lastAttempt = useRef(false);
  useEffect(() => {
    // Limit the number of wake-up attempts to prevent infinite loops
    let numberOfAttempts = 0;

    const longWaitTimer = setTimeout(() => {
      setLongWait(true);
    }, 4000);

    const reloadTimer = setTimeout(() => {
      lastAttempt.current = true;
      checkServer();
    }, 20000);

    async function checkServer() {
      if (numberOfAttempts >= 3) {
        if (lastAttempt.current) {
          setServerIsDown(true);
          setLongWait(false);
          console.error(
            "Server is down after multiple attempts. Please try again later.",
          );
          return;
        }
        console.error(
          "Server is taking too long to wake up. Will attempt one more time.",
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
          }, 2000);
          return;
        }

        setLongWait(false);
        clearTimeout(longWaitTimer);
        clearTimeout(reloadTimer);
      } catch (err) {
        console.error("Error waking up server:", err);
        setTimeout(() => {
          numberOfAttempts++;
          checkServer();
        }, 2000);
      }
    }

    checkServer();
    return () => {
      clearTimeout(longWaitTimer);
      clearTimeout(reloadTimer);
    };
  }, [setLongWait, setServerIsDown]);
}

export { useServerWakeUp };
