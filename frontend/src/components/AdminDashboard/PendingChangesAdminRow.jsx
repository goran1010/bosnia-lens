import { memo } from "react";
import { Button } from "../sharedComponents/Button";
import { Input } from "../sharedComponents/Input";
import { useState } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { handleConfirm } from "./utils/handleConfirm";
import { handleDecline } from "./utils/handleDecline";

const PendingChangesAdminRow = memo(
  ({ result, addNotification, setPendingChanges }) => {
    const [loading, setLoading] = useState(false);

    return (
      <form className="">
        <div className="grid gap-2 w-full p-2 border border-gray-200 dark:border-gray-500 rounded-md sm:border-0 sm:rounded-none sm:p-1 sm:gap-1 sm:grid-cols-5">
          <div className="flex justify-between sm:justify-center items-center ">
            <span className="sm:hidden font-semibold">Change</span>
            <span>{result.typeOfChange}</span>
          </div>
          <div className="flex justify-between sm:justify-center items-center">
            <span className="sm:hidden font-semibold">Code</span>
            <span>{result.code}</span>
          </div>
          <div className="flex justify-between sm:justify-center items-center">
            <span className="sm:hidden font-semibold">City</span>
            <span>{result.city}</span>
          </div>
          <div className="flex justify-between sm:justify-center items-center">
            <span className="sm:hidden font-semibold">Post</span>
            <span>{result.post}</span>
          </div>
          <div className="flex justify-between sm:justify-center items-center">
            <span className="sm:hidden font-semibold">User</span>
            <span>{result.user.email}</span>
          </div>
        </div>

        <div className="flex justify-center sm:flex-row gap-2">
          <Button
            className="btn-success px-3 py-2 text-sm max-w-25"
            onClick={() => {
              handleConfirm(
                result,
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
            className="btn-danger px-3 py-2 text-sm max-w-25"
            onClick={() => {
              handleDecline(
                result,
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
