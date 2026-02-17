import { useContext } from "react";
import UserDataContext from "../../utils/UserDataContext";

function AdminDashboard() {
  const { userData } = useContext(UserDataContext);

  if (userData?.isAdmin) return <div>Admin Dashboard</div>;

  return <div>User needs to an admin to see the dashboard.</div>;
}

export { AdminDashboard };
