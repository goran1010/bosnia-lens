import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Root() {
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
