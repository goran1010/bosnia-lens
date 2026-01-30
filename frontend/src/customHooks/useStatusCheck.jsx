import { useEffect } from "react";
import checkStatusAccessToken from "../utils/checkLogin/checkStatusAccessToken.js";
import checkStatusRefreshToken from "../utils/checkLogin/checkStatusRefreshToken.js";

export default function useStatusCheck(setUserData, setLoading) {
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    let isMounted = true;

    async function checkLogin() {
      try {
        const response = await checkStatusAccessToken(accessToken);
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

          localStorage.setItem("accessToken", refreshResult.data.accessToken);
          return setUserData(refreshResult.data.user);
        }

        setUserData(result.data);
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
