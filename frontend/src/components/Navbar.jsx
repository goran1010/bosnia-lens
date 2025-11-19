import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="relative">
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
      </ul>
      <div>
        <Link
          className="block absolute top-0 right-0 py-3 px-2 hover:bg-gray-400"
          to="/login"
        >
          Log In
        </Link>
      </div>
    </nav>
  );
}
