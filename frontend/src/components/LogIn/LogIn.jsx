import { Link } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogInForm } from "./LogInForm.jsx";
import { UserDataContext } from "../../contextData/UserDataContext.js";
import { NotificationContext } from "../../contextData/NotificationContext.js";

function LogIn() {
  const [loading, setLoading] = useState(false);

  const { addNotification } = useContext(NotificationContext);

  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const wasLoggedInOnPageLoad = useRef(Boolean(userData));

  useEffect(() => {
    if (userData) {
      if (wasLoggedInOnPageLoad.current) {
        addNotification({
          type: "warning",
          message: "You are already logged in. Redirected to the home page.",
        });
      }
      navigate("/home");
      return;
    }
  }, [userData, navigate, addNotification]);

  return (
    <div className="relative min-h-full w-full max-w-xl mx-auto flex items-center justify-center bg-gray-50 rounded-md dark:bg-gray-800 p-3">
      <div className="w-full max-w-md p-4 flex flex-col gap-3">
        <h1 className="text-3xl text-center font-bold text-gray-900 dark:text-gray-100">
          Log in
        </h1>
        <LogInForm setLoading={setLoading} loading={loading} />

        <div className="relative flex items-center">
          <div className="grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="mx-4 text-gray-500 text-sm dark:text-gray-400">
            OR
          </span>
          <div className="grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <div className="relative">
          <p className="text-center">
            Don't have an account ? Go to the{" "}
            <Link
              className="text-blue-600 hover:underline font-bold"
              to={"/signup"}
            >
              Sign Up
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}

export { LogIn };
