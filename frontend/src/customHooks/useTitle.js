import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const availableRoutes = {
  "/": "Home - Bosnia Lens",
  "/home": "Home - Bosnia Lens",
  "/holidays": "Holidays - Bosnia Lens",
  "/universities": "Universities - Bosnia Lens",
  "/postal-codes": "Postal Codes - Bosnia Lens",
  "/contributor-dashboard": "Contributor Dashboard - Bosnia Lens",
  "/admin-dashboard": "Admin Dashboard - Bosnia Lens",
  "/profile": "Profile - Bosnia Lens",
  "/login": "Log In - Bosnia Lens",
  "/signup": "Sign Up - Bosnia Lens",
};

function useTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    if (availableRoutes[path]) {
      document.title = availableRoutes[path];
    } else {
      document.title = "404 Error - Bosnia Lens";
    }
  }, [location]);
}

export { useTitle };
