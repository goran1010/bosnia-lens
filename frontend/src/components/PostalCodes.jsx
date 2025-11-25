import { useState } from "react";
import Spinner from "@goran1010/spinner";
import MessageCard from "./MessageCard";
import SearchPostalCode from "./SearchPostalCode";
import GetAllPostalCodes from "./GetAllPostalCodes";

export default function PostalCodes() {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <section className="relative flex flex-col justify-center items-center gap-4 p-4">
        <SearchPostalCode
          setSearchResult={setSearchResult}
          setLoading={setLoading}
        />
        <GetAllPostalCodes
          setSearchResult={setSearchResult}
          setLoading={setLoading}
        />
      </section>
      {loading && <Spinner />}
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
