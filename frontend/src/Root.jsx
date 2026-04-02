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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeMenuOpen, setThemeMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [longWait, setLongWait] = useState(false);
  const { notificationValue } = useNotification();
  const [serverIsDown, setServerIsDown] = useState(false);

  useTitle();

  useServerWakeUp({
    setLongWait,
    setServerIsDown,
  });

  const { userData, setUserData } = useStatusCheck(
    setLoading,
    notificationValue,
    longWait,
  );

  if (longWait || serverIsDown) {
    return <LongWaitInfo serverIsDown={serverIsDown} />;
  }

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
          <Navbar
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isThemeMenuOpen={isThemeMenuOpen}
            setThemeMenuOpen={setThemeMenuOpen}
          />
          <Notifications />
          <main
            className="flex-1 dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center px-[5%] lg:px-[10%] xl:px-[15%] 2xl:px-[20%]"
            onClick={() => {
              isMenuOpen && setIsMenuOpen(false);
              isThemeMenuOpen && setThemeMenuOpen(false);
            }}
          >
            {loading ? <Spinner /> : <Outlet />}
          </main>
          <Footer />
        </>
      </UserDataContext>
    </NotificationContext>
  );
}

export { Root };
