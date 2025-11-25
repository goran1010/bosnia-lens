import { Link } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import checkLoginFormValidity from "../utils/formValidation/checkLoginFormValidity";
import checkLoginFormClickValidity from "../utils/formValidation/checkLoginFormClickValidity";
import UserDataContext from "../utils/UserDataContext";
import Spinner from "@goran1010/spinner";
import useLogInForm from "../utils/handleForm/handleLogInForm";
import MessageCard from "./MessageCard.jsx";

export default function LogIn() {
  const { setUserData, message, setMessage } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);

  const [inputFields, setInputFields] = useState({
    username: "",
    password: "",
  });

  const usernameInput = useRef();
  const passwordInput = useRef();

  function handleInputFields(e) {
    checkLoginFormValidity(e.target.name, usernameInput, passwordInput);
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  }

  const handleSubmit = useLogInForm(
    setLoading,
    inputFields,
    setUserData,
    setMessage
  );

  return (
    <div className=" min-h-full flex items-center justify-center bg-gray-50 ">
      <div className=" relative w-full max-w-md p-6 flex flex-col gap-3">
        {message[0] && (
          <MessageCard message={message} setMessage={setMessage} />
        )}

        <h1 className="text-5xl mb-8 text-center font-bold text-gray-900">
          Please log in
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              value={inputFields.username}
              ref={usernameInput}
              onChange={handleInputFields}
              type="text"
              name="username"
              id="username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              ref={passwordInput}
              value={inputFields.password}
              onChange={handleInputFields}
              type="password"
              name="password"
              id="password"
            />
          </div>
          <div>
            <button
              onClick={() =>
                checkLoginFormClickValidity(usernameInput, passwordInput)
              }
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
            >
              Log in
            </button>
          </div>
        </form>
        <div>
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          {loading && <Spinner />}
        </div>
      </div>
    </div>
  );
}
