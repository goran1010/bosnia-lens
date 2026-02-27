import { useState } from "react";
import Spinner from "@goran1010/spinner";
import { SearchPostalCode } from "./SearchPostalCode";
import { GetAllPostalCodes } from "./GetAllPostalCodes";
import { PostalCodesResult } from "./PostalCodesResult";

function PostalCodes() {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

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
      <div>{loading && <Spinner />}</div>

      <PostalCodesResult searchResult={searchResult} />

      <div className="relative"></div>
    </>
  );
}

export { PostalCodes };
