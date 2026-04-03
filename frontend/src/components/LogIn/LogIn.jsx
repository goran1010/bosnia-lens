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
    <div className="panel-card relative min-h-full w-full max-w-xl mx-auto flex items-center justify-center p-3">
      <div className="w-full max-w-md p-4 flex flex-col gap-3">
        <h1 className="text-3xl text-center font-bold">Log in</h1>
        <LogInForm setLoading={setLoading} loading={loading} />

        <div className="relative flex items-center">
          <div className="grow border-t divider-muted"></div>
          <span className="label-muted mx-4 text-sm">OR</span>
          <div className="grow border-t divider-muted"></div>
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
