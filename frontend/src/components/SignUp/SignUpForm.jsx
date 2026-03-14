import { checkFormValidity } from "./utils/checkFormValidity";
import { checkFormValidityClick } from "./utils/checkFormValidityClick";
import { handleSignUpSubmit } from "./utils/handleSignUpSubmit";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Spinner } from "../../utils/Spinner";
import { Button } from "../Button";
import { Input } from "../Input";

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
        <Input
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
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Email
        </label>
        <Input
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
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Password
        </label>
        <Input
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
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Confirm Password
        </label>
        <Input
          ref={confirmPasswordInput}
          value={inputFields["confirm-password"]}
          onChange={handleInputFields}
          type="password"
          name="confirm-password"
          id="confirm-password"
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
