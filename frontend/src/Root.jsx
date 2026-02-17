import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer";
import { useState } from "react";
import UserDataContext from "./utils/UserDataContext";
import Spinner from "@goran1010/spinner";
import useStatusCheck from "./customHooks/useStatusCheck.jsx";

function Root() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(true);

  useStatusCheck(setUserData, setLoading);

  return (
    <UserDataContext value={{ userData, setUserData, message, setMessage }}>
      <>
        <Navbar />
        <main className="relative flex flex-col flex-auto max-w-230 m-auto gap-5">
          {loading ? <Spinner /> : <Outlet />}
        </main>
        <Footer />
      </>
    </UserDataContext>
  );
}

export default Root;
