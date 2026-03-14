import { useState } from "react";
import { PostalCodeData } from "./PostalCodeData";

function ContributorForm() {
  const [datasetSelect, setDatasetSelect] = useState("");

  function handleDataset(e) {
    setDatasetSelect(e.target.value);
  }

  return (
    <div className="flex flex-col items-center flex-1 w-full">
      <form className="p-2 flex items-center gap-2 flex-wrap justify-center">
        <label htmlFor="dataset" className="text-nowrap">
          Choose dataset:{" "}
        </label>
        <select
          name="dataset"
          id="dataset"
          onChange={handleDataset}
          className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded cursor-pointer border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option default value="">
            No dataset
          </option>
          <option value="postal-codes">Postal Codes</option>
          <option value="holidays">Holidays</option>
          <option value="universities">Universities</option>
        </select>
      </form>
      {datasetSelect === "postal-codes" && <PostalCodeData />}
      {datasetSelect === "holidays" && "Holidays"}
      {datasetSelect === "universities" && "Universities"}
      {datasetSelect === "" && <div>You need to select a dataset.</div>}
    </div>
  );
}

export { ContributorForm };
