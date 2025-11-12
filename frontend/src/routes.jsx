import Root from "./Root";
import ErrorPage from "./components/ErrorPage";
import PostalCodes from "./components/PostalCodes";
import Home from "./components/Home";

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
    ],
  },
];

export default routes;
