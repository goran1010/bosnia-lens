import { useState } from "react";
import { PostalCodeData } from "./PostalCodeData";

function ContributorForm() {
  const [datasetSelect, setDatasetSelect] = useState("");

  function handleDataset(e) {
    setDatasetSelect(e.target.value);
  }

  return (
    <div className="flex flex-col items-center flex-1">
      <form className="p-2 flex items-center">
        <label htmlFor="dataset">Choose dataset: </label>
        <select
          name="dataset"
          id="dataset"
          onChange={handleDataset}
          className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded cursor-pointer"
        >
          <option default value="">
            Select a dataset
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
