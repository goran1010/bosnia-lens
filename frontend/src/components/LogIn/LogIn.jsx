import { Link } from "react-router-dom";
import { useState } from "react";
import { LogInForm } from "./LogInForm.jsx";

function LogIn() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-full flex items-center justify-center bg-gray-50 rounded-md dark:bg-gray-800">
      <div className="w-full max-w-md p-6 flex flex-col gap-3">
        <h1 className="text-5xl mb-8 text-center font-bold text-gray-900 dark:text-gray-100">
          Log in
        </h1>
        <LogInForm setLoading={setLoading} loading={loading} />

        <div className="relative flex items-center my-4">
          <div className="grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="mx-4 text-gray-500 text-sm dark:text-gray-400">
            OR
          </span>
          <div className="grow border-t border-gray-300 dark:border-gray-700"></div>
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
        </div>
      </div>
    </div>
  );
}

export { LogIn };
