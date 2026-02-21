import { Link } from "react-router-dom";
import { Status } from "./Status";
import { useContext } from "react";
import { UserDataContext } from "../../utils/UserDataContext";

function Navbar() {
  const { userData } = useContext(UserDataContext);
  return (
    <nav className="relative min-w-130">
      <div>
        <Link
          className="block absolute top-0 left-0 py-3 px-2 hover:bg-gray-400 font-bold"
          to="/"
        >
          Bosnia Lens
        </Link>
      </div>
      <ul
        className="
        flex w-full bg-gray-200
        justify-center"
      >
        <li>
          <Link className="block py-3 px-2 hover:bg-gray-400" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className="block py-3 px-2 hover:bg-gray-400"
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
        {userData?.isAdmin && (
          <li>
            <Link
              className="block py-3 px-2 hover:bg-gray-400"
              to="/admin-dashboard"
            >
              Admin Dashboard
            </Link>
          </li>
        )}
      </ul>
      <Status />
    </nav>
  );
}

export { Navbar };
