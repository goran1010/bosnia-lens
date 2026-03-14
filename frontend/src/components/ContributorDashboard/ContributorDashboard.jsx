import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { ContributorForm } from "./ContributorForm";

function ContributorDashboard() {
  const { userData } = useContext(UserDataContext);

  if (userData?.role === "CONTRIBUTOR" || userData?.role === "ADMIN") {
    return <ContributorForm />;
  }
  return (
    <section className="relative min-h-full w-full flex items-center justify-center bg-gray-50 rounded-md p-3 dark:bg-gray-800 dark:text-white">
      <p className="text-center text-gray-700 dark:text-gray-200">
        User needs to be a contributor to see the dashboard.
      </p>
    </section>
  );
}

export { ContributorDashboard };
