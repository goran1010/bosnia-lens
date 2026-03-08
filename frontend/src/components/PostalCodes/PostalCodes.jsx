import { useState } from "react";
import { Spinner } from "../../utils/Spinner";
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
          loading={loading}
          setLoading={setLoading}
        />
        <GetAllPostalCodes
          setSearchResult={setSearchResult}
          loading={loading}
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
