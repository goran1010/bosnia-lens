import { useState, useRef, useContext } from "react";
import checkPostalCodesValidity from "../../utils/formValidation/checkPostalCodesValidity";
import UserDataContext from "../../utils/UserDataContext";

const currentURL = import.meta.env.VITE_BACKEND_URL;

export default function SearchPostalCode({ setSearchResult, setLoading }) {
  const { setMessage } = useContext(UserDataContext);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInput = useRef();

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
        setMessage([result.error, result.details]);
        return console.warn(result.error, result.details);
      }
      setSearchResult(result.data);
    } catch (err) {
      setMessage([err]);
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
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
        >
          Search
        </button>
      </div>
    </form>
  );
}
