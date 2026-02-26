import { useState } from "react";
import Spinner from "@goran1010/spinner";
import { SearchPostalCode } from "./SearchPostalCode";
import { GetAllPostalCodes } from "./GetAllPostalCodes";
import { PostalCodesResult } from "./PostalCodesResult";
import { PostalCodesResultContributor } from "../ContributorDashboard/PostalCodesResultContributor";
import { UserDataContext } from "../../utils/UserDataContext";

function ShowResult({ searchResult, setSearchResult }) {
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
      <div>{loading && <Spinner />}</div>

      <PostalCodesResultContributor
        searchResult={searchResult}
        setSearchResult={setSearchResult}
      />

      <div className="relative"></div>
    </>
  );
}

export { ShowResult };
