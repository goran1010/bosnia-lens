const currentUrl = import.meta.env.VITE_BACKEND_URL;
import { PostalCodes } from "../PostalCodes/PostalCodes";
import { useState, useContext } from "react";
import { NotificationContext } from "../../utils/NotificationContext";

function ModifyDataset({ datasetSelect }) {
  // Refactor this component to improve performance

  const [searchResult, setSearchResult] = useState([]);
  const [input, setInput] = useState({ city: "", code: "", post: "" });
  const { addNotification } = useContext(NotificationContext);

  function handleInput(e) {
    const newInput = { ...input };
    newInput[e.target.name] = e.target.value;
    setInput(newInput);
  }

  async function handleCreateData(e) {
    try {
      e.preventDefault();
      const [city, postalCode, postalCarrier] = e.target;

      const response = await fetch(
        `${currentUrl}/admin/postal-codes?city=${city.value}&code=${postalCode.value}&post=${postalCarrier.value}`,
        {
          mode: "cors",
          method: "post",
          credentials: "include",
        },
      );
      const result = await response.json();

      if (response.ok) {
        const newResult = [...searchResult];
        newResult.unshift(result.data);
        addNotification({
          type: "success",
          message: "Data added successfully",
        });
        return setSearchResult(newResult);
      }
      addNotification({
        type: "error",
        message: result.error,
        details: result.details[0].msg,
      });
    } catch (err) {
      console.error(err);
      addNotification({
        type: "error",
        message: "An unexpected error occurred",
      });
    }
  }

  if (datasetSelect === "postal-codes")
    return (
      <>
        <form onSubmit={handleCreateData}>
          <div>
            <h2>Add new data row:</h2>
            <div>
              <label htmlFor="new-city">City name: </label>
              <input
                type="text"
                id="city"
                name="city"
                value={input.city}
                onChange={handleInput}
                required
              />
            </div>
            <div>
              <label htmlFor="new-code">Postal Code: </label>
              <input
                type="text"
                id="code"
                name="code"
                value={input.code}
                onChange={handleInput}
                maxLength={5}
                minLength={5}
                required
              />
            </div>
            <div>
              <label htmlFor="new-post">Postal Carrier: </label>
              <input
                type="text"
                id="post"
                name="post"
                value={input.post}
                onChange={handleInput}
              />
            </div>
            <div>
              <button
                type="submit"
                className=" bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
              >
                Add row
              </button>
            </div>
          </div>
        </form>
        <div>
          <h2>View and edit all data:</h2>
          <PostalCodes
            searchResult={searchResult}
            setSearchResult={setSearchResult}
          />
        </div>
      </>
    );

  if (datasetSelect === "holidays") return <form>{datasetSelect}</form>;
}

export { ModifyDataset };
