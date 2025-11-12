import { useState } from "react";
const URL = import.meta.API_URL || "http://localhost:3000/postal-codes";

export default function PostalCodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  function handleSearch(e) {
    setSearchTerm(e.target.value);
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const response = await fetch(`${URL}?search=${searchTerm}`);
      const result = await response.json();

      if (!response.ok) {
        console.error(result);
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
        console.error(result);
      }
      console.log(result);
      setSearchResult(result);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <section className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="search-term"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Postal Code or Municipality
          </label>
          <div className="flex">
            <input
              autoFocus
              value={searchTerm}
              onChange={handleSearch}
              type="text"
              name="search-term"
              id="search-term"
              className="block border border-gray-300 rounded-md p-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
            >
              Search
            </button>
          </div>
        </form>
        <form onSubmit={handleGetAll}>
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 hover:cursor-pointer active:scale-98"
          >
            Get All
          </button>
        </form>
      </section>
      <section className="flex flex-col justify-center items-center">
        <h2>Postal codes & municipalities</h2>
        <div>
          {searchResult.map((result) => {
            return result;
          })}
        </div>
      </section>
    </>
  );
}
