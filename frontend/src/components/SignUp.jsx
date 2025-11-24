import { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import checkFormValidity from "../utils/formValidation/checkFormValidity";
import checkFormValidityClick from "../utils/formValidation/checkFormValidityClick";
import UserDataContext from "../utils/UserDataContext";
import Spinner from "@goran1010/spinner";
import useSignUpForm from "../utils/handleForm/handleSignUpForm";

export default function SignUp() {
  const [loading, setLoading] = useState(false);

  const usernameInput = useRef();
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();
  const emailInput = useRef();

  const { setMessage, message } = useContext(UserDataContext);

  const [inputFields, setInputFields] = useState({
    username: "",
    email: "",
    password: "",
    ["confirm-password"]: "",
  });

  const handleSubmit = useSignUpForm(setLoading, setMessage, inputFields);

  function handleInputFields(e) {
    checkFormValidity(
      e.target.name,
      usernameInput,
      passwordInput,
      confirmPasswordInput,
      emailInput
    );

    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  }

  return (
    <div className=" min-h-full flex items-center justify-center bg-gray-50 ">
      <div className=" relative w-full max-w-md p-6 flex flex-col gap-3">
        {message[0] && (
          <div className="relative">
            <div className=" p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 border border-blue-300">
              <div className="mb-1 last:mb-0">
                <h2 className="text-2xl">{message[0]}</h2>
                {message[1] && (
                  <p>
                    {message[1].map((element) => {
                      return <li>{element.msg}</li>;
                    })}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setMessage([])}
              className="absolute top-1 right-1 text-blue-800 hover:text-blue-900"
              aria-label="Close message"
            >
              <svg
                className="cursor-pointer w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        <div>
          <h1 className="text-5xl mb-8 text-center font-bold text-gray-900">
            Create your account
          </h1>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              ref={usernameInput}
              value={inputFields.username}
              onChange={handleInputFields}
              type="text"
              name="username"
              id="username"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              ref={emailInput}
              value={inputFields.email}
              onChange={handleInputFields}
              type="email"
              name="email"
              id="email"
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
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              ref={confirmPasswordInput}
              value={inputFields["confirm-password"]}
              onChange={handleInputFields}
              type="password"
              name="confirm-password"
              id="confirm-password"
            />
          </div>
          <div>
            <button
              onClick={() =>
                checkFormValidityClick(
                  usernameInput,
                  passwordInput,
                  confirmPasswordInput,
                  emailInput
                )
              }
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
            >
              Create
            </button>
          </div>
        </form>
        <div>
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          {loading && <Spinner />}
        </div>
      </div>
    </div>
  );
}
