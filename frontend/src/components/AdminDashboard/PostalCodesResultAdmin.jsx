import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../utils/NotificationContext";

const currentUrl = import.meta.env.VITE_BACKEND_URL;

function PostalCodesResultAdmin({ searchResult, setSearchResult }) {
  // Refactor this component to improve performance
  // Now it re-creates entire array for each letter changed in input

  const [inputValues, setInputValues] = useState([]);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    setInputValues(searchResult || []);
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

  async function handleEdit(e) {
    try {
      e.preventDefault();
      const code = e.target.children[0].textContent;
      const city = e.target[0].value;
      const post = e.target[1].value;

      const response = await fetch(
        `${currentUrl}/admin/postal-codes/?city=${city}&code=${code}&post=${post}`,
        {
          mode: "cors",
          method: "put",
          credentials: "include",
        },
      );
      const result = await response.json();

      if (response.ok) {
        const filteredSearchResult = searchResult.map((row) => {
          if (row.code === Number(code)) {
            row.city = result.data.city;
            row.post = result.data.post;
          }
          return row;
        });
        setSearchResult(filteredSearchResult);
        addNotification({
          type: "success",
          message: `Postal code updated successfully!`,
        });
        return;
      }
      addNotification({
        type: "error",
        message: result.error,
        details: result.details[0].msg,
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "An error occurred while updating the postal code.",
      });
      console.error(err);
    }
  }

  async function handleDelete(e) {
    try {
      e.preventDefault();
      const code = e.target.dataset.postalcode;

      const response = await fetch(
        `${currentUrl}/admin/postal-codes/?code=${code}`,
        {
          mode: "cors",
          method: "delete",
          credentials: "include",
        },
      );
      const result = await response.json();

      if (response.ok) {
        const filteredSearchResult = searchResult.filter((row) => {
          return row.code !== Number(code);
        });
        setSearchResult(filteredSearchResult);
        addNotification({
          type: "success",
          message: `Postal code deleted successfully!`,
        });
        return;
      }
      addNotification({
        type: "error",
        message: result.error,
        details: result.details[0].msg,
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "An error occurred while deleting the postal code.",
      });
      console.error(err);
    }
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
        </li>
        {inputValues.map((result) => {
          return (
            <form
              onSubmit={handleEdit}
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
                  className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
                >
                  Save Edit
                </button>
              </div>
              <div>
                <button
                  type="button"
                  data-postalcode={result.code}
                  onClick={handleDelete}
                  className="bg-red-400 text-white p-2 rounded-md hover:bg-red-700 hover:cursor-pointer active:scale-98"
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

export { PostalCodesResultAdmin };
