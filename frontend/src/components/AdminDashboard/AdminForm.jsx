import { useContext, useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { NotificationContext } from "../../utils/NotificationContext";

function AdminForm() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const { addNotification } = useContext(NotificationContext);

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
      const data = await response.json();

      if (response.ok) {
        addNotification({
          type: "success",
          message: "Fetched current contributors successfully.",
        });
        return;
      }
      addNotification({
        type: "error",
        message: data.error,
        details: data.details[0].msg,
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to fetch current contributors.",
      });
      console.error("Error fetching current contributors:", error);
    }
  }

  async function handleConfirm(user) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/admin/add-contributor/${user.id}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const data = await response.json();

      if (response.ok) {
        setPendingRequests((prev) =>
          prev.filter((request) => request._id !== user._id),
        );
        addNotification({
          type: "success",
          message: `User ${user.username} is now a contributor.`,
        });
        return;
      }
      addNotification({
        type: "error",
        message: data.error,
        details: data.details[0].msg,
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: `Failed to promote ${user.username} to contributor.`,
      });
      console.error(`Error promoting ${user.username} to contributor:`, error);
    }
  }

  async function handleDecline(user) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/admin/decline-contributor/${user.id}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const data = await response.json();

      if (response.ok) {
        setPendingRequests((prev) =>
          prev.filter((request) => request._id !== user._id),
        );
        addNotification({
          type: "success",
          message: `User ${user.username}'s request declined.`,
        });
        return;
      }
      addNotification({
        type: "error",
        message: data.error,
        details: data.details[0].msg,
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: `Failed to decline ${user.username}'s request.`,
      });
      console.error(`Error declining ${user.username}'s request:`, error);
    }
  }

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
            type: "success",
            message: "Fetched pending requests successfully.",
          });
          return;
        }
        addNotification({
          type: "error",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Admin Form</h1>
      <div>
        <h2>Pending Contributor requests</h2>
        <ul>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((user) => (
              <li key={user.id} className="mb-2">
                <span className="font-bold">{user.username}</span> -{" "}
                {user.email}
                <button
                  className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    handleConfirm(user);
                  }}
                >
                  Confirm
                </button>
                <button
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    handleDecline(user);
                  }}
                >
                  Decline
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No pending requests</li>
          )}
        </ul>
      </div>
      <div>
        <h2>Current Contributors:</h2>
        <div>
          <button
            className=" bg-blue-500 text-white px-2 py-1 rounded"
            onClick={handleGetAllContributors}
          >
            Get current contributors
          </button>
        </div>
      </div>
    </div>
  );
}
export { AdminForm };
