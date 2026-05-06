import { memo } from "react";
import { Button } from "../sharedComponents/Button";
import { Input } from "../sharedComponents/Input";
import { useState } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { handleConfirm } from "./utils/handleConfirm";
import { handleDecline } from "./utils/handleDecline";

const PendingChangesAdminRow = memo(
  ({ change, addNotification, setPendingChanges }) => {
    const [loading, setLoading] = useState(false);

    return (
      <form className="border border-gray-200 dark:border-gray-500 rounded-md">
        <div className="grid gap-2 w-full p-1 sm:p-1 sm:gap-1 sm:grid-cols-5">
          <div className="flex justify-between sm:justify-center items-center ">
            <span className="sm:hidden font-semibold">Change</span>
            <span>{change.typeOfChange}</span>
          </div>
          <div className="flex justify-between sm:justify-center items-center flex-wrap gap-1">
            <span className="sm:hidden font-semibold">Code</span>
            <span>{change.code}</span>
          </div>
          <div className="flex justify-between sm:justify-center items-center flex-wrap gap-1">
            <span className="sm:hidden font-semibold">City</span>
            <span>{change.city}</span>
          </div>
          <div className="flex justify-between sm:justify-center items-center flex-wrap gap-1">
            <span className="sm:hidden font-semibold">Post</span>
            <span>{change.post}</span>
          </div>
          <div className="flex justify-between sm:justify-center items-center flex-wrap gap-1">
            <span className="sm:hidden font-semibold">User</span>
            <span className="break-all">{change.user.email}</span>
          </div>
        </div>

        <div className="flex justify-center sm:flex-row gap-2 p-1">
          <Button
            className="btn-success px-3 py-2 text-sm sm:max-w-25"
            onClick={() => {
              handleConfirm(
                change,
                setPendingChanges,
                addNotification,
                setLoading,
              );
            }}
            type="submit"
            loading={loading}
          >
            Confirm
          </Button>
          <Button
            className="btn-danger px-3 py-2 text-sm sm:max-w-25"
            onClick={() => {
              handleDecline(
                change,
                setPendingChanges,
                addNotification,
                setLoading,
              );
            }}
            type="submit"
            loading={loading}
          >
            Decline
          </Button>
        </div>
      </form>
    );
  },
);

export { PendingChangesAdminRow };
