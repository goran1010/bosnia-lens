import { handleRemoveContributor } from "./utils/handleRemoveContributor";
import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Button } from "../Button";

function CurrentContributors({ currentContributors, setCurrentContributors }) {
  const { addNotification } = useContext(NotificationContext);

  return (
    <section className="text-gray-800 bg-white rounded-lg shadow p-3 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      <h2 className="text-md text-center font-semibold flex items-center gap-1 p-1 flex-1">
        <span className="px-2 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          {currentContributors.length}
        </span>
        <span className="flex-1">Current Contributors</span>
      </h2>
      <ul className="space-y-3">
        {currentContributors.length > 0 ? (
          currentContributors.map((user) => (
            <li
              key={user.id}
              className="flex items-center flex-wrap justify-between gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                <span className="font-bold text-gray-800 text-lg dark:text-white break-all">
                  {user.username}
                </span>
                <span className="text-gray-600 dark:text-gray-200 break-all">
                  {user.email}
                </span>
              </div>
              <Button
                className="bg-red-600 px-3 py-2 text-sm hover:bg-red-700 disabled:bg-red-500 disabled:text-gray-200"
                onClick={() =>
                  handleRemoveContributor(
                    user,
                    setCurrentContributors,
                    addNotification,
                  )
                }
              >
                Remove
              </Button>
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No contributors found
          </li>
        )}
      </ul>
    </section>
  );
}

export { CurrentContributors };
