import checkLoginFormClickValidity from "../utils/formValidation/checkLoginFormClickValidity";
import useLogInForm from "../utils/handleForm/handleLogInForm";
import checkLoginFormValidity from "../utils/formValidation/checkLoginFormValidity";
import { useRef, useState } from "react";
import { useContext } from "react";
import UserDataContext from "../utils/UserDataContext";

export default function LogInForm({ setLoading }) {
  const { setUserData, setMessage } = useContext(UserDataContext);

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
