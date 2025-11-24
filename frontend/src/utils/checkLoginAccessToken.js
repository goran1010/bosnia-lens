export default async function checkStatusAccessToken(userData) {
  const currentURL = import.meta.env.VITE_BACKEND_URL;

  await fetch(`${currentURL}/auth/me`, {
    mode: "cors",
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${userData?.accessToken}`,
    },
  });
}
