const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../../utils/getCsrfToken";

async function handleRemoveContributor(
  user,
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
      `${BACKEND_URL}/users/admin/remove-contributor/${user.id}`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      addNotification({
        type: "error",
        message: result.error,
        details: result.details?.[0].msg,
      });
      return;
    }

    setCurrentContributors((prev) =>
      prev.filter((contributor) => contributor.id !== user.id),
    );
    addNotification({
      type: "success",
      message: result.message,
    });
  } catch (error) {
    addNotification({
      type: "error",
      message: `Error removing ${user.username} from contributors.`,
    });
    console.error(`Error removing ${user.username} from contributors:`, error);
  } finally {
    setButtonLoading(false);
  }
}

export { handleRemoveContributor };
