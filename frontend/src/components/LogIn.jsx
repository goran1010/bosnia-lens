import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import checkLoginFormValidity from "../utils/checkLoginFormValidity";
import checkLoginFormClickValidity from "../utils/checkLoginFormClickValidity";
const currentUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function LogIn() {
  //   const { setUser } = useOutletContext();
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

  const navigate = useNavigate();

  async function handleSubmit(e) {
    try {
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
      const data = await response.json();
      if (!response.ok) {
        return console.log(data);
      }
      //   setUser(data);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <main className="min-h-full flex items-center justify-center bg-gray-50 ">
      <div className="w-full max-w-md p-6 flex flex-col gap-3">
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
      </div>
    </main>
  );
}
