import { useEffect } from "react";
import checkStatusAccessToken from "../utils/checkLoginAccessToken.js";

const currentURL = import.meta.env.VITE_BACKEND_URL;

export default function useStatusCheck(userData, setUserData, setLoading) {
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await checkStatusAccessToken(userData);
        await response.json();

        if (!response.ok) {
          const refreshResponse = await fetch(
            `${currentURL}/users/refresh-token`,
            {
              mode: "cors",
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const refreshResult = await refreshResponse.json();

          if (!refreshResponse.ok) {
            console.error(refreshResult.error, refreshResult.details);
            return;
          }

          setUserData((prev) => ({
            ...prev,
            accessToken: refreshResult.data.accessToken,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, [userData, setLoading, setUserData]);
}
