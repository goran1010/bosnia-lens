import { handleRemoveContributor } from "./utils/handleRemoveContributor";
import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";

function CurrentContributors({ currentContributors, setCurrentContributors }) {
  const { addNotification } = useContext(NotificationContext);

  return (
    <div className="text-gray-800 bg-white rounded-lg shadow-lg p-2 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      <h2 className="text-md text-center font-semibold flex items-center gap-1 p-1 flex-1">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
          {currentContributors.length}
        </span>
        <span className="flex-1">Current Contributors</span>
      </h2>
      <ul className="space-y-3">
        {currentContributors.length > 0 ? (
          currentContributors.map((user) => (
            <li
              key={user.id}
              className="flex items-center flex-wrap justify-between p-4  rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200 dark:border-blue-600 dark:hover:bg-blue-700"
            >
              <div className="flex-1 flex flex-wrap">
                <span className="font-bold text-gray-800 text-lg dark:text-white">
                  {user.username}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {user.email}
                </span>
              </div>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                onClick={() =>
                  handleRemoveContributor(
                    user,
                    setCurrentContributors,
                    addNotification,
                  )
                }
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No contributors found
          </li>
        )}
      </ul>
    </div>
  );
}

export { CurrentContributors };
