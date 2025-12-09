export default async function checkStatusRefreshToken() {
  try {
    const currentURL = import.meta.env.VITE_BACKEND_URL;

    return await fetch(`${currentURL}/users/refresh-token`, {
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
