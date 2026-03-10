import { SearchPostalCode } from "../PostalCodes/SearchPostalCode";
import { GetAllPostalCodes } from "../PostalCodes/GetAllPostalCodes";
import { PostalCodesResultContributor } from "./PostalCodesResultContributor";

function ContributorPostalCodes({
  searchResult,
  setSearchResult,
  loading,
  setLoading,
}) {
  return (
    <div className="flex flex-col w-full items-center">
      <h2>View and edit all data:</h2>
      <section className="relative flex flex-col justify-center items-center gap-2 p-2 w-full">
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
      <PostalCodesResultContributor
        searchResult={searchResult}
        setSearchResult={setSearchResult}
      />

      <div className="relative"></div>
    </div>
  );
}

export { ContributorPostalCodes };
