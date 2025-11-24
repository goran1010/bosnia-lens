import { Link } from "react-router-dom";
import UserDataContext from "../utils/UserDataContext";
import { useContext } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

export default function Navbar() {
  const { userData, setUserData } = useContext(UserDataContext);

  async function handleLogout() {
    try {
      const response = await fetch(`${URL}/users/logout`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        console.warn(result.error);
      }

      setUserData(null);
    } catch (err) {
      console.error(err);
    }
  }

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
      </ul>
      {!userData ? (
        <div>
          <Link
            className="block absolute top-0 right-0 py-3 px-2 hover:bg-gray-400"
            to="/login"
          >
            Log In
          </Link>
        </div>
      ) : (
        <li
          className="block absolute top-0 right-0 py-3 px-2 hover:bg-gray-400 cursor-pointer"
          onClick={handleLogout}
        >
          Log out
        </li>
      )}
    </nav>
  );
}
