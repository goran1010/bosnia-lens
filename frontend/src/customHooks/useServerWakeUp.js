import { useEffect } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useServerWakeUp({ setLongWait, setServerIsDown }) {
  useEffect(() => {
    // Limit the number of wake-up attempts to prevent infinite loops
    let numberOfAttempts = 0;

    const longWaitTimer = setTimeout(() => {
      setLongWait(true);
    }, 4000);

    const reloadTimer = setTimeout(() => {
      checkServer();
    }, 20000);

    async function checkServer() {
      if (numberOfAttempts >= 5) {
        console.error(
          "Server is taking too long to wake up. Stopping attempts.",
        );
        setServerIsDown(true);
        return;
      }
      try {
        const response = await fetch(`${URL}/api`, {
          method: "GET",
          mode: "cors",
        });
        await response.json();
        if (!response.ok) {
          numberOfAttempts++;
          checkServer();
          return;
        }

        setLongWait(false);
        clearTimeout(longWaitTimer);
        clearTimeout(reloadTimer);
      } catch (err) {
        console.error("Error waking up server:", err);
        numberOfAttempts++;
        checkServer();
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
