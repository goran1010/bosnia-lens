const currentUrl = import.meta.env.VITE_BACKEND_URL;

async function getCsrfToken() {
  try {
    const csrfResponse = await fetch(`${currentUrl}/csrf-token`, {
      mode: "cors",
      credentials: "include",
    });

    if (!csrfResponse.ok) {
      return null;
    }

    const { data: csrfToken } = await csrfResponse.json();
    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw Error("Failed to fetch CSRF token");
  }
}

export { getCsrfToken };
