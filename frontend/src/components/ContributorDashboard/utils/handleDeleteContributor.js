const currentUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../../utils/getCsrfToken";

async function handleDeleteContributor(
  e,
  setSearchResult,
  addNotification,
  setLoading,
) {
  try {
    e.preventDefault();
    setLoading(true);
    const code = e.target.parentElement.dataset.postalcode;

    const csrfToken = await getCsrfToken();

    if (!csrfToken) {
      addNotification({
        type: "error",
        message: "Failed to retrieve CSRF token.",
      });
      return;
    }

    const response = await fetch(
      `${currentUrl}/users/contributor/postal-codes/?code=${code}`,
      {
        mode: "cors",
        method: "DELETE",
        credentials: "include",
        headers: {
          "x-csrf-token": csrfToken,
        },
      },
    );
    const result = await response.json();

    if (response.ok) {
      setSearchResult((previousState) =>
        previousState.filter((item) => item.code !== result.data.code),
      );
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
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while deleting the postal code.",
    });
    console.error("Error deleting postal code:", err);
  } finally {
    setLoading(false);
  }
}

export { handleDeleteContributor };
