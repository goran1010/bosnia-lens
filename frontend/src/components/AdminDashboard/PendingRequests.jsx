import { handleConfirm } from "./utils/handleConfirm";
import { handleDecline } from "./utils/handleDecline";
import { useGetPendingRequests } from "./customHooks/useGetPendingRequests";
import { useContext, useState } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Button } from "../sharedComponents/Button";
import { Spinner } from "../../utils/Spinner";

function PendingRequests({ setCurrentContributors }) {
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const { addNotification } = useContext(NotificationContext);
  const { pendingRequests, setPendingRequests } =
    useGetPendingRequests(setLoading);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="panel-card p-3">
      <h2 className="text-md text-center font-semibold flex items-center gap-1 p-1 flex-1">
        <span
          aria-label="pending requests count"
          className="badge-warning px-2 py-1 rounded-full text-sm font-bold"
        >
          {pendingRequests.length}
        </span>
        <span className="flex-1">Pending Requests</span>
      </h2>
      <ul className="space-y-3">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((user) => (
            <li
              key={user.id}
              className="panel-subtle flex sm:items-center flex-wrap flex-col justify-between gap-3 p-3 transition-colors duration-200"
            >
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0 lg:flex-col">
                <span className="font-bold text-lg break-all text-center">
                  {user.username}
                </span>
                <span className="label-muted break-all text-center">
                  {user.email}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="btn-success px-3 py-2 text-sm"
                  onClick={() => {
                    handleConfirm(
                      user,
                      setPendingRequests,
                      setCurrentContributors,
                      addNotification,
                      setButtonLoading,
                    );
                  }}
                  type="submit"
                  disabled={buttonLoading}
                >
                  <div className="h-full w-full flex justify-center items-center absolute">
                    {buttonLoading && <Spinner />}
                  </div>
                  <span className={`${buttonLoading ? "invisible" : "visible"}`}>Confirm</span>
                </Button>
                <Button
                  className="btn-danger px-3 py-2 text-sm"
                  onClick={() => {
                    handleDecline(
                      user,
                      setPendingRequests,
                      addNotification,
                      setButtonLoading,
                    );
                  }}
                  type="submit"
                  disabled={buttonLoading}
                >
                  <div className="h-full w-full flex justify-center items-center absolute">
                    {buttonLoading && <Spinner />}
                  </div>
                  <span className={`${buttonLoading ? "invisible" : "visible"}`}>Decline</span>
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="label-muted italic text-center py-8 panel-subtle border-dashed">
            No pending requests
          </li>
        )}
      </ul>
    </section>
  );
}

export { PendingRequests };
