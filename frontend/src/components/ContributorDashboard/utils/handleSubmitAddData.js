const currentUrl = import.meta.env.VITE_BACKEND_URL;
import { getCsrfToken } from "../../utils/getCsrfToken";
import { validateSubmitAddData } from "./validateSubmitAddData";

async function handleSubmitAddData(
  e,
  input,
  setSearchResult,
  addNotification,
  setLoading,
  cityInput,
  codeInput,
) {
  try {
    e.preventDefault();
    setLoading(true);
    const { city, code, post } = input;

    if (!validateSubmitAddData(cityInput, codeInput)) {
      return;
    }

    const csrfToken = await getCsrfToken();

    if (!csrfToken) {
      addNotification({
        type: "error",
        message: "Failed to retrieve CSRF token.",
      });
      return;
    }

    const response = await fetch(
      `${currentUrl}/users/contributor/postal-codes?city=${city}&code=${code}&post=${post}`,
      {
        mode: "cors",
        method: "post",
        credentials: "include",
        headers: { "x-csrf-token": csrfToken },
      },
    );
    const result = await response.json();
    if (response.ok) {
      addNotification({
        type: "success",
        message: result.message,
      });

      const newItem = result.data;

      setSearchResult((previous) =>
        [...previous, newItem].sort((a, b) => Number(a.code) - Number(b.code)),
      );
      return;
    }

    addNotification({
      type: "error",
      message: result.error,
      details: result.details?.[0]?.msg,
    });
  } catch (err) {
    console.error("Error adding postal code:", err);
    addNotification({
      type: "error",
      message: "Error occurred while adding the postal code.",
    });
  } finally {
    setLoading(false);
  }
}

export { handleSubmitAddData };
