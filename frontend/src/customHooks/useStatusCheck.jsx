import { useEffect } from "react";
import checkStatusAccessToken from "../utils/checkLogin/checkLoginAccessToken.js";
import checkStatusRefreshToken from "../utils/checkLogin/checkLoginRefreshToken.js";

export default function useStatusCheck(userData, setUserData, setLoading) {
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await checkStatusAccessToken(userData);
        const result = await response.json();

        if (!response.ok) {
          console.warn(result.error);

          const refreshResponse = await checkStatusRefreshToken();
          const refreshResult = await refreshResponse.json();

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
        setLoading(false);
      }
    }

    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
