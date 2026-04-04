const currentURL = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../../utils/getCsrfToken";

async function handleBecomeContributor(
  addNotification,
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

    const response = await fetch(`${currentURL}/users/become-contributor`, {
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
      setUserData(result.data);
      addNotification({
        type: "success",
        message: result.message,
      });
      return;
    }
    addNotification({
      type: "error",
      message: result?.error || "Failed to request contributor status.",
      details: result?.details?.[0]?.msg,
    });
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while requesting contributor status.",
    });
    console.error(err);
  } finally {
    setLoading(false);
  }
}

export { handleBecomeContributor };
