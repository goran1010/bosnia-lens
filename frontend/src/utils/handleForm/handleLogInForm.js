const currentUrl = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from "react-router-dom";

export default function useSignUpForm(setLoading, inputFields, setUserData) {
  const navigate = useNavigate();

  return async function handleSubmit(e) {
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
        return console.warn(result.error, result.details);
      }

      setUserData(result.data);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
}
