const currentUrl = import.meta.env.VITE_BACKEND_URL;

async function handleSubmitAddData(e, input, setSearchResult, addNotification) {
  try {
    e.preventDefault();
    const { city, code, post } = input;

    const response = await fetch(
      `${currentUrl}/contributor/postal-codes?city=${city}&code=${code}&post=${post}`,
      {
        mode: "cors",
        method: "post",
        credentials: "include",
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
      details: result.details[0].msg,
    });
  } catch (err) {
    console.error(err);
    addNotification({
      type: "error",
      message: "An unexpected error occurred",
    });
  }
}

export { handleSubmitAddData };
