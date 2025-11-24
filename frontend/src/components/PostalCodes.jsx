import { useState, useRef, useContext } from "react";
import checkPostalCodesValidity from "../utils/formValidation/checkPostalCodesValidity";
import Spinner from "@goran1010/spinner";
import UserDataContext from "../utils/UserDataContext";

const URL = import.meta.env.VITE_BACKEND_URL;

export default function PostalCodes() {
  const { message, setMessage } = useContext(UserDataContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchInput = useRef();

  function handleSearch(e) {
    checkPostalCodesValidity(searchInput);
    setSearchTerm(e.target.value);
  }

  async function handleSubmit(e) {
    try {
      setLoading(true);
      e.preventDefault();

      const response = await fetch(`${URL}/api/v1/postal-codes/${searchTerm}`);
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

  async function handleGetAll(e) {
    try {
      setLoading(true);
      e.preventDefault();

      const response = await fetch(`${URL}/api/v1/postal-codes`, {
        mode: "cors",
      });
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
      <div>{loading && <Spinner />}</div>
      {message[0] && (
        <div className="relative">
          <div className=" p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 border border-blue-300">
            <div className="mb-1 last:mb-0">
              <h2 className="text-2xl">{message[0]}</h2>
              {message[1] && message?.length > 0 && (
                <p>
                  {message[1].map((element) => {
                    return <li>{element.msg}</li>;
                  })}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setMessage([])}
            className="absolute top-1 right-1 text-blue-800 hover:text-blue-900"
            aria-label="Close message"
          >
            <svg
              className="cursor-pointer w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
      <section className="flex flex-col justify-center items-center">
        <ul className="flex flex-col">
          {searchResult &&
            searchResult.map((result) => {
              return (
                <li
                  className="flex flex-1 justify-between items-center"
                  key={result.code}
                >
                  <div>{result.place}</div>
                  <div>{result.code}</div> <div>{result.entity}</div>
                </li>
              );
            })}
        </ul>
      </section>
    </>
  );
}
