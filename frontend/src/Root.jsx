import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Root() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-col flex-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default Root;
