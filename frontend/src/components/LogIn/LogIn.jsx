import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Spinner from "@goran1010/spinner";
import MessageCard from "../MessageCard.jsx";
import LogInForm from "./LogInForm.jsx";
import UserDataContext from "../../utils/UserDataContext";

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
