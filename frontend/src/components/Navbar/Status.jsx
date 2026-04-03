import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../../contextData/UserDataContext";

function Status() {
  const { userData } = useContext(UserDataContext);

  if (userData) {
    return (
      <div className="flex items-center justify-center">
        <Link
          className="block py-3 px-4 hover:bg-gray-400 dark:hover:bg-gray-700 cursor-pointer rounded-lg lg:rounded-none lg:px-2"
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
        className="block py-3 px-2 hover:bg-gray-400 dark:hover:bg-gray-700 cursor-pointer rounded-lg lg:rounded-none lg:px-2"
        to="/login"
      >
        Log In
      </Link>
    </div>
  );
}

export { Status };
