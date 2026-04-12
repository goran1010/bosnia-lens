const currentURL = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken, clearCsrfToken } from "../../utils/getCsrfToken";

async function handleLogout(
  addNotification,
  navigate,
  setUserData,
  setLoading,
) {
  try {
    setLoading(true);
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

      clearCsrfToken();
      return;
    }

    addNotification({
      type: "error",
      message: result?.error?.message || result?.error || "Logout failed.",
    });
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while logging out.",
    });
    console.error("Error logging out:", err);
  } finally {
    setLoading(false);
  }
}

export { handleLogout };
