const currentUrl = import.meta.env.VITE_BACKEND_URL;

async function getCsrfToken() {
  const csrfResponse = await fetch(`${currentUrl}/csrf-token`, {
    mode: "cors",
    credentials: "include",
  });

  if (!csrfResponse.ok) return null;

  const { data: csrfToken } = await csrfResponse.json();
  return csrfToken;
}

export { getCsrfToken };
