import { useContext } from "react";
import { Link } from "react-router-dom";
import UserDataContext from "../../utils/UserDataContext";
const currentURL = import.meta.env.VITE_BACKEND_URL;

export default function Status() {
  const { userData, setUserData } = useContext(UserDataContext);

  async function handleLogout() {
    try {
      const response = await fetch(`${currentURL}/users/logout`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        return console.warn(result.error);
      }
      setUserData(null);
      console.log(result);
      console.log(result.message);
    } catch (err) {
      console.error(err);
    }
  }

  if (userData) {
    return (
      <li
        className="block absolute top-0 right-0 py-3 px-2 hover:bg-gray-400 cursor-pointer"
        onClick={handleLogout}
      >
        Log out
      </li>
    );
  }

  return (
    <div>
      <Link
        className="block absolute top-0 right-0 py-3 px-2 hover:bg-gray-400"
        to="/login"
      >
        Log In
      </Link>
    </div>
  );
}
