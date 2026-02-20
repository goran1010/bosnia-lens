import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import { useState, useMemo } from "react";
import UserDataContext from "./utils/UserDataContext";
import Spinner from "@goran1010/spinner";
import useStatusCheck from "./customHooks/useStatusCheck";
import Notifications from "./components/Notifications";
import NotificationContext from "./utils/NotificationContext";

function Root() {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: crypto.randomUUID(),
      type: "success",
      message: "Welcome to Bosnia Lens!",
      duration: 5000,
      createdAt: Date.now(),
    },
  ]);
  const [loading, setLoading] = useState(true);

  useStatusCheck(setUserData, setLoading);

  const addNotification = ({ type = "info", message, duration = 5000 }) => {
    const newNotification = {
      id: crypto.randomUUID(),
      type,
      message,
      duration,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const notificationValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
    }),
    [notifications],
  );

  return (
    <NotificationContext value={{ notificationValue }}>
      <UserDataContext value={{ userData, setUserData }}>
        <>
          <Navbar />
          <Notifications />
          <main className="relative flex flex-col flex-auto max-w-230 m-auto gap-5">
            {loading ? <Spinner /> : <Outlet />}
          </main>
          <Footer />
        </>
      </UserDataContext>
    </NotificationContext>
  );
}

export default Root;
