const currentURL = import.meta.env.VITE_API_URL;

async function handleBecomeContributor(addNotification, setUserData) {
  try {
    const response = await fetch(`${currentURL}/users/become-contributor`, {
      mode: "cors",
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!response.ok) {
      addNotification({
        type: "error",
        message: result.error,
        details: result.details?.[0]?.msg,
      });
      return;
    }
    setUserData(result.data);
    addNotification({
      type: "success",
      message: result.message,
    });
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while requesting contributor status.",
    });
    console.error(err);
  }
}

export { handleBecomeContributor };
