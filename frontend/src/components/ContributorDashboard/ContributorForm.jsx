import { useState } from "react";
import { PostalCodeData } from "./PostalCodeData";

function ContributorForm() {
  const [datasetSelect, setDatasetSelect] = useState("");

  function handleDataset(e) {
    setDatasetSelect(e.target.value);
  }

  return (
    <div>
      <form>
        <label htmlFor="dataset">Choose dataset: </label>
        <select name="dataset" id="dataset" onChange={handleDataset}>
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
