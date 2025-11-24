export default async function checkStatusRefreshToken() {
  const currentURL = import.meta.env.VITE_BACKEND_URL;

  await fetch(`${currentURL}/users/refresh-token`, {
    mode: "cors",
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
