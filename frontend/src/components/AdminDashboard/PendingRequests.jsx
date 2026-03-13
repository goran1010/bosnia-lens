import { handleConfirm } from "./utils/handleConfirm";
import { handleDecline } from "./utils/handleDecline";
import { useGetPendingRequests } from "./customHooks/useGetPendingRequests";
import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";

function PendingRequests({ setCurrentContributors }) {
  const { addNotification } = useContext(NotificationContext);
  const { pendingRequests, setPendingRequests } = useGetPendingRequests();

  return (
    <section className="text-gray-800 bg-white rounded-lg shadow p-3 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      <h2 className="text-md text-center font-semibold flex items-center gap-1 p-1 flex-1">
        <span className="px-2 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          {pendingRequests.length}
        </span>
        <span className="flex-1">Pending Requests</span>
      </h2>
      <ul className="space-y-3">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((user) => (
            <li
              key={user.id}
              className="flex items-center flex-wrap justify-between gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                <span className="font-bold text-gray-800 text-lg dark:text-white break-all">
                  {user.username}
                </span>
                <span className="text-gray-600 dark:text-gray-200 break-all">
                  {user.email}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 hover:cursor-pointer disabled:bg-green-500 disabled:text-gray-200 disabled:cursor-not-allowed relative flex justify-center items-center transition transform px-3 py-2 text-sm"
                  onClick={() => {
                    handleConfirm(
                      user,
                      setPendingRequests,
                      setCurrentContributors,
                      addNotification,
                    );
                  }}
                >
                  Confirm
                </button>
                <button
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 hover:cursor-pointer disabled:bg-red-500 disabled:text-gray-200 disabled:cursor-not-allowed relative flex justify-center items-center transition transform px-3 py-2 text-sm"
                  onClick={() => {
                    handleDecline(user, setPendingRequests, addNotification);
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
    </section>
  );
}

export { PendingRequests };
