import { checkFormValidity } from "./utils/checkFormValidity";
import { checkFormValidityClick } from "./utils/checkFormValidityClick";
import { handleSignUpSubmit } from "./utils/handleSignUpSubmit";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Spinner } from "../../utils/Spinner";
import { Button } from "../Button";

function SignUpForm({ loading, setLoading }) {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const usernameInput = useRef();
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();
  const emailInput = useRef();

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
      emailInput,
    );

    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) =>
        handleSignUpSubmit(
          e,
          setLoading,
          inputFields,
          addNotification,
          navigate,
        )
      }
    >
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
        />
      </div>
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
        />
      </div>
      <div>
        <Button
          onClick={() =>
            checkFormValidityClick(
              usernameInput,
              passwordInput,
              confirmPasswordInput,
              emailInput,
            )
          }
          type="submit"
          disabled={loading}
        >
          <div className="h-full w-full flex justify-center items-center absolute">
            {loading && <Spinner />}
          </div>
          Create
        </Button>
      </div>
    </form>
  );
}

export { SignUpForm };
