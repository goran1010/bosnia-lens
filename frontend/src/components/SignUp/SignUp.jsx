import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "@goran1010/spinner";
import MessageCard from "../MessageCard.jsx";
import UserDataContext from "../../utils/UserDataContext.js";
import SignUpForm from "./SignUpForm.jsx";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const { message, setMessage } = useContext(UserDataContext);

  return (
    <div className="relative min-h-full flex items-center justify-center bg-gray-50 ">
      <MessageCard message={message} setMessage={setMessage} />
      <div className="w-full max-w-md p-6 flex flex-col gap-3">
        <div>
          <h1 className="text-5xl mb-8 text-center font-bold text-gray-900">
            Create your account
          </h1>
        </div>
        <SignUpForm setLoading={setLoading} />
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
          <div className="absolute left-1/2 -translate-x-1/2 h-12 bottom-0 translate-y-full">
            {loading && <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
}
