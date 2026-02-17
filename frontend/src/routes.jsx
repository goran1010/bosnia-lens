import Root from "./Root";
import ErrorPage from "./components/ErrorPage";
import PostalCodes from "./components/PostalCodes/PostalCodes";
import Home from "./components/Home/Home";
import Universities from "./components/Universities";
import Holidays from "./components/Holidays";
import LogIn from "./components/LogIn/LogIn";
import SignUp from "./components/SignUp/SignUp";
import { AdminDashboard } from "./components/AdminDashboard/AdminDashboard";

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <PostalCodes />,
        path: "postal-codes",
      },
      {
        element: <Holidays />,
        path: "holidays",
      },
      {
        element: <Universities />,
        path: "universities",
      },
      {
        element: <AdminDashboard />,
        path: "admin-dashboard",
      },
      {
        element: <LogIn />,
        path: "login",
      },
      {
        element: <SignUp />,
        path: "signup",
      },
    ],
  },
];

export default routes;
