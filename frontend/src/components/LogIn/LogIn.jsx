import { Link } from "react-router-dom";
import { useState } from "react";
import Spinner from "@goran1010/spinner";
import MessageCard from "../MessageCard.jsx";
import LogInForm from "./LogInForm.jsx";

export default function LogIn() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-full flex items-center justify-center bg-gray-50 ">
      <MessageCard />
      <div className="w-full max-w-md p-6 flex flex-col gap-3">
        <h1 className="text-5xl mb-8 text-center font-bold text-gray-900">
          Please log in
        </h1>
        <LogInForm setLoading={setLoading} />
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
          <div className="absolute left-1/2 -translate-x-1/2 h-12 bottom-0 translate-y-full">
            {loading && <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
}
