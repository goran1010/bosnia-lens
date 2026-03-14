import { checkLoginFormClickValidity } from "./utils/checkLoginFormClickValidity";
import { checkLoginFormValidity } from "./utils/checkLoginFormValidity";
import { useRef, useState, useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contextData/NotificationContext";
import { handleSubmitLogIn } from "./utils/handleSubmitLogIn";
import { Spinner } from "../../utils/Spinner";
import { Button } from "../sharedComponents/Button";
import { Input } from "../sharedComponents/Input";
import { Label } from "../sharedComponents/Label";

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
        <Label htmlFor="username">Username</Label>
        <Input
          value={inputFields.username}
          ref={usernameInput}
          onChange={handleInputFields}
          type="text"
          name="username"
          id="username"
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
        <Button
          onClick={() =>
            checkLoginFormClickValidity(usernameInput, passwordInput)
          }
          type="submit"
          disabled={loading}
        >
          <div className="h-full w-full flex justify-center items-center absolute">
            {loading && <Spinner />}
          </div>
          Log in
        </Button>
      </div>
    </form>
  );
}

export { LogInForm };
