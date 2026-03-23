import { useState } from "react";
import { PostalCodeData } from "./PostalCodeData";
import { Select } from "../sharedComponents/Select";

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
        <Select
          name="dataset"
          id="dataset"
          onChange={handleDataset}
          className="bg-gray-200 dark:bg-gray-800"
        >
          <option default value="">
            No dataset
          </option>
          <option value="postal-codes">Postal Codes</option>
          <option value="holidays">Holidays</option>
          <option value="universities">Universities</option>
        </Select>
      </form>
      {datasetSelect === "postal-codes" && <PostalCodeData />}
      {datasetSelect === "holidays" && "Holidays placeholder"}
      {datasetSelect === "universities" && "Universities placeholder"}
      {datasetSelect === "" && <div>You need to select a dataset.</div>}
    </div>
  );
}

export { ContributorForm };
