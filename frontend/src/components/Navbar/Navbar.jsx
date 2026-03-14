import { Link } from "react-router-dom";
import { Status } from "./Status";
import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useTheme } from "../../utils/useTheme";
import { handleTheme } from "../../utils/handleTheme";
import { Select } from "../sharedComponents/Select";

function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const { theme, setMode } = useTheme();
  const { userData } = useContext(UserDataContext);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="relative px-2 bg-gray-300 w-full dark:bg-gray-800 dark:text-white font-bold grid grid-cols-3 lg:flex lg:justify-between items-center">
      <div>
        <Select
          className="bg-gray-300 dark:bg-gray-800"
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
        </Select>
      </div>
      <div className="flex lg:hidden justify-center items-center py-2">
        <button
          type="button"
          className="py-2 px-3 rounded border border-gray-500 dark:border-gray-400"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div className="hidden lg:flex justify-between items-center">
        <ul className="flex items-center">
          <li>
            <Link
              className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700 text-nowrap"
              to="/postal-codes"
            >
              Postal Codes
            </Link>
          </li>
          <li>
            <Link
              className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
              to="/holidays"
            >
              Holidays
            </Link>
          </li>
          <li>
            <Link
              className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
              to="/universities"
            >
              Universities
            </Link>
          </li>

          {(userData?.role === "ADMIN" || userData?.role === "CONTRIBUTOR") && (
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
                to="/contributor-dashboard"
              >
                Contributor
              </Link>
            </li>
          )}
          {userData?.role === "ADMIN" && (
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
                to="/admin-dashboard"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="z-10 lg:hidden pb-2 absolute top-full bg-gray-200 w-full dark:bg-gray-800 dark:text-white left-0"
        >
          <ul className="flex flex-col items-center">
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700 text-nowrap"
                to="/postal-codes"
                onClick={closeMenu}
              >
                Postal Codes
              </Link>
            </li>
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
                to="/holidays"
                onClick={closeMenu}
              >
                Holidays
              </Link>
            </li>
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
                to="/universities"
                onClick={closeMenu}
              >
                Universities
              </Link>
            </li>
            {(userData?.role === "ADMIN" ||
              userData?.role === "CONTRIBUTOR") && (
              <li>
                <Link
                  className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
                  to="/contributor-dashboard"
                  onClick={closeMenu}
                >
                  Contributor
                </Link>
              </li>
            )}
            {userData?.role === "ADMIN" && (
              <li>
                <Link
                  className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
                  to="/admin-dashboard"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
      <div
        className="flex justify-end items-center"
        onClick={() => isMenuOpen && setIsMenuOpen(false)}
      >
        <Status />
      </div>
    </nav>
  );
}

export { Navbar };
