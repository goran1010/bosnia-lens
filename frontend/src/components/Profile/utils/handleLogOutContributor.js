const currentURL = import.meta.env.VITE_BACKEND_URL;

async function handleLogoutContributor(addNotification, navigate, setUserData) {
  try {
    const response = await fetch(`${currentURL}/users/logout`, {
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
        details: result.details[0].msg,
      });
      return;
    }
    addNotification({
      type: "success",
      message: result.message,
    });
    navigate("/");
    setUserData(null);
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while logging out.",
    });
    console.error(err);
  }
}

export { handleLogoutContributor };
