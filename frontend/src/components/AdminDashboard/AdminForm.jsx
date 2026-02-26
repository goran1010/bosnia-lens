import { useContext } from "react";
import { NotificationContext } from "../../utils/NotificationContext";
import { useGetAllContributors } from "../../customHooks/AdminDashboard/useGetAllContributors";
import { PendingRequests } from "./PendingRequests";
import { CurrentContributors } from "./CurrentContributors";

function AdminForm() {
  const { addNotification } = useContext(NotificationContext);
  const { currentContributors, setCurrentContributors } =
    useGetAllContributors(addNotification);

  return (
    <div className="flex flex-col gap-10 p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200">
        Admin Dashboard
      </h1>
      <PendingRequests setCurrentContributors={setCurrentContributors} />
      <CurrentContributors
        currentContributors={currentContributors}
        setCurrentContributors={setCurrentContributors}
        addNotification={addNotification}
      />
    </div>
  );
}
export { AdminForm };
