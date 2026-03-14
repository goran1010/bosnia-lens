import { useGetAllContributors } from "./customHooks/useGetAllContributors";
import { PendingRequests } from "./PendingRequests";
import { CurrentContributors } from "./CurrentContributors";

function AdminForm() {
  const { currentContributors, setCurrentContributors } =
    useGetAllContributors();

  return (
    <div className="relative min-h-full w-full flex items-center justify-center bg-gray-300 rounded-md p-3 dark:bg-gray-800">
      <section className="w-full max-w-6xl p-4 md:p-6 flex flex-col gap-4 bg-gray-400 border border-gray-300 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <h1 className="text-center text-2xl font-bold text-gray-800 dark:text-white pb-2 border-b-2 border-gray-300 dark:border-gray-600">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PendingRequests setCurrentContributors={setCurrentContributors} />
          <CurrentContributors
            currentContributors={currentContributors}
            setCurrentContributors={setCurrentContributors}
          />
        </div>
      </section>
    </div>
  );
}
export { AdminForm };
