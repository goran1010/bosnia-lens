import { useGetAllContributors } from "./customHooks/useGetAllContributors";
import { PendingRequests } from "./PendingRequests";
import { CurrentContributors } from "./CurrentContributors";
import { useState } from "react";

function AdminForm() {
  const [loading, setLoading] = useState(true);
  const { currentContributors, setCurrentContributors } =
    useGetAllContributors(setLoading);

  return (
    <div className="relative min-h-full w-full flex items-center justify-center p-3">
      <section className="panel-card w-full max-w-6xl p-4 md:p-6 flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold pb-2 border-b-2 divider-muted">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PendingRequests setCurrentContributors={setCurrentContributors} />
          <CurrentContributors
            currentContributors={currentContributors}
            setCurrentContributors={setCurrentContributors}
            loading={loading}
          />
        </div>
      </section>
    </div>
  );
}
export { AdminForm };
