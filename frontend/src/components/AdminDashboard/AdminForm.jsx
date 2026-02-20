import { useState } from "react";
import { ModifyDataset } from "./ModifyDataset";

function AdminForm() {
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
        </select>
      </form>
      {datasetSelect ? (
        <ModifyDataset datasetSelect={datasetSelect} />
      ) : (
        <div>You need to select a dataset.</div>
      )}
    </div>
  );
}

export { AdminForm };
