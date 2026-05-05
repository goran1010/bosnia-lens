import { memo, useContext } from "react";
import { Button } from "../sharedComponents/Button";
import { Input } from "../sharedComponents/Input";
import { useState } from "react";
import { handleEdit } from "./utils/handleEdit";
import { handleDelete } from "./utils/handleDelete";
import { UserDataContext } from "../../contextData/UserDataContext";

const PostalCodeRow = memo(
  ({ result, handleInputChange, addNotification, setPendingChanges }) => {
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(UserDataContext);

    const handleEditForm = (e) => {
      handleEdit(e, addNotification, setLoading, setPendingChanges, userData);
    };

    const handleDeleteForm = (e) => {
      handleDelete(e, addNotification, setLoading, setPendingChanges, userData);
    };
    return (
      <form
        onSubmit={handleEditForm}
        className="grid gap-2 w-full p-2 border border-gray-200 dark:border-gray-500 rounded-md sm:border-0 sm:rounded-none sm:p-1 sm:gap-1 sm:grid-cols-5"
      >
        <div className="flex justify-between sm:justify-center items-center">
          <span className="sm:hidden font-semibold">Code</span>
          <span>{result.code}</span>
        </div>
        <Input
          name="city"
          type="text"
          value={result.city || ""}
          onChange={(e) =>
            handleInputChange(result.code, e.target.name, e.target.value)
          }
          data-code={result.code}
          aria-label={`City for postal code ${result.code}`}
        />
        <Input
          data-code={result.code}
          name="post"
          type="text"
          value={result.post || ""}
          onChange={(e) =>
            handleInputChange(result.code, e.target.name, e.target.value)
          }
          aria-label={`Post office for postal code ${result.code}`}
        />
        <div>
          <Button
            type="submit"
            className="w-full py-2 text-white"
            loading={loading}
          >
            Save
          </Button>
        </div>
        <div>
          <Button
            type="button"
            data-postalcode={result.code}
            data-city={result.city}
            data-post={result.post}
            onClick={handleDeleteForm}
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

export { PostalCodeRow };
