import { useState, useContext, useRef } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { handleSubmitAddData } from "./utils/handleSubmitAddData";
import { Spinner } from "../../utils/Spinner";
import { validateAddData } from "./utils/validateAddData";
import { Button } from "../Button";

function AddNewData({ setSearchResult, loading, setLoading }) {
  const [input, setInput] = useState({ city: "", code: "", post: "" });
  const { addNotification } = useContext(NotificationContext);

  const cityInput = useRef();
  const codeInput = useRef();

  function handleInput(e) {
    const newInput = { ...input };
    newInput[e.target.name] = e.target.value;
    validateAddData(e);
    setInput(newInput);
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <form className="relative flex flex-col justify-center items-center gap-2 p-2">
      <Button type="button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close form" : "Add new data"}
      </Button>
      {isOpen && (
        <div className="flex flex-col gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-3 w-full max-w-md mx-auto">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            >
              City name:
            </label>
            <input
              ref={cityInput}
              type="text"
              id="city"
              name="city"
              value={input.city}
              onChange={handleInput}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            >
              Postal Code:
            </label>
            <input
              ref={codeInput}
              type="text"
              id="code"
              name="code"
              value={input.code}
              onChange={handleInput}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="post"
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            >
              Postal Carrier:
            </label>
            <input
              type="text"
              id="post"
              name="post"
              value={input.post}
              onChange={handleInput}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
            />
          </div>
          <div className="flex justify-center items-center">
            <Button
              onClick={(e) =>
                handleSubmitAddData(
                  e,
                  input,
                  setSearchResult,
                  addNotification,
                  setLoading,
                  cityInput,
                  codeInput,
                )
              }
              type="button"
              disabled={loading}
            >
              <div className="h-full flex justify-center items-center absolute">
                {loading && <Spinner />}
              </div>
              Add data
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}

export { AddNewData };
