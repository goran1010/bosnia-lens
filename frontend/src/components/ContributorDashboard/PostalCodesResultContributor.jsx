import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../utils/NotificationContext";
import { handleEditContributor } from "./utils/handleEditContributor";
import { handleDeleteContributor } from "./utils/handleDeleteContributor";

function PostalCodesResultContributor({ searchResult, setSearchResult }) {
  const [inputValues, setInputValues] = useState([]);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    setInputValues(searchResult);
  }, [searchResult]);

  function handlePostChange(e) {
    const changedInput = inputValues.map((result) => {
      if (result.code === Number(e.target.dataset.code)) {
        result[e.target.name] = e.target.value;
      }
      return result;
    });

    setInputValues(changedInput);
  }

  function handleCityChange(e) {
    const changedInput = inputValues.map((result) => {
      if (result.code === Number(e.target.dataset.code)) {
        result[e.target.name] = e.target.value;
      }
      return result;
    });

    setInputValues(changedInput);
  }

  if (inputValues.length === 0) {
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
        {inputValues.map((result) => {
          return (
            <form
              onSubmit={(e) => {
                handleEditContributor(e, setSearchResult, addNotification);
              }}
              className="grid gap-1 w-full p-1 grid-cols-5"
              key={result.code}
            >
              <div className="flex justify-center items-center">
                {result.code}
              </div>
              <input
                name="city"
                type="text"
                value={result.city || ""}
                onChange={handleCityChange}
                data-code={result.code}
              />
              <input
                data-code={result.code}
                name="post"
                type="text"
                value={result.post || ""}
                onChange={handlePostChange}
              />
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-400 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
                >
                  Save
                </button>
              </div>
              <div>
                <button
                  type="button"
                  data-postalcode={result.code}
                  onClick={(e) => {
                    handleDeleteContributor(
                      e,
                      setSearchResult,
                      addNotification,
                    );
                  }}
                  className="w-full bg-red-400 text-white p-2 rounded-md hover:bg-red-700 hover:cursor-pointer active:scale-98"
                >
                  Delete
                </button>
              </div>
            </form>
          );
        })}
      </ul>
    </section>
  );
}

export { PostalCodesResultContributor };
