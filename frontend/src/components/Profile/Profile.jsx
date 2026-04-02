import { NotificationContext } from "../../contextData/NotificationContext";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useNavigate } from "react-router-dom";
import { handleBecomeContributor } from "./utils/handleBecomeContributor";
import { handleLogout } from "./utils/handleLogout";
import { Button } from "../sharedComponents/Button";

function Profile() {
  const { addNotification } = useContext(NotificationContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      addNotification({
        type: "warning",
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
        <dl className="w-full flex flex-col gap-2">
          <div>
            <dt className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Email Address
            </dt>
            <dd className="text-lg text-gray-900 font-bold dark:text-white">
              {userData?.email}
            </dd>
          </div>
          <hr />
          <div>
            <dt className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Username
            </dt>
            <dd className="text-lg text-gray-900 font-bold dark:text-white">
              {userData?.username}
            </dd>
          </div>
          <hr />
          <div>
            <dt className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Current Role
            </dt>
            <dd className="flex items-center justify-center">
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
            </dd>
          </div>
          <hr />
        </dl>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {userData?.role === "USER" && !userData?.requestedContributor && (
            <Button
              onClick={() =>
                handleBecomeContributor(addNotification, setUserData)
              }
              className="w-full px-6 py-3 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Become a Contributor
            </Button>
          )}

          <Button
            onClick={() => handleLogout(addNotification, navigate, setUserData)}
            className="bg-red-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-red-700 disabled:bg-red-500 disabled:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Profile };
