import { useState, useRef, useContext } from "react";
import { checkPostalCodesValidity } from "./utils/checkPostalCodesValidity";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Spinner } from "../../utils/Spinner";

const currentURL = import.meta.env.VITE_BACKEND_URL;

function SearchPostalCode({ setSearchResult, loading, setLoading }) {
  loading = true;
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
      className="flex flex-col justify-center items-center gap-2"
    >
      <label
        htmlFor="search-term"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Search by Postal Code or Municipality
      </label>

      <div className="flex gap-2">
        <input
          ref={searchInput}
          autoFocus
          value={searchTerm}
          onChange={handleSearch}
          type="text"
          name="search-term"
          id="search-term"
        />
        <button
          type="submit"
          onClick={() => {
            checkPostalCodesValidity(searchInput);
          }}
          disabled={loading}
          className="disabled:bg-blue-300 disabled:text-gray-300 disabled:cursor-not-allowed relative flex justify-center items-center gap-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
        >
          <div className="h-100% w-100% flex justify-center items-center absolute">
            {loading && <Spinner />}
          </div>
          Search
        </button>
      </div>
    </form>
  );
}

export { SearchPostalCode };
