import { checkLoginFormClickValidity } from "../../utils/formValidation/checkLoginFormClickValidity";
import { checkLoginFormValidity } from "../../utils/formValidation/checkLoginFormValidity";
import { useRef, useState, useContext } from "react";
import { UserDataContext } from "../../utils/UserDataContext";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../utils/NotificationContext";
import { handleSubmitLogIn } from "./utils/handleSubmitLogIn";

function LogInForm({ setLoading }) {
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
      className="flex flex-col gap-5"
    >
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
  );
}

export { LogInForm };
