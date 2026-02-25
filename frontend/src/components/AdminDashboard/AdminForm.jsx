import { useContext, useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { NotificationContext } from "../../utils/NotificationContext";

function AdminForm() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/admin/requested-contributors`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const data = await response.json();

        if (response.ok) {
          setPendingRequests(data);
          addNotification({
            status: "success",
            message: "Fetched pending requests successfully.",
          });
          return;
        }
        addNotification({
          status: "error",
          message: data.error,
          details: data.details[0].msg,
        });
        console.warn(
          "Failed to fetch pending requests:",
          data.error || "Unknown error",
        );
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };
    fetchPendingRequests();
  }, []);

  return (
    <div>
      <h1>Admin Form</h1>
      <div>
        <h2>Pending Contributor requests</h2>
        <ul>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((user) => (
              <li key={user._id} className="mb-2">
                <span className="font-bold">{user.username}</span> -{" "}
                {user.email}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No pending requests</li>
          )}
        </ul>
      </div>
    </div>
  );
}
export { AdminForm };
