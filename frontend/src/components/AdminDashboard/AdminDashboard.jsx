import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { AdminForm } from "./AdminForm";

function AdminDashboard() {
  const { userData } = useContext(UserDataContext);

  if (userData?.role === "ADMIN") {
    return <AdminForm />;
  }
  return (
    <div className="relative min-h-full w-full flex items-center justify-center p-3">
      <div className="panel-card w-full max-w-6xl p-4 md:p-6 flex flex-col gap-4">
        <p className="label-muted text-center">
          {userData
            ? "You need to be an admin to see the admin dashboard."
            : "You need to be logged in and an admin to see the admin dashboard."}
        </p>
      </div>
    </div>
  );
}

export { AdminDashboard };
