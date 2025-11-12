import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
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
      </ul>
    </nav>
  );
}
