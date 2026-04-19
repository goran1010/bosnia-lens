import { checkLoginFormClickValidity } from "./utils/checkLoginFormClickValidity";
import { checkLoginFormValidity } from "./utils/checkLoginFormValidity";
import { useRef, useState, useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contextData/NotificationContext";
import { handleSubmitLogIn } from "./utils/handleSubmitLogIn";
import { Button } from "../sharedComponents/Button";
import { Input } from "../sharedComponents/Input";
import { Label } from "../sharedComponents/Label";

function LogInForm({ loading, setLoading }) {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserDataContext);
  const { addNotification } = useContext(NotificationContext);

  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
  });

  const emailInput = useRef();
  const passwordInput = useRef();

  function handleInputFields(e) {
    checkLoginFormValidity(e.target.name, emailInput, passwordInput);
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
        <Label htmlFor="email">Email</Label>
        <Input
          value={inputFields.email}
          ref={emailInput}
          onChange={handleInputFields}
          type="email"
          name="email"
          id="email"
          autoComplete="email"
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
          autoComplete="current-password"
        />
      </div>
      <div>
        <Button
          onClick={() => checkLoginFormClickValidity(emailInput, passwordInput)}
          type="submit"
          loading={loading}
          className="text-white"
        >
          Log in
        </Button>
      </div>
    </form>
  );
}

export { LogInForm };
