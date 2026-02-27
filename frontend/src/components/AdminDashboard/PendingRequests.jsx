import { handleConfirm } from "./utils/handleConfirm";
import { handleDecline } from "./utils/handleDecline";
import { useGetPendingRequests } from "./customHooks/useGetPendingRequests";
import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";

function PendingRequests({ setCurrentContributors }) {
  const { addNotification } = useContext(NotificationContext);
  const { pendingRequests, setPendingRequests } = useGetPendingRequests();

  return (
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
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
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
    </div>
  );
}

export { PendingRequests };
