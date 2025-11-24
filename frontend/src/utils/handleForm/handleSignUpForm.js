const currentUrl = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from "react-router-dom";

export default function useSignUpForm(
  setLoading,
  setMessage,
  inputFields,
  message
) {
  const navigate = useNavigate();

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
          confirmPassword: inputFields["confirm-password"],
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        return console.warn(result.error, result.details);
      }
      setMessage([...message, result.message]);

      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
}
