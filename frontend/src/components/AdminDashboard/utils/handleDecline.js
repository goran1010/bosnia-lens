const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../../utils/getCsrfToken";

async function handleDecline(
  change,
  setPendingChanges,
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
      `${BACKEND_URL}/users/admin/decline-pending-change`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ id: change.id }),
        credentials: "include",
      },
    );
    const result = await response.json();

    if (response.ok) {
      setPendingChanges((prev) =>
        prev.filter((request) => request.id !== change.id),
      );
      addNotification({
        type: "success",
        message: result.message,
      });
      return;
    }
    addNotification({
      type: "error",
      message:
        result?.error?.message || result?.error || "Failed to decline request.",
    });
  } catch (error) {
    addNotification({
      type: "error",
      message: `Error declining ${change.user.email}'s request.`,
    });
    console.error(`Error declining ${change.user.email}'s request:`, error);
  } finally {
    setButtonLoading(false);
  }
}

export { handleDecline };
