import { Link } from "react-router-dom";
import { Status } from "./Status";
import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useTheme } from "../../utils/useTheme";
import { handleTheme } from "../../utils/handleTheme";

function Navbar() {
  const { theme, setMode } = useTheme();
  const { userData } = useContext(UserDataContext);
  return (
    <nav className="overflow-x-auto px-4 bg-gray-200 w-full flex justify-between items-center dark:bg-gray-800 dark:text-white font-bold">
      <div className="flex justify-center items-center">
        <select
          className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded cursor-pointer"
          defaultValue={theme}
          name="theme-switcher"
          id="theme-switcher"
          onChange={(event) => handleTheme(event, setMode)}
        >
          <option className="font-bold" value="system">
            system
          </option>
          <option className="font-bold" value="light">
            light
          </option>
          <option className="font-bold" value="dark">
            dark
          </option>
        </select>
      </div>

      <ul className="flex items-center">
        <li>
          <Link className="block py-3 px-2 hover:bg-gray-400" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className="block py-3 px-2 hover:bg-gray-400 text-nowrap"
            to="/postal-codes"
          >
            Postal Codes
          </Link>
        </li>
        <li>
          <Link className="block py-3 px-2 hover:bg-gray-400" to="/holidays">
            Holidays
          </Link>
        </li>
        <li>
          <Link
            className="block py-3 px-2 hover:bg-gray-400"
            to="/universities"
          >
            Universities
          </Link>
        </li>
        {(userData?.role === "ADMIN" || userData?.role === "CONTRIBUTOR") && (
          <li>
            <Link
              className="block py-3 px-2 hover:bg-gray-400"
              to="/contributor-dashboard"
            >
              Contributor
            </Link>
          </li>
        )}
        {userData?.role === "ADMIN" && (
          <li>
            <Link
              className="block py-3 px-2 hover:bg-gray-400"
              to="/admin-dashboard"
            >
              Admin
            </Link>
          </li>
        )}
      </ul>
      <Status />
    </nav>
  );
}

export { Navbar };
