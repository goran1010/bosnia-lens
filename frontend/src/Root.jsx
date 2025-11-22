import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function Root() {
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch(`${URL}/auth/me`, {
          mode: "cors",
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          // eslint-disable-next-line no-console
          return console.error(data);
        }
        //   setUser(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    checkLogin();
  });

  return (
    <div className="h-screen flex flex-col min-w-130">
      <Navbar />
      <main className="flex flex-col flex-auto max-w-230 m-auto gap-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default Root;
