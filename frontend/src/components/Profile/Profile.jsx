import { NotificationContext } from "../../contextData/NotificationContext";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useNavigate } from "react-router-dom";
import { handleBecomeContributor } from "./utils/handleBecomeContributor";
import { handleLogout } from "./utils/handleLogout";

function Profile() {
  const { addNotification } = useContext(NotificationContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      addNotification({
        type: "info",
        message: "You need to be logged in. Redirected to the login page.",
      });
      navigate("/login");
      return;
    }
  }, [userData, navigate, addNotification]);

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-600">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-4">
        <h1 className="text-2xl font-bold text-white text-center">
          My Profile
        </h1>
      </div>

      <div className="p-2 flex flex-col gap-2 text-center items-center">
        <div>
          <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Email Address
          </label>
          <p className="text-lg text-gray-900 font-bold dark:text-white">
            {userData?.email}
          </p>
        </div>
        <hr />
        <div>
          <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Username
          </label>
          <p className="text-lg text-gray-900 font-bold dark:text-white">
            {userData?.username}
          </p>
        </div>
        <hr />
        <div>
          <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Current Role
          </label>
          <div className="flex items-center justify-center">
            <span
              className={`items-center px-4 py-2 rounded-full text-sm font-bold ${
                userData?.role === "CONTRIBUTOR"
                  ? "bg-green-200 text-green-800"
                  : userData?.role === "ADMIN"
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-200 text-gray-800"
              }`}
            >
              {userData?.role}
            </span>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {userData?.role === "USER" && !userData?.requestedContributor && (
            <button
              onClick={() =>
                handleBecomeContributor(addNotification, setUserData)
              }
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer disabled:bg-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed relative flex justify-center items-center transition transform w-full px-6 py-3 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Request Contributor Access
            </button>
          )}

          <button
            onClick={() => handleLogout(addNotification, navigate, setUserData)}
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 hover:cursor-pointer disabled:bg-red-500 disabled:text-gray-200 disabled:cursor-not-allowed relative flex justify-center items-center transition transform w-full px-6 py-3 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export { Profile };
