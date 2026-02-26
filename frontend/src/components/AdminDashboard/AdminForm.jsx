import { useContext, useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { NotificationContext } from "../../utils/NotificationContext";
import { useGetAllContributors } from "../../customHooks/AdminDashboard/useGetAllContributors";

function AdminForm() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentContributors, setCurrentContributors] = useState([]);
  const { addNotification } = useContext(NotificationContext);

  useGetAllContributors(setCurrentContributors, addNotification);

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
        setCurrentContributors((prev) => [...prev, user]);
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

  async function handleRemoveContributor(user) {
    try {
      await fetch(`${BACKEND_URL}/admin/remove-contributor/${user.id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setCurrentContributors((prev) =>
        prev.filter((contributor) => contributor.id !== user.id),
      );
      addNotification({
        type: "success",
        message: `User ${user.username} removed from contributors.`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: `Failed to remove ${user.username} from contributors.`,
      });
      console.error(
        `Error removing ${user.username} from contributors:`,
        error,
      );
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
          details: result.details[0].msg,
        });
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };
    fetchPendingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-10 p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200">
        Admin Dashboard
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold mr-3">
            {pendingRequests.length}
          </span>
          Pending Contributor Requests
        </h2>
        <ul className="space-y-3">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex-1">
                  <span className="font-bold text-gray-800 text-lg">
                    {user.username}
                  </span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                    onClick={() => {
                      handleConfirm(user);
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                    onClick={() => {
                      handleDecline(user);
                    }}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No pending requests
            </li>
          )}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mr-3">
              {currentContributors.length}
            </span>
            Current Contributors
          </h2>
        </div>
        <ul className="space-y-3">
          {currentContributors.length > 0 ? (
            currentContributors.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex-1">
                  <span className="font-bold text-gray-800 text-lg">
                    {user.username}
                  </span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                  onClick={() => handleRemoveContributor(user)}
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No contributors found. Click refresh to load.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
export { AdminForm };
