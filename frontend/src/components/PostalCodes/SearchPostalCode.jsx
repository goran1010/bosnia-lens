import { useState, useRef, useContext } from "react";
import { checkPostalCodesValidity } from "./utils/checkPostalCodesValidity";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Spinner } from "../../utils/Spinner";
import { Button } from "../Button";

const currentURL = import.meta.env.VITE_BACKEND_URL;

function SearchPostalCode({ setSearchResult, loading, setLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInput = useRef();
  const { addNotification } = useContext(NotificationContext);

  function handleSearch(e) {
    checkPostalCodesValidity(searchInput);
    setSearchTerm(e.target.value);
  }

  async function handleSubmit(e) {
    try {
      setLoading(true);
      e.preventDefault();

      const response = await fetch(
        `${currentURL}/api/v1/postal-codes/search?searchTerm=${searchTerm}`,
      );
      const result = await response.json();

      if (!response.ok) {
        addNotification({
          type: "error",
          message: result.error,
          details: result.details?.[0]?.msg,
        });
        return;
      }
      addNotification({
        type: "success",
        message: "Postal codes retrieved successfully.",
      });
      setSearchResult(result.data);
    } catch (err) {
      addNotification({
        type: "error",
        message: "An error occurred while searching for postal codes.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center gap-2 w-full"
    >
      <label
        htmlFor="search-term"
        className="block text-sm font-medium text-gray-700 dark:text-white"
      >
        Search by Postal Code or Municipality
      </label>

      <div className="flex gap-2 w-full max-w-xl flex-wrap sm:flex-nowrap">
        <input
          ref={searchInput}
          value={searchTerm}
          onChange={handleSearch}
          type="text"
          name="search-term"
          id="search-term"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500 flex-1"
        />
        <Button
          type="submit"
          onClick={() => {
            checkPostalCodesValidity(searchInput);
          }}
          disabled={loading}
          className="sm:w-auto "
        >
          <div className="h-full w-full flex justify-center items-center absolute">
            {loading && <Spinner />}
          </div>
          Search
        </Button>
      </div>
    </form>
  );
}

export { SearchPostalCode };
