const currentUrl = import.meta.env.VITE_BACKEND_URL;

async function handleSubmitLogIn(
  e,
  inputFields,
  setUserData,
  addNotification,
  setLoading,
  navigate,
) {
  try {
    setLoading(true);
    e.preventDefault();

    const response = await fetch(`${currentUrl}/users/login`, {
      mode: "cors",
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: inputFields.username,
        password: inputFields.password,
      }),
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
    addNotification({
      type: "success",
      message: "Logged in successfully!",
    });
    setUserData(result.data);
    navigate("/");
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while logging in.",
    });
    console.error(err);
  } finally {
    setLoading(false);
  }
}

export { handleSubmitLogIn };
