import { useState } from "react";
import { SearchPostalCode } from "./SearchPostalCode";
import { GetAllPostalCodes } from "./GetAllPostalCodes";
import { PostalCodesResult } from "./PostalCodesResult";

function PostalCodes() {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  return (
    <div className="flex flex-col gap-8 flex-1">
      <section className="relative flex flex-col justify-center items-center gap-4 py-4">
        <SearchPostalCode
          setSearchResult={setSearchResult}
          loading={loading}
          setLoading={setLoading}
        />
        <GetAllPostalCodes
          setSearchResult={setSearchResult}
          loading={loading}
          setLoading={setLoading}
        />
      </section>
      <PostalCodesResult searchResult={searchResult} />

      <div className="relative"></div>
    </div>
  );
}

export { PostalCodes };
