import { Link } from "react-router-dom";

function MobileMenu({ setIsMenuOpen, userData }) {
  return (
    <div
      id="mobile-menu"
      className="z-10 pb-2 absolute top-full bg-gray-200 w-full dark:bg-gray-800 dark:text-white left-0"
    >
      <ul className="flex flex-col items-center">
        <li>
          <Link
            className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700"
            to="/"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700 text-nowrap"
            to="/postal-codes"
            onClick={() => setIsMenuOpen(false)}
          >
            Postal Codes
          </Link>
        </li>
        <li>
          <Link
            className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700"
            to="/holidays"
            onClick={() => setIsMenuOpen(false)}
          >
            Holidays
          </Link>
        </li>
        <li>
          <Link
            className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700"
            to="/universities"
            onClick={() => setIsMenuOpen(false)}
          >
            Universities
          </Link>
        </li>
        {(userData?.role === "ADMIN" || userData?.role === "CONTRIBUTOR") && (
          <li>
            <Link
              className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700"
              to="/contributor-dashboard"
              onClick={() => setIsMenuOpen(false)}
            >
              Contributor
            </Link>
          </li>
        )}
        {userData?.role === "ADMIN" && (
          <li>
            <Link
              className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700"
              to="/admin-dashboard"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export { MobileMenu };
