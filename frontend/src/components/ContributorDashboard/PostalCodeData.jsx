import { useState } from "react";
import { ContributorPostalCodes } from "./ContributorPostalCodes";
import { AddNewData } from "./AddNewData";

function PostalCodeData() {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <AddNewData
        setSearchResult={setSearchResult}
        loading={loading}
        setLoading={setLoading}
      />

      <ContributorPostalCodes
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}

export { PostalCodeData };
