import { NotificationContext } from "../../utils/NotificationContext";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../../utils/UserDataContext";
import { useNavigate } from "react-router-dom";
const currentURL = import.meta.env.VITE_BACKEND_URL;

function Profile() {
  const { addNotification } = useContext(NotificationContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  async function handleBecomeContributor() {
    try {
      const response = await fetch(`${currentURL}/users/become-contributor`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        addNotification({
          type: "error",
          message: result.error,
          details: result.details[0].msg,
        });
        return;
      }
      setUserData(result.data);
      addNotification({
        type: "success",
        message: result.message,
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "An error occurred while requesting contributor status.",
      });
      console.error(err);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch(`${currentURL}/users/logout`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        addNotification({
          type: "error",
          message: result.error,
          details: result.details[0].msg,
        });
        return;
      }
      addNotification({
        type: "success",
        message: result.message,
      });
      setUserData(null);
      navigate("/");
    } catch (err) {
      addNotification({
        type: "error",
        message: "An error occurred while logging out.",
      });
      console.error(err);
    }
  }

  useEffect(() => {
    if (!userData) {
      addNotification({
        type: "error",
        message: "You must be logged in to view the profile page.",
      });
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, navigate]);
  return (
    <>
      <div className="max-w-3xl p-5">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-10">
            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          </div>

          <div className="px-8 py-8 space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Email Address
              </label>
              <p className="text-lg text-gray-900 font-bold">
                {userData?.email}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Username
              </label>
              <p className="text-lg text-gray-900 font-bold">
                {userData?.username}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Contributor Status
              </label>
              <div className="flex items-center justify-center">
                <span
                  className={`items-center px-4 py-2 rounded-full text-sm font-bold bg-gray-200`}
                >
                  {userData?.isContributor
                    ? "Active Contributor"
                    : userData?.requestedContributor
                      ? "Pending Approval"
                      : "Not a Contributor"}
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              {!userData?.isContributor && !userData?.requestedContributor && (
                <button
                  onClick={handleBecomeContributor}
                  className="cursor-pointer w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Request Contributor Access
                </button>
              )}

              <button
                onClick={handleLogout}
                className="cursor-pointer w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Profile };
