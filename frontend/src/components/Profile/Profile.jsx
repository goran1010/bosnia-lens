import { NotificationContext } from "../../utils/NotificationContext";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../../utils/UserDataContext";
import { useNavigate } from "react-router-dom";
const currentURL = import.meta.env.VITE_BACKEND_URL;

function Profile() {
  const { addNotification } = useContext(NotificationContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

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
      <h1>Profile</h1>
      <div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </>
  );
}

export { Profile };
