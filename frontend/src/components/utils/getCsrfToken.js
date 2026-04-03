const currentUrl = import.meta.env.VITE_BACKEND_URL;

let cachedToken = null;

async function getCsrfToken() {
  try {
    if (cachedToken) {
      return cachedToken;
    }
    const csrfResponse = await fetch(`${currentUrl}/csrf-token`, {
      mode: "cors",
      credentials: "include",
    });

    if (!csrfResponse.ok) {
      return null;
    }

    const { data: csrfToken } = await csrfResponse.json();
    cachedToken = csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw Error("Failed to fetch CSRF token");
  }
}

function clearCsrfToken() {
  cachedToken = null;
}

export { getCsrfToken, clearCsrfToken };
