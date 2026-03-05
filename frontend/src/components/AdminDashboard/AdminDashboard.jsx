import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { AdminForm } from "./AdminForm";

function AdminDashboard() {
  const { userData } = useContext(UserDataContext);

  if (userData?.role === "ADMIN") {
    return (
      <>
        <AdminForm />
      </>
    );
  }
  return <>User needs to be an admin to see the dashboard.</>;
}

export { AdminDashboard };
