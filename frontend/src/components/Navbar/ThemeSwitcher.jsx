import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";

function ThemeSwitcher({ setMode, setThemeMenuOpen }) {
  const { addNotification } = useContext(NotificationContext);

  return (
    <div className="z-10 pb-2 absolute top-full bg-gray-300 dark:bg-gray-800 dark:text-white left-0 w-full text-center rounded-b">
      <ul className="flex flex-col">
        <li
          className="block py-2 px-4 hover:bg-gray-400 dark:hover:bg-gray-700"
          onClick={() => {
            setMode("system");
            addNotification({
              type: "info",
              message: "Switched to system theme",
            });
            setThemeMenuOpen(false);
          }}
        >
          System
        </li>
        <li
          className="block py-2 px-4 hover:bg-gray-400 dark:hover:bg-gray-700"
          onClick={() => {
            setMode("light");
            addNotification({
              type: "info",
              message: "Switched to light theme",
            });
            setThemeMenuOpen(false);
          }}
        >
          Light
        </li>
        <li
          className="block py-2 px-4 hover:bg-gray-400 dark:hover:bg-gray-700"
          onClick={() => {
            setMode("dark");
            addNotification({
              type: "info",
              message: "Switched to dark theme",
            });
            setThemeMenuOpen(false);
          }}
        >
          Dark
        </li>
      </ul>
    </div>
  );
}

export { ThemeSwitcher };
