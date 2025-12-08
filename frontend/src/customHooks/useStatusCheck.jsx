import { useEffect } from "react";
import checkStatusAccessToken from "../utils/checkLogin/checkLoginAccessToken.js";
import checkStatusRefreshToken from "../utils/checkLogin/checkLoginRefreshToken.js";

export default function useStatusCheck(userData, setUserData, setLoading) {
  useEffect(() => {
    let isMounted = true;

    async function checkLogin() {
      try {
        const response = await checkStatusAccessToken(userData);
        const result = await response.json();

        if (!isMounted) return;

        if (!response.ok) {
          console.warn(result.error);

          const refreshResponse = await checkStatusRefreshToken();
          const refreshResult = await refreshResponse.json();

          if (!isMounted) return;

          if (!refreshResponse.ok) {
            return console.warn(refreshResult.error);
          }

          return setUserData((prev) => ({
            ...prev,
            accessToken: refreshResult.data.accessToken,
          }));
        }

        setUserData((prev) => ({
          ...prev,
          accessToken: result.data.accessToken,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkLogin();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
