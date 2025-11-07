import Root from "./Root";
import ErrorPage from "./components/ErrorPage";

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
