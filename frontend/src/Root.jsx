import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer";
import { useState } from "react";
import { UserDataContext } from "./contextData/UserDataContext";
import { Spinner } from "./utils/Spinner";
import { useStatusCheck } from "./customHooks/useStatusCheck";
import { Notifications } from "./components/Notifications";
import { NotificationContext } from "./contextData/NotificationContext";
import { useNotification } from "./customHooks/useNotification";
import { useTitle } from "./customHooks/useTitle";

function Root() {
  const [loading, setLoading] = useState(true);
  const [longWait, setLongWait] = useState(false);

  const { notificationValue } = useNotification();

  useTitle();

  const { userData, setUserData } = useStatusCheck(
    setLoading,
    notificationValue,
    setLongWait,
  );

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
          <main className="relative flex flex-col flex-auto gap-5 dark:bg-gray-900 dark:text-white p-4">
            {loading ? <Spinner /> : <Outlet />}
            {longWait && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="bg-gray-500 p-4 rounded shadow">
                  <p className="text-white font-bold">
                    This is taking longer than expected (server might be waking
                    up). Please wait...
                  </p>
                </div>
              </div>
            )}
          </main>
          <Footer />
        </>
      </UserDataContext>
    </NotificationContext>
  );
}

export { Root };
