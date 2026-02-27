import { useState, useContext } from "react";
import { NotificationContext } from "../../utils/NotificationContext";
import { handleSubmitAddData } from "../../utils/ContributorDashboard/handleSubmitAddData";

function AddNewData({ setSearchResult }) {
  const [input, setInput] = useState({ city: "", code: "", post: "" });
  const { addNotification } = useContext(NotificationContext);

  function handleInput(e) {
    const newInput = { ...input };
    newInput[e.target.name] = e.target.value;
    setInput(newInput);
  }

  return (
    <form className="relative flex flex-col justify-center items-center gap-4 p-4">
      <div className="flex flex-col gap-4 border border-gray-300 rounded-md p-4 w-full max-w-md">
        <h2>Add new data row:</h2>
        <div>
          <label htmlFor="city">City name: </label>
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
          <label htmlFor="code">Postal Code: </label>
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
          <label htmlFor="post">Postal Carrier: </label>
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
            onClick={(e) =>
              handleSubmitAddData(e, input, setSearchResult, addNotification)
            }
            type="submit"
            className=" bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
          >
            Add row
          </button>
        </div>
      </div>
    </form>
  );
}

export { AddNewData };
