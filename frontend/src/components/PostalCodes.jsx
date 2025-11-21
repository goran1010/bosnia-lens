import { useState, useRef } from "react";
import checkPostalCodesValidity from "../utils/checkPostalCodesValidity";
const URL = import.meta.API_URL || "http://localhost:3000/postal-codes";

export default function PostalCodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const searchInput = useRef();

  function handleSearch(e) {
    checkPostalCodesValidity(searchInput);
    setSearchTerm(e.target.value);
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const response = await fetch(`${URL}/${searchTerm}`);
      const result = await response.json();

      if (!response.ok) {
        return console.error(result);
      }
      console.log(result);
      setSearchResult(result);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGetAll(e) {
    try {
      e.preventDefault();

      const response = await fetch(`${URL}`);
      const result = await response.json();

      if (!response.ok) {
        return console.error(result);
      }
      console.log(result);
      setSearchResult(result);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <section className="flex flex-col justify-center items-center gap-4 p-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-2"
        >
          <label
            htmlFor="search-term"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Postal Code or Municipality
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
        <form onSubmit={handleGetAll}>
          <button
            type="submit"
            className="bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700 hover:cursor-pointer active:scale-98"
          >
            Get All Postal Codes and Municipalities
          </button>
        </form>
      </section>
      <section className="flex flex-col justify-center items-center">
        <h2>Postal codes & municipalities</h2>
        <ul className="flex flex-col border">
          {searchResult &&
            searchResult.map((result) => {
              return (
                <li
                  className="flex flex-1 justify-between items-center"
                  key={result.postalCode}
                >
                  <div>{result.municipality}</div>
                  <div>{result.postalCode}</div> <div>{result.entity}</div>
                </li>
              );
            })}
        </ul>
      </section>
    </>
  );
}
