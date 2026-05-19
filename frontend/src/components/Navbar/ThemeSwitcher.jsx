import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { LanguageContext } from "../../contextData/LanguageContext";

function ThemeSwitcher({ setMode, setThemeMenuOpen }) {
  const { addNotification } = useContext(NotificationContext);
  const { t } = useContext(LanguageContext);

  return (
    <div className="menu-shell z-50 absolute top-full left-0 w-full text-center rounded-b user-select-none cursor-pointer backdrop-blur-sm ">
      <ul className="flex flex-col">
        <li>
          <button
            type="button"
            className="menu-item block w-full py-1 px-1 wrap-break-word text-sm"
            onClick={() => {
              setMode("system");
              addNotification({
                type: "info",
                message: t("theme.switched.system"),
              });
              setThemeMenuOpen(false);
            }}
          >
            {t("theme.system")}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="menu-item block w-full py-1 px-1 wrap-break-word text-sm"
            onClick={() => {
              setMode("light");
              addNotification({
                type: "info",
                message: t("theme.switched.light"),
              });
              setThemeMenuOpen(false);
            }}
          >
            {t("theme.light")}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="menu-item block w-full py-1 px-1 wrap-break-word text-sm"
            onClick={() => {
              setMode("dark");
              addNotification({
                type: "info",
                message: t("theme.switched.dark"),
              });
              setThemeMenuOpen(false);
            }}
          >
            {t("theme.dark")}
          </button>
        </li>
      </ul>
    </div>
  );
}

export { ThemeSwitcher };
