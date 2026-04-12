const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../../contextData/NotificationContext";

function useGetPendingRequests(setLoading) {
  const { addNotification } = useContext(NotificationContext);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${BACKEND_URL}/users/admin/requested-contributors`,
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
          setPendingRequests(result.data);
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
            "Failed to load pending contributor requests.",
        });
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        addNotification({
          type: "error",
          message: "Error fetching pending contributor requests.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPendingRequests();
  }, [addNotification, setLoading]);

  return { pendingRequests, setPendingRequests };
}

export { useGetPendingRequests };
