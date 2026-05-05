import { useGetPendingChangesAdmin } from "./customHooks/useGetPendingChangesAdmin";
import { useContext, useState } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Button } from "../sharedComponents/Button";
import { Spinner } from "../../utils/Spinner";
import { PendingChangesAdminRow } from "./PendingChangesAdminRow";

function PendingChangesAdmin() {
  const [loading, setLoading] = useState(true);

  const { addNotification } = useContext(NotificationContext);
  const { pendingChanges, setPendingChanges } =
    useGetPendingChangesAdmin(setLoading);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="panel-card p-3 w-full max-w-4xl">
      <h2 className="text-md text-center font-semibold flex items-center gap-1 p-1 flex-1">
        <span
          aria-label="pending changes count"
          className="badge-warning px-2 py-1 rounded-full text-sm font-bold"
        >
          {pendingChanges.length}
        </span>
        <span className="flex-1">Pending Changes</span>
      </h2>
      {pendingChanges.length > 0 ? (
        <section className="flex flex-col justify-center items-center p-1 w-full">
          <ul className="w-full max-w-4xl flex flex-col border border-gray-400 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 gap-1">
            <li className="hidden sm:grid sm:gap-1 text-center w-full p-2 border border-gray-400 dark:border-gray-600 rounded-md font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-600 sm:grid-cols-5">
              <div>Change</div>
              <div>Code</div>
              <div>City</div>
              <div>Post</div>
              <div>User</div>
            </li>
            {pendingChanges.map((result) => {
              return (
                <PendingChangesAdminRow
                  key={result.id}
                  change={result}
                  addNotification={addNotification}
                  setPendingChanges={setPendingChanges}
                />
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="flex flex-col justify-center items-center p-1 w-full">
          <p className="text-gray-600 dark:text-gray-300">
            There are no pending changes at the moment.
          </p>
        </section>
      )}
    </section>
  );
}

export { PendingChangesAdmin };
