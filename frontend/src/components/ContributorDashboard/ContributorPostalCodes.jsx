import { useState } from "react";
import Spinner from "@goran1010/spinner";
import { SearchPostalCode } from "../PostalCodes/SearchPostalCode";
import { GetAllPostalCodes } from "../PostalCodes/GetAllPostalCodes";
import { PostalCodesResultContributor } from "./PostalCodesResultContributor";

function ContributorPostalCodes({ searchResult, setSearchResult }) {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h2>View and edit all data:</h2>
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

      <PostalCodesResultContributor
        searchResult={searchResult}
        setSearchResult={setSearchResult}
      />

      <div className="relative"></div>
    </div>
  );
}

export { ContributorPostalCodes };
