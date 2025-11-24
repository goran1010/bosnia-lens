import { useEffect } from "react";

const currentURL = import.meta.env.VITE_BACKEND_URL;

export default function useStatusCheck(userData, setUserData, setLoading) {
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch(`${currentURL}/auth/me`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${userData?.accessToken}`,
          },
        });

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
  }, [userData?.accessToken, setLoading, setUserData]);
}
