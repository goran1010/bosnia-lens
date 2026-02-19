const currentUrl = import.meta.env.VITE_BACKEND_URL;
import PostalCodes from "../PostalCodes/PostalCodes";
import { useState } from "react";

function ModifyDataset({ datasetSelect }) {
  const [searchResult, setSearchResult] = useState([]);
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

        setSearchResult(newResult);
      }
    } catch (err) {
      console.error(err);
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
              <input type="text" id="new-city" />
            </div>
            <div>
              <label htmlFor="new-code">Postal Code: </label>
              <input type="text" id="new-city" />
            </div>
            <div>
              <label htmlFor="new-post">Postal Carrier: </label>
              <input type="text" id="new-city" />
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
