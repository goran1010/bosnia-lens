const currentUrl = import.meta.env.VITE_BACKEND_URL;

import checkLoginFormClickValidity from "../../utils/formValidation/checkLoginFormClickValidity";
import checkLoginFormValidity from "../../utils/formValidation/checkLoginFormValidity";
import { useRef, useState, useContext } from "react";
import UserDataContext from "../../utils/UserDataContext";
import { useNavigate } from "react-router-dom";
import NotificationContext from "../../utils/NotificationContext";

export default function LogInForm({ setLoading }) {
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

  async function handleSubmit(e) {
    try {
      setLoading(true);
      e.preventDefault();

      const response = await fetch(`${currentUrl}/users/login`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputFields.username,
          password: inputFields.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        addNotification({
          type: "error",
          message: result.error,
        });
        return;
      }
      addNotification({
        type: "success",
        message: result.message,
      });
      setUserData(result.data);
      navigate("/");
    } catch (err) {
      addNotification({
        type: "error",
        message: "An error occurred while logging in.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
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
  );
}
