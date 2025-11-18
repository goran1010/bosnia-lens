import Root from "./Root";
import ErrorPage from "./components/ErrorPage";
import PostalCodes from "./components/PostalCodes";
import Home from "./components/Home";
import Universities from "./components/Universities";
import Holidays from "./components/Holidays";
import LogIn from "./components/LogIn";

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
        element: <LogIn />,
        path: "login",
      },
    ],
  },
];

export default routes;
