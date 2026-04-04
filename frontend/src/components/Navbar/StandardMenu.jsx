import { Link } from "react-router-dom";

function StandardMenu({ userData }) {
  return (
    <div className="hidden lg:flex justify-between items-center">
      <ul className="flex items-center gap-1">
        <li>
          <Link className="menu-item block py-3 px-2" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className="menu-item block py-3 px-2 text-nowrap"
            to="/postal-codes"
          >
            Postal Codes
          </Link>
        </li>

        <li>
          <Link className="menu-item block py-3 px-2" to="/universities">
            Universities
          </Link>
        </li>

        {(userData?.role === "ADMIN" || userData?.role === "CONTRIBUTOR") && (
          <li>
            <Link
              className="menu-item block py-3 px-2"
              to="/contributor-dashboard"
            >
              Contributor
            </Link>
          </li>
        )}
        {userData?.role === "ADMIN" && (
          <li>
            <Link className="menu-item block py-3 px-2" to="/admin-dashboard">
              Admin
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export { StandardMenu };
