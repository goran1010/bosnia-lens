const currentUrl = import.meta.env.VITE_BACKEND_URL;
import PostalCodes from "../PostalCodes/PostalCodes";

function ModifyDataset({ datasetSelect }) {
  async function handleCreateData(e) {
    try {
      e.preventDefault();
      const [city, postalCode, postalCarrier] = e.target;

      const response = await fetch(
        `${currentUrl}/admin/postal-codes?city=${city.value}&code=${postalCode.value}&post=${postalCarrier.value}`,
        {
          mode: "cors",
          method: "post",
        },
      );
      const result = await response.json();

      console.log(result);
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
              <label htmlFor="new-data-row">City name: </label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="new-data-row">Postal Code: </label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="new-data-row">Postal Carrier: </label>
              <input type="text" />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
              >
                Add row
              </button>
            </div>
          </div>
        </form>
        <div>
          <h2>View and edit all data:</h2>
          <PostalCodes />
        </div>
      </>
    );

  if (datasetSelect === "holidays") return <form>{datasetSelect}</form>;
}

export { ModifyDataset };
