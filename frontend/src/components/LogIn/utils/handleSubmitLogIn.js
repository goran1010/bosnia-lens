const currentUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken, clearCsrfToken } from "../../utils/getCsrfToken";

async function handleSubmitLogIn(
  e,
  inputFields,
  setUserData,
  addNotification,
  setLoading,
  navigate,
) {
  try {
    setLoading(true);
    e.preventDefault();

    const csrfToken = await getCsrfToken();

    if (!csrfToken) {
      addNotification({
        type: "error",
        message: "Failed to retrieve CSRF token.",
      });
      return;
    }

    const response = await fetch(`${currentUrl}/auth/login`, {
      mode: "cors",
      method: "POST",
      credentials: "include",
      headers: {
        "x-csrf-token": csrfToken,
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
        message: result?.message,
        details: result?.details[0]?.msg,
      });
      return;
    }
    addNotification({
      type: "success",
      message: result.message,
    });
    setUserData(result.data);

    clearCsrfToken();
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

export { handleSubmitLogIn };
