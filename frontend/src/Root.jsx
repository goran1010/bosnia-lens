import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Fragment } from "react";

function Root() {
  return (
    <Fragment>
      <Navbar />
      <Outlet />
    </Fragment>
  );
}
export default Root;
