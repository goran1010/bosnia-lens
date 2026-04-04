import { Root } from "./Root";
import { ErrorPage } from "./components/ErrorPage";
import { PostalCodes } from "./components/PostalCodes/PostalCodes";
import { Home } from "./components/Home/Home";
import { Universities } from "./components/Universities";
import { LogIn } from "./components/LogIn/LogIn";
import { SignUp } from "./components/SignUp/SignUp";
import { ContributorDashboard } from "./components/ContributorDashboard/ContributorDashboard";
import { AdminDashboard } from "./components/AdminDashboard/AdminDashboard";
import { Profile } from "./components/Profile/Profile";

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
        element: <Home />,
        path: "/home",
      },
      {
        element: <PostalCodes />,
        path: "postal-codes",
      },
      {
        element: <Universities />,
        path: "universities",
      },
      {
        element: <ContributorDashboard />,
        path: "contributor-dashboard",
      },
      {
        element: <AdminDashboard />,
        path: "admin-dashboard",
      },
      { element: <Profile />, path: "profile" },
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

export { routes };
