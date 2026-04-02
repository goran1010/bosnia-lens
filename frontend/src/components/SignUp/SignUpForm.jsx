import { checkFormValidity } from "./utils/checkFormValidity";
import { checkFormValidityClick } from "./utils/checkFormValidityClick";
import { handleSignUpSubmit } from "./utils/handleSignUpSubmit";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Spinner } from "../../utils/Spinner";
import { Button } from "../sharedComponents/Button";
import { Input } from "../sharedComponents/Input";
import { Label } from "../sharedComponents/Label";

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
        <Label htmlFor="username">Username</Label>
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
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="password">Password</Label>
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
        <Label htmlFor="confirm-password">Confirm Password</Label>
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
          className="text-white"
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
