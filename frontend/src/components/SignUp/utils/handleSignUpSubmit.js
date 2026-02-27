const currentUrl = import.meta.env.VITE_BACKEND_URL;

async function handleSignUpSubmit(
  event,
  setLoading,
  inputFields,
  addNotification,
  navigate,
) {
  try {
    setLoading(true);
    event.preventDefault();

    const response = await fetch(`${currentUrl}/users/signup`, {
      mode: "cors",
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: inputFields.username,
        email: inputFields.email,
        password: inputFields.password,
        "confirm-password": inputFields["confirm-password"],
      }),
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
      message: "Registration successful! Please log in.",
    });
    navigate("/login");
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred during registration. Please try again.",
    });
    console.error(err);
  } finally {
    setLoading(false);
  }
}

export { handleSignUpSubmit };
