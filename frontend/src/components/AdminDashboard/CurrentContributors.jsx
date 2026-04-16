import { handleRemoveContributor } from "./utils/handleRemoveContributor";
import { useContext, useState } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Button } from "../sharedComponents/Button";
import { Spinner } from "../../utils/Spinner";

function CurrentContributors({
  currentContributors,
  setCurrentContributors,
  loading,
}) {
  const { addNotification } = useContext(NotificationContext);
  const [buttonLoading, setButtonLoading] = useState(false);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="panel-card p-3">
      <h2 className="text-md text-center font-semibold flex items-center gap-1 p-1 flex-1">
        <span
          aria-label="number of contributors"
          className="badge-primary px-2 py-1 rounded-full text-sm font-bold"
        >
          {currentContributors.length}
        </span>
        <span className="flex-1">Current Contributors</span>
      </h2>
      <ul className="space-y-3">
        {currentContributors.length > 0 ? (
          currentContributors.map((user) => (
            <li
              key={user.id}
              className="panel-subtle flex sm:items-center flex-col flex-wrap gap-3 p-3 transition-colors duration-200"
            >
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0 text-center justify-center lg:flex-col">
                <span className="font-bold text-lg break-all text-center">
                  {user.username}
                </span>
                <span className="label-muted break-all text-center">
                  {user.email}
                </span>
              </div>
              <div className="flex">
                <Button
                  className="btn-danger px-3 py-2 text-sm"
                  onClick={() =>
                    handleRemoveContributor(
                      user,
                      setCurrentContributors,
                      addNotification,
                      setButtonLoading,
                    )
                  }
                  type="submit"
                  loading={buttonLoading}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="label-muted italic text-center py-8 panel-subtle border-dashed">
            No contributors found
          </li>
        )}
      </ul>
    </section>
  );
}

export { CurrentContributors };
