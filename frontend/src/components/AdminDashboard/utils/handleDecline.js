const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../../utils/getCsrfToken";

async function handleDecline(user, setPendingRequests, addNotification) {
  try {
    const csrfToken = await getCsrfToken();

    if (!csrfToken) {
      addNotification({
        type: "error",
        message: "Failed to retrieve CSRF token.",
      });
      return;
    }

    const response = await fetch(
      `${BACKEND_URL}/users/admin/decline-contributor/${user.id}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
      },
    );
    const data = await response.json();

    if (response.ok) {
      setPendingRequests((prev) =>
        prev.filter((request) => request._id !== user._id),
      );
      addNotification({
        type: "success",
        message: `User ${user.username}'s request declined.`,
      });
      return;
    }
    addNotification({
      type: "error",
      message: data.error,
      details: data.details?.[0]?.msg,
    });
  } catch (error) {
    addNotification({
      type: "error",
      message: `Failed to decline ${user.username}'s request.`,
    });
    console.error(`Error declining ${user.username}'s request:`, error);
  }
}

export { handleDecline };
