const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let cachedToken = null;

async function getCsrfToken() {
  try {
    if (cachedToken) {
      return cachedToken;
    }
    const csrfResponse = await fetch(`${BACKEND_URL}/csrf-token`, {
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
    throw new Error("Failed to fetch CSRF token");
  }
}

function clearCsrfToken() {
  cachedToken = null;
}

export { getCsrfToken, clearCsrfToken };
