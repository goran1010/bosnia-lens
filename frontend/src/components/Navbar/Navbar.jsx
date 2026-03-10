import { Link } from "react-router-dom";
import { Status } from "./Status";
import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useTheme } from "../../utils/useTheme";
import { handleTheme } from "../../utils/handleTheme";

function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const { theme, setMode } = useTheme();
  const { userData } = useContext(UserDataContext);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="relative px-2 bg-gray-200 w-full dark:bg-gray-800 dark:text-white font-bold grid grid-cols-3 lg:flex lg:justify-between items-center">
      <div>
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
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="z-10 lg:hidden pb-2 absolute top-full bg-gray-200 w-full dark:bg-gray-800 dark:text-white left-0"
        >
          <ul className="flex flex-col items-center">
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400"
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400 text-nowrap"
                to="/postal-codes"
                onClick={closeMenu}
              >
                Postal Codes
              </Link>
            </li>
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400"
                to="/holidays"
                onClick={closeMenu}
              >
                Holidays
              </Link>
            </li>
            <li>
              <Link
                className="block py-3 px-2 hover:bg-gray-400"
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
                  className="block py-3 px-2 hover:bg-gray-400"
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
                  className="block py-3 px-2 hover:bg-gray-400"
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
