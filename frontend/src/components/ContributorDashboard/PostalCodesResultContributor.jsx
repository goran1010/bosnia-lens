import { useCallback, useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { handleEditContributor } from "./utils/handleEditContributor";
import { handleDeleteContributor } from "./utils/handleDeleteContributor";
import { PostalCodeRow } from "./PostalCodeRow";

function PostalCodesResultContributor({ searchResult, setSearchResult }) {
  const [inputValuesByCode, setInputValuesByCode] = useState({});
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    const nextValuesByCode = {};
    searchResult.forEach((result) => {
      nextValuesByCode[result.code] = result;
    });
    setInputValuesByCode(nextValuesByCode);
  }, [searchResult]);

  const handleInputChange = useCallback((code, name, value) => {
    setInputValuesByCode((prev) => {
      const current = prev[code] || { code };
      return {
        ...prev,
        [code]: { ...current, [name]: value },
      };
    });
  }, []);

  const handleEdit = useCallback(
    (e) => {
      handleEditContributor(e, setSearchResult, addNotification);
    },
    [setSearchResult, addNotification],
  );

  const handleDelete = useCallback(
    (e) => {
      handleDeleteContributor(e, setSearchResult, addNotification);
    },
    [setSearchResult, addNotification],
  );

  if (searchResult.length === 0) {
    return (
      <section className="flex justify-center items-center p-4">
        <p className="text-gray-500">No results to display.</p>
      </section>
    );
  }
  return (
    <section className="flex flex-col justify-center items-center">
      <ul className=" min-w-m max-w-4xl max-h-96 overflow-y-auto border border-gray-300 rounded-md p-2">
        <li className="grid gap-1 w-full p-2 border border-gray-300 rounded-md mb-4 grid-cols-5 font-bold">
          <div>Code</div>
          <div>City</div>
          <div>Post</div>
          <div>Save</div>
          <div>Delete</div>
        </li>
        {searchResult.map((result) => {
          const rowValue = inputValuesByCode[result.code] || result;
          return (
            <PostalCodeRow
              key={result.code}
              result={rowValue}
              onChange={handleInputChange}
              onSubmit={handleEdit}
              onDelete={handleDelete}
            />
          );
        })}
      </ul>
    </section>
  );
}

export { PostalCodesResultContributor };
