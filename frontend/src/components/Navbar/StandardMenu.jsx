import { Link } from "react-router-dom";

function StandardMenu({ userData }) {
  return (
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
  );
}

export { StandardMenu };
