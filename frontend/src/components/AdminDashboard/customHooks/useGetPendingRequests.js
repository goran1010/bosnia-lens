const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../../contextData/NotificationContext";

function useGetPendingRequests() {
  const { addNotification } = useContext(NotificationContext);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
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
            message: "Fetched pending requests successfully.",
          });
          return;
        }
        addNotification({
          type: "error",
          message: result.error,
          details: result.details?.[0]?.msg,
        });
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };
    fetchPendingRequests();
  }, [addNotification]);

  return { pendingRequests, setPendingRequests };
}

export { useGetPendingRequests };
