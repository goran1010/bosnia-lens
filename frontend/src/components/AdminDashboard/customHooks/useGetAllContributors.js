import { useEffect, useState } from "react";
import { useContext } from "react";
import { NotificationContext } from "../../../utils/NotificationContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function useGetAllContributors() {
  const { addNotification } = useContext(NotificationContext);
  const [currentContributors, setCurrentContributors] = useState([]);
  useEffect(() => {
    async function handleGetAllContributors() {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/contributors`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();

        if (response.ok) {
          setCurrentContributors(result.data);
          addNotification({
            type: "success",
            message: "Fetched current contributors successfully.",
          });
          return;
        }
        addNotification({
          type: "error",
          message: result.error,
          details: result.details[0].msg,
        });
      } catch (error) {
        addNotification({
          type: "error",
          message: "Failed to fetch current contributors.",
        });
        console.error("Error fetching current contributors:", error);
      }
    }
    handleGetAllContributors();
  }, [addNotification]);

  return { currentContributors, setCurrentContributors };
}

export { useGetAllContributors };
