import { handleRemoveContributor } from "../../utils/AdminDashboard/handleRemoveContributor";

function CurrentContributors({
  currentContributors,
  setCurrentContributors,
  addNotification,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mr-3">
            {currentContributors.length}
          </span>
          Current Contributors
        </h2>
      </div>
      <ul className="space-y-3">
        {currentContributors.length > 0 ? (
          currentContributors.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
            >
              <div className="flex-1">
                <span className="font-bold text-gray-800 text-lg">
                  {user.username}
                </span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-gray-600">{user.email}</span>
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
            No contributors found. Click refresh to load.
          </li>
        )}
      </ul>
    </div>
  );
}

export { CurrentContributors };
