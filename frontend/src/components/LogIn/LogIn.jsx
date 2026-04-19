import { Link, useSearchParams } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogInForm } from "./LogInForm.jsx";
import { UserDataContext } from "../../contextData/UserDataContext.js";
import { NotificationContext } from "../../contextData/NotificationContext.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function LogIn() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (searchParams.get("error") === "github") {
      addNotification({
        type: "error",
        message: "GitHub login failed. Please try again.",
      });
    }
  }, [searchParams, addNotification]);

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
    <div className="panel-card relative min-h-full w-full max-w-xl mx-auto flex items-center justify-center p-4 sm:p-5">
      <div className="w-full max-w-md p-1 sm:p-2 flex flex-col gap-4">
        <h1 className="text-3xl text-center font-bold">Log in</h1>
        <LogInForm setLoading={setLoading} loading={loading} />

        <div className="relative flex items-center">
          <div className="grow border-t divider-muted"></div>
          <span className="label-muted mx-4 text-sm">OR</span>
          <div className="grow border-t divider-muted"></div>
        </div>

        <a
          href={`${BACKEND_URL}/auth/github`}
          className="btn-primary w-full relative inline-flex items-center justify-center rounded-md p-2 text-sm cursor-pointer gap-2 text-white"
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Continue with GitHub
        </a>

        <div className="relative flex items-center">
          <div className="grow border-t divider-muted"></div>
          <span className="label-muted mx-4 text-sm">OR</span>
          <div className="grow border-t divider-muted"></div>
        </div>

        <div className="relative">
          <p className="text-center">
            Don't have an account ? Go to the{" "}
            <Link className="hover:underline font-bold" to={"/signup"}>
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
