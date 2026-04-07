const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../../utils/getCsrfToken";

async function handleConfirm(
  user,
  setPendingRequests,
  setCurrentContributors,
  addNotification,
  setButtonLoading,
) {
  try {
    setButtonLoading(true);
    const csrfToken = await getCsrfToken();

    if (!csrfToken) {
      addNotification({
        type: "error",
        message: "Failed to retrieve CSRF token.",
      });
      return;
    }

    const response = await fetch(
      `${BACKEND_URL}/users/admin/add-contributor/`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ userId: user.id }),
        credentials: "include",
      },
    );
    const result = await response.json();

    if (response.ok) {
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== user.id),
      );
      setCurrentContributors((prev) => [...prev, user]);
      addNotification({
        type: "success",
        message: result.message,
      });
      return;
    }
    addNotification({
      type: "error",
      message: result.error,
      details: result.details?.[0]?.msg,
    });
  } catch (error) {
    addNotification({
      type: "error",
      message: `Error promoting ${user.username} to contributor.`,
    });
    console.error(`Error promoting ${user.username} to contributor:`, error);
  } finally {
    setButtonLoading(false);
  }
}

export { handleConfirm };
