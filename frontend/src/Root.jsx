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
import { LongWaitInfo } from "./utils/longWaitInfo";
import { useServerWakeUp } from "./customHooks/useServerWakeUp";

function Root() {
  const [loading, setLoading] = useState(true);
  const [longWait, setLongWait] = useState(false);

  const { notificationValue } = useNotification();

  useTitle();

  useServerWakeUp({
    setLongWait,
    addNotification: notificationValue.addNotification,
  });

  const { userData, setUserData } = useStatusCheck(
    setLoading,
    notificationValue,
    longWait,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log(
    "Root component rendered. Loading:",
    loading,
    "Long wait:",
    longWait,
  );
  try {
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
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Notifications />
            <main
              className="flex-1 dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center px-[5%] lg:px-[10%] xl:px-[15%] 2xl:px-[20%]"
              onClick={() => isMenuOpen && setIsMenuOpen(false)}
            >
              {loading ? <Spinner /> : <Outlet />}
              {longWait && <LongWaitInfo />}
            </main>
            <Footer />
          </>
        </UserDataContext>
      </NotificationContext>
    );
  } catch (error) {
    console.error("Error in Root component:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          An unexpected error occurred. Refresh the page or try again later.
        </h1>
      </div>
    );
  }
}

export { Root };
