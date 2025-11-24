import { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import checkFormValidity from "../utils/formValidation/checkFormValidity";
import checkFormValidityClick from "../utils/formValidation/checkFormValidityClick";
import UserDataContext from "../utils/UserDataContext";
import Spinner from "@goran1010/spinner";
const currentUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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

  const navigator = useNavigate();

  async function handleSubmit(event) {
    try {
      setLoading(true);
      event.preventDefault();

      const response = await fetch(`${currentUrl}/users/signup`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputFields.username,
          email: inputFields.email,
          password: inputFields.password,
          confirmPassword: inputFields["confirm-password"],
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return console.error(result.error, result.details);
      }
      setMessage([...message, result.message]);

      navigator("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" min-h-full flex items-center justify-center bg-gray-50 ">
      <div className=" relative w-full max-w-md p-6 flex flex-col gap-3">
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
