import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer";
import { useState } from "react";
import { UserDataContext } from "./utils/UserDataContext";
import Spinner from "@goran1010/spinner";
import { useStatusCheck } from "./customHooks/useStatusCheck";
import { Notifications } from "./components/Notifications";
import { NotificationContext } from "./utils/NotificationContext";
import { useNotification } from "./customHooks/useNotification";

function Root() {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const notificationValue = useNotification(notifications, setNotifications);

  useStatusCheck(setUserData, setLoading, notificationValue);

  return (
    <NotificationContext
      value={{
        notifications: notificationValue.notifications,
        addNotification: notificationValue.addNotification,
        removeNotification: notificationValue.removeNotification,
      }}
    >
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

export { Root };
