import { useEffect } from "react";
import checkStatusAccessToken from "../utils/checkLogin/checkLoginAccessToken.js";
import checkStatusRefreshToken from "../utils/checkLogin/checkLoginRefreshToken.js";

export default function useStatusCheck(userData, setUserData, setLoading) {
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await checkStatusAccessToken(userData);
        await response.json();

        if (!response.ok) {
          const refreshResponse = await checkStatusRefreshToken();
          const refreshResult = await refreshResponse.json();

          if (!refreshResponse.ok) {
            console.error(refreshResult.error, refreshResult.details);
            return;
          }

          setUserData({
            ...userData,
            accessToken: refreshResult.data.accessToken,
          });
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
