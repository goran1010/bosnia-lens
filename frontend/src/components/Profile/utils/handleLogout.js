const currentURL = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../../utils/getCsrfToken";

async function handleLogout(addNotification, navigate, setUserData) {
  try {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      addNotification({
        type: "error",
        message: "Failed to retrieve CSRF token.",
      });
      return;
    }

    const response = await fetch(`${currentURL}/users/logout`, {
      mode: "cors",
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
    });
    const result = await response.json();
    if (response.ok) {
      addNotification({
        type: "success",
        message: result.message,
      });
      navigate("/");
      setUserData(null);
      return;
    }

    addNotification({
      type: "error",
      message: result?.error || "Failed to log out.",
      details: result?.details?.[0]?.msg,
    });
  } catch (err) {
    addNotification({
      type: "error",
      message: err?.message || "An error occurred while logging out.",
    });
    console.error(err);
  }
}

export { handleLogout };
