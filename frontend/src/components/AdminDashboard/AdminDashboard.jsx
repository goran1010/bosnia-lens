import { useContext } from "react";
import UserDataContext from "../../utils/UserDataContext";
import { AdminForm } from "./AdminForm";

function AdminDashboard() {
  const { userData } = useContext(UserDataContext);

  if (userData?.isAdmin)
    return (
      <>
        <AdminForm />
      </>
    );

  return <>User needs to an admin to see the dashboard.</>;
}

export { AdminDashboard };
