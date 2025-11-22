import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import UserDataContext from "./utils/UserDataContext";
const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function Root() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch(`${URL}/auth/me`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "JWT " + userData?.accessToken,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          // eslint-disable-next-line no-console
          return console.error(data);
        }
        console.log(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    checkLogin();
  }),
    [userData];

  return (
    <UserDataContext value={{ userData, setUserData }}>
      <div className="h-screen flex flex-col min-w-130">
        <Navbar />
        <main className="flex flex-col flex-auto max-w-230 m-auto gap-5">
          <Outlet />
        </main>
        <Footer />
      </div>
    </UserDataContext>
  );
}
export default Root;
