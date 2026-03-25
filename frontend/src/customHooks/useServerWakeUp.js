import { useEffect } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useServerWakeUp({ setLongWait }) {
  // To-do:
  // Limit the number of wake-up attempts to prevent infinite loops
  useEffect(() => {
    const longWaitTimer = setTimeout(() => {
      setLongWait(true);
    }, 4000);

    const reloadTimer = setTimeout(() => {
      checkServer();
    }, 20000);

    async function checkServer() {
      try {
        const response = await fetch(`${URL}/api`, {
          method: "GET",
          mode: "cors",
        });
        await response.json();
        if (!response.ok) {
          checkServer();
          return;
        }

        setLongWait(false);
        clearTimeout(longWaitTimer);
        clearTimeout(reloadTimer);
      } catch (err) {
        console.error("Error waking up server:", err);
        checkServer();
      }
    }

    checkServer();
    return () => {
      clearTimeout(longWaitTimer);
      clearTimeout(reloadTimer);
    };
  }, [setLongWait]);
}

export { useServerWakeUp };
