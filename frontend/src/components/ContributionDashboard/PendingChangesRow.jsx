import { memo, useContext } from "react";
import { Button } from "../sharedComponents/Button";
import { Input } from "../sharedComponents/Input";
import { useState } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { handleRemove } from "./utils/handleRemove";

const PendingChangesRow = memo(
  ({ result, addNotification, setPendingChanges }) => {
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(UserDataContext);

    return (
      <form
        onSubmit={(e) =>
          handleRemove(
            e,
            result,
            userData,
            addNotification,
            setPendingChanges,
            setLoading,
          )
        }
        className="grid gap-2 w-full p-2 border border-gray-200 dark:border-gray-500 rounded-md sm:border-0 sm:rounded-none sm:p-1 sm:gap-1 sm:grid-cols-5"
      >
        <div className="flex justify-between sm:justify-center items-center">
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

        <div>
          <Button
            type="button"
            data-postalcode={result.code}
            data-city={result.city}
            data-post={result.post}
            className="w-full bg-red-600 py-2 text-white hover:bg-red-700"
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </form>
    );
  },
);

export { PendingChangesRow };
