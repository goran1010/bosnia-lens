const currentUrl = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import NotificationContext from "../utils/NotificationContext";

export default function useSignUpForm(setLoading, inputFields) {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  return async function handleSubmit(event) {
    try {
      setLoading(true);
      event.preventDefault();

      const response = await fetch(`${currentUrl}/users/signup`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputFields.username,
          email: inputFields.email,
          password: inputFields.password,
          "confirm-password": inputFields["confirm-password"],
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
        message: "Registration successful! Please log in.",
      });
      navigate("/login");
    } catch (err) {
      addNotification({
        type: "error",
        message: "An error occurred during registration. Please try again.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
}
