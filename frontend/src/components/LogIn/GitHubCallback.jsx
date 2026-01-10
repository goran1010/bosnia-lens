import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "@goran1010/spinner";
import UserDataContext from "../../utils/UserDataContext";

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserData, setMessage } = useContext(UserDataContext);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const successData = searchParams.get("success");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      let errorMessage = "Authentication failed";

      if (error === "no_code") {
        errorMessage = "No authorization code received";
      } else if (error === "no_token") {
        errorMessage = "Failed to obtain access token from GitHub";
      } else if (error === "no_email") {
        errorMessage = "No email associated with GitHub account";
      } else {
        errorMessage = decodeURIComponent(error);
      }

      setMessage(["Authentication failed", errorMessage]);
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (successData) {
      try {
        const data = JSON.parse(decodeURIComponent(successData));
        setUserData([{ accessToken: data.accessToken, user: data.user }]);
        setStatus("success");
        setMessage([
          "Success!",
          data.message || "Successfully authenticated with GitHub",
        ]);
        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        console.error("Failed to parse success data:", err);
        setStatus("error");
        setMessage(["Error", "Failed to process authentication data"]);
        setTimeout(() => navigate("/login"), 3000);
      }
    } else {
      setStatus("error");
      setMessage(["Error", "No authentication data received"]);
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [searchParams, navigate, setUserData, setMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === "loading" && (
          <>
            <Spinner />
            <p className="mt-4 text-gray-600">Authenticating with GitHub...</p>
          </>
        )}
        {status === "success" && (
          <div className="text-green-600">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-xl font-medium">Successfully authenticated!</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
          </div>
        )}
        {status === "error" && (
          <div className="text-red-600">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-xl font-medium">Authentication failed</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
