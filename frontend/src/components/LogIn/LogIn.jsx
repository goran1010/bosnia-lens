import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Spinner from "@goran1010/spinner";
import MessageCard from "../MessageCard.jsx";
import LogInForm from "./LogInForm.jsx";
import UserDataContext from "../../utils/UserDataContext";

//Need to rework to not use new window

export default function LogIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserData, setMessage } = useContext(UserDataContext);

  useEffect(() => {
    const handleMessage = (event) => {
      // Verify origin
      if (event.origin !== import.meta.env.VITE_BACKEND_URL) {
        return;
      }

      if (event.data.type === "github-auth-success") {
        const { accessToken, user, message } = event.data.data;
        setUserData([{ accessToken, user }]);
        setMessage(["Success!", [message]]);
        navigate("/");
      } else if (event.data.type === "github-auth-error") {
        setMessage(["Authentication failed", [event.data.error]]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, setUserData, setMessage]);

  const handleGitHubLogin = () => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/auth/github`,
      "GitHub Login",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  };

  return (
    <div className="relative min-h-full flex items-center justify-center bg-gray-50 ">
      <MessageCard />
      <div className="w-full max-w-md p-6 flex flex-col gap-3">
        <h1 className="text-5xl mb-8 text-center font-bold text-gray-900">
          Please log in
        </h1>
        <LogInForm setLoading={setLoading} />

        <div className="relative flex items-center my-4">
          <div className="grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGitHubLogin}
          type="button"
          className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center gap-3 font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              clipRule="evenodd"
            />
          </svg>
          Log in with GitHub
        </button>

        <div className="relative mt-4">
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
          <div className="absolute left-1/2 -translate-x-1/2 h-12 bottom-0 translate-y-full">
            {loading && <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
}
