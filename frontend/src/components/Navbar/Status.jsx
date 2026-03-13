import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../../contextData/UserDataContext";

function Status() {
  const { userData } = useContext(UserDataContext);

  if (userData) {
    return (
      <div className="flex items-center justify-center">
        <Link
          className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700 cursor-pointer"
          to="/profile"
        >
          Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Link
        className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700"
        to="/login"
      >
        Log In
      </Link>
    </div>
  );
}

export { Status };
