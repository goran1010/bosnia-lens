import { useState, useContext } from "react";
import Spinner from "@goran1010/spinner";
import UserDataContext from "../utils/UserDataContext";
import MessageCard from "./MessageCard";
import SearchPostalCode from "./SearchPostalCode";

const URL = import.meta.env.VITE_BACKEND_URL;

export default function PostalCodes() {
  const { setMessage } = useContext(UserDataContext);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <section className="relative flex flex-col justify-center items-center gap-4 p-4">
        <SearchPostalCode
          setSearchResult={setSearchResult}
          setLoading={setLoading}
        />
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
      <MessageCard />
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
