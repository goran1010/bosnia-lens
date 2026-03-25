import { useEffect } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useServerWakeUp({ setLongWait, addNotification }) {
  useEffect(() => {
    const longWaitTimer = setTimeout(() => {
      setLongWait(true);
    }, 4000);

    const reloadTimer = setTimeout(() => {
      window.location.reload();
    }, 20000);

    async function checkServer() {
      try {
        const response = await fetch(`${URL}/api`, {
          method: "GET",
          mode: "cors",
        });
        await response.json();
        if (!response.ok) {
          window.location.reload();
          return;
        }

        setLongWait(false);
        clearTimeout(longWaitTimer);
        clearTimeout(reloadTimer);
        addNotification({
          type: "success",
          message: "Server is awake!",
        });
      } catch (err) {
        console.error("Error waking up server:", err);
        window.location.reload();
      }
    }

    checkServer();
    return () => {
      clearTimeout(longWaitTimer);
      clearTimeout(reloadTimer);
    };
  }, [setLongWait, addNotification]);
}

export { useServerWakeUp };
