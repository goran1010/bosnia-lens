import { useGetAllContributors } from "./customHooks/useGetAllContributors";
import { PendingRequests } from "./PendingRequests";
import { CurrentContributors } from "./CurrentContributors";

function AdminForm() {
  const { currentContributors, setCurrentContributors } =
    useGetAllContributors();

  return (
    <div className="flex flex-col gap-2 p-2 max-w-4xl dark:bg-gray-800 dark:text-white rounded shadow m-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white pb-2 border-b-2 border-gray-200 dark:border-gray-700">
        Admin Dashboard
      </h1>
      <PendingRequests setCurrentContributors={setCurrentContributors} />
      <CurrentContributors
        currentContributors={currentContributors}
        setCurrentContributors={setCurrentContributors}
      />
    </div>
  );
}
export { AdminForm };
