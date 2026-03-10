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
        type: "error",
        message: "You must be logged in to view the profile page.",
      });
      navigate("/login");
    }
  }, [userData, navigate, addNotification]);
  return (
    <div className="dark:bg-gray-800 dark:text-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
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
            Contributor Status
          </label>
          <div className="flex items-center justify-center">
            <span
              className={`items-center px-4 py-2 rounded-full text-sm font-bold ${
                userData?.role === "CONTRIBUTOR"
                  ? "bg-green-200 text-green-800"
                  : userData?.requestedContributor
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-gray-200 text-gray-800"
              }`}
            >
              {userData?.role === "CONTRIBUTOR"
                ? "Active Contributor"
                : userData?.requestedContributor
                  ? "Pending Approval"
                  : "Not a Contributor"}
            </span>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {userData?.role !== "CONTRIBUTOR" &&
            !userData?.requestedContributor && (
              <button
                onClick={() =>
                  handleBecomeContributor(addNotification, setUserData)
                }
                className="cursor-pointer w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Request Contributor Access
              </button>
            )}

          <button
            onClick={() => handleLogout(addNotification, navigate, setUserData)}
            className="cursor-pointer w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export { Profile };
