import { Link } from "react-router-dom";
import { useState } from "react";
import Spinner from "@goran1010/spinner";
import LogInForm from "./LogInForm.jsx";

export default function LogIn() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-full flex items-center justify-center bg-gray-50 ">
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
