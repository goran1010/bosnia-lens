import { useState, useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { handleSubmitAddData } from "./utils/handleSubmitAddData";
import { Spinner } from "../../utils/Spinner";

function AddNewData({ setSearchResult, loading, setLoading }) {
  const [input, setInput] = useState({ city: "", code: "", post: "" });
  const { addNotification } = useContext(NotificationContext);

  function handleInput(e) {
    const newInput = { ...input };
    newInput[e.target.name] = e.target.value;
    setInput(newInput);
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <form className="relative flex flex-col justify-center items-center gap-2 p-2 w-full">
      <button
        className="btn-standard"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close form" : "Add new data"}
      </button>
      {isOpen && (
        <div className="flex flex-col gap-2 border border-gray-300 rounded-md p-2 w-full max-w-lg">
          <div>
            <label htmlFor="city">City name: </label>
            <input
              type="text"
              id="city"
              name="city"
              value={input.city}
              onChange={handleInput}
              required
              className="input-standard"
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
              className="input-standard"
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
              className="input-standard"
            />
          </div>
          <div>
            <button
              onClick={(e) =>
                handleSubmitAddData(
                  e,
                  input,
                  setSearchResult,
                  addNotification,
                  setLoading,
                )
              }
              type="button"
              disabled={loading}
              className="btn-standard not-disabled:active:scale-95 w-full"
            >
              <div className="h-full w-full flex justify-center items-center absolute">
                {loading && <Spinner />}
              </div>
              Add row
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export { AddNewData };
