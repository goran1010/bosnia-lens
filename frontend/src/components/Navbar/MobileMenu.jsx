import { Link } from "react-router-dom";

function MobileMenu({ setIsMenuOpen, userData }) {
  return (
    <div
      id="mobile-menu"
      className="z-10 pb-2 absolute top-full bg-gray-200 w-full dark:bg-gray-800 dark:text-white left-0"
    >
      <ul className="flex flex-col items-center">
        <Link
          className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700 w-full text-center text-nowrap"
          to="/"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700 w-full text-center text-nowrap"
          to="/postal-codes"
          onClick={() => setIsMenuOpen(false)}
        >
          Postal Codes
        </Link>

        <Link
          className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700 w-full text-center text-nowrap"
          to="/holidays"
          onClick={() => setIsMenuOpen(false)}
        >
          Holidays
        </Link>

        <Link
          className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700 w-full text-center text-nowrap"
          to="/universities"
          onClick={() => setIsMenuOpen(false)}
        >
          Universities
        </Link>

        {(userData?.role === "ADMIN" || userData?.role === "CONTRIBUTOR") && (
          <Link
            className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700 w-full text-center text-nowrap"
            to="/contributor-dashboard"
            onClick={() => setIsMenuOpen(false)}
          >
            Contributor
          </Link>
        )}
        {userData?.role === "ADMIN" && (
          <Link
            className="block p-2 hover:bg-gray-400 dark:hover:bg-gray-700 w-full text-center text-nowrap"
            to="/admin-dashboard"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin
          </Link>
        )}
      </ul>
    </div>
  );
}

export { MobileMenu };
