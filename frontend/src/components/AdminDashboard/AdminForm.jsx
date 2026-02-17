import { useState } from "react";

function AdminForm() {
  const [datasetSelect, setDatasetSelect] = useState("");

  function handleDataset(e) {
    setDatasetSelect(e.target.value);
  }

  return (
    <form>
      <div>
        <label htmlFor="dataset">Choose dataset: </label>
        <select name="dataset" id="dataset" onChange={handleDataset}>
          <option default value="">
            Select a dataset
          </option>
          <option value="postal-codes">Postal Codes</option>
          <option value="holidays">Holidays</option>
        </select>
      </div>
      {datasetSelect ? (
        <div>Hey</div>
      ) : (
        <div>You need to select a dataset.</div>
      )}
    </form>
  );
}

export { AdminForm };
