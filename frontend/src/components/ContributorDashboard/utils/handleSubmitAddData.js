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
    const { city, code, post } = input;

    if (!validateSubmitAddData(cityInput, codeInput)) return;

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
        message: "Data added successfully",
      });
      return setSearchResult((previous) =>
        [...previous, result.data].sort((a, b) => a.code - b.code),
      );
    }
    addNotification({
      type: "error",
      message: result.error,
      details: result.details?.[0]?.msg,
    });
  } catch (err) {
    console.error(err);
    addNotification({
      type: "error",
      message: "An unexpected error occurred",
    });
  } finally {
    setLoading(false);
  }
}

export { handleSubmitAddData };
