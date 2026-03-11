import { checkLoginFormClickValidity } from "./utils/checkLoginFormClickValidity";
import { checkLoginFormValidity } from "./utils/checkLoginFormValidity";
import { useRef, useState, useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contextData/NotificationContext";
import { handleSubmitLogIn } from "./utils/handleSubmitLogIn";
import { Spinner } from "../../utils/Spinner";

function LogInForm({ loading, setLoading }) {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserDataContext);
  const { addNotification } = useContext(NotificationContext);

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

  return (
    <form
      onSubmit={(e) =>
        handleSubmitLogIn(
          e,
          inputFields,
          setUserData,
          addNotification,
          setLoading,
          navigate,
        )
      }
      className="flex flex-col gap-3"
    >
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div>
        <button
          onClick={() =>
            checkLoginFormClickValidity(usernameInput, passwordInput)
          }
          type="submit"
          disabled={loading}
          className="btn-standard not-disabled:active:scale-95 w-full"
        >
          <div className="h-full w-full flex justify-center items-center absolute">
            {loading && <Spinner />}
          </div>
          Log in
        </button>
      </div>
    </form>
  );
}

export { LogInForm };
