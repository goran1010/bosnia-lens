import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { setInitialLanguage } from "../../utils/setInitialLanguage";

function LanguageSwitcher({ setLanguageMenuOpen, setLanguage }) {
  const { addNotification } = useContext(NotificationContext);

  return (
    <div className="menu-shell z-50 pb-2 absolute top-full left-0 w-full text-center rounded-b user-select-none cursor-pointer backdrop-blur-sm ">
      <ul className="flex flex-col">
        <li>
          <button
            type="button"
            className="menu-item block w-full py-1 px-2 wrap-break-word text-sm"
            onClick={() => {
              setLanguage(setInitialLanguage());
              addNotification({
                type: "info",
                message: "Switched to browser language",
              });
              setLanguageMenuOpen(false);
            }}
          >
            Browser Language
          </button>
        </li>

        <li>
          <button
            type="button"
            className="menu-item block w-full py-1 px-2 wrap-break-word text-sm"
            onClick={() => {
              setLanguage("en");
              addNotification({
                type: "info",
                message: "Switched to English",
              });
              setLanguageMenuOpen(false);
            }}
          >
            English
          </button>
        </li>

        <li>
          <button
            type="button"
            className="menu-item block w-full py-1 px-2 wrap-break-word text-sm"
            onClick={() => {
              setLanguage("sr");
              addNotification({
                type: "info",
                message: "Switched to Serbian",
              });
              setLanguageMenuOpen(false);
            }}
          >
            Serbian
          </button>
        </li>
      </ul>
    </div>
  );
}

export { LanguageSwitcher };
