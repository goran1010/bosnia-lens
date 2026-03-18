import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { AdminForm } from "./AdminForm";

function AdminDashboard() {
  const { userData } = useContext(UserDataContext);

  if (userData?.role === "ADMIN") {
    return <AdminForm />;
  }
  return (
    <div className="relative min-h-full w-full flex items-center justify-center bg-gray-50 rounded-md p-3 dark:bg-gray-800">
      <div className="w-full max-w-6xl p-4 md:p-6 flex flex-col gap-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <p className="text-center text-gray-700 dark:text-gray-200">
          {userData
            ? "You need to be an admin to see the admin dashboard."
            : "You need to be logged in and an admin to see the admin dashboard."}
        </p>
      </div>
    </div>
  );
}

export { AdminDashboard };
