import { handleConfirm } from "./utils/handleConfirm";
import { handleDecline } from "./utils/handleDecline";
import { useGetPendingChangesAdmin } from "./customHooks/useGetPendingChangesAdmin";
import { useContext, useState } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Button } from "../sharedComponents/Button";
import { Spinner } from "../../utils/Spinner";

function PendingChangesAdmin() {
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const { addNotification } = useContext(NotificationContext);
  const { pendingChanges, setPendingChanges } =
    useGetPendingChangesAdmin(setLoading);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="panel-card p-3">
      <h2 className="text-md text-center font-semibold flex items-center gap-1 p-1 flex-1">
        <span
          aria-label="pending changes count"
          className="badge-warning px-2 py-1 rounded-full text-sm font-bold"
        >
          {pendingChanges.length}
        </span>
        <span className="flex-1">Pending Changes</span>
      </h2>
      <ul className="space-y-3">
        {pendingChanges.length > 0 ? (
          pendingChanges.map((change) => (
            <li
              key={change.id}
              className="panel-subtle flex sm:items-center flex-wrap flex-col justify-between gap-3 p-3 transition-colors duration-200"
            >
              <div className="flex-1 flex sm:flex-row sm:items-center sm:gap-2 min-w-0">
                <span className="font-bold text-lg break-all text-center">
                  {change.typeOfChange}
                </span>
                <span className="text-lg break-all text-center">
                  {change.code}
                </span>
                <span className="text-lg break-all text-center">
                  {change.city}
                </span>
                <span className="text-lg break-all text-center">
                  {change.post}
                </span>
                <span className="font-bold text-lg break-all text-center">
                  {change.user.email}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="btn-success px-3 py-2 text-sm"
                  onClick={() => {
                    handleConfirm(
                      change,
                      setPendingChanges,
                      addNotification,
                      setButtonLoading,
                    );
                  }}
                  type="submit"
                  loading={buttonLoading}
                >
                  Confirm
                </Button>
                <Button
                  className="btn-danger px-3 py-2 text-sm"
                  onClick={() => {
                    handleDecline(
                      change,
                      setPendingChanges,
                      addNotification,
                      setButtonLoading,
                    );
                  }}
                  type="submit"
                  loading={buttonLoading}
                >
                  Decline
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="label-muted italic text-center py-8 panel-subtle border-dashed">
            No pending changes
          </li>
        )}
      </ul>
    </section>
  );
}

export { PendingChangesAdmin };
