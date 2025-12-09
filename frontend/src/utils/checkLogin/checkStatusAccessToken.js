export default async function checkStatusAccessToken() {
  try {
    const currentURL = import.meta.env.VITE_BACKEND_URL;

    return await fetch(`${currentURL}/auth/me`, {
      mode: "cors",
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
  }
}
