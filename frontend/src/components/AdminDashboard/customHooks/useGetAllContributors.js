import { useEffect, useState } from "react";
import { useContext } from "react";
import { NotificationContext } from "../../../contextData/NotificationContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function useGetAllContributors(setLoading) {
  const { addNotification } = useContext(NotificationContext);
  const [currentContributors, setCurrentContributors] = useState([]);

  useEffect(() => {
    async function handleGetAllContributors() {
      try {
        setLoading(true);
        const response = await fetch(
          `${BACKEND_URL}/users/admin/contributors`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const result = await response.json();

        if (response.ok) {
          setCurrentContributors(result.data);
          addNotification({
            type: "success",
            message: result.message,
          });
          return;
        }
        addNotification({
          type: "error",
          message:
            result?.error?.message ||
            result?.error ||
            "Failed to load contributors.",
        });
      } catch (error) {
        addNotification({
          type: "error",
          message: "Error fetching current contributors.",
        });
        console.error("Error fetching current contributors:", error);
      } finally {
        setLoading(false);
      }
    }
    handleGetAllContributors();
  }, [addNotification, setLoading]);

  return { currentContributors, setCurrentContributors };
}

export { useGetAllContributors };
