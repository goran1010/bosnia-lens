import { useState } from "react";
import { Link } from "react-router-dom";
import { SignUpForm } from "./SignUpForm";

function SignUp() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-full flex items-center justify-center bg-gray-50 rounded-md dark:bg-gray-800">
      <div className="w-full max-w-md p-4 flex flex-col gap-3">
        <div>
          <h1 className="text-3xl text-center font-bold text-gray-900 dark:text-gray-100">
            Create your account
          </h1>
        </div>
        <SignUpForm setLoading={setLoading} loading={loading} />
        <div className="relative flex items-center my-4">
          <div className="grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="mx-4 text-gray-500 text-sm dark:text-gray-400">
            OR
          </span>
          <div className="grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative">
          <p className="text-center">
            Already have an account ? Go back to the{" "}
            <Link
              className="text-blue-600 hover:underline font-bold"
              to={"/login"}
            >
              Log In
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}

export { SignUp };
