import { useState } from "react";
import { ContributorPostalCodes } from "./ContributorPostalCodes";
import { AddNewData } from "./AddNewData";

function PostalCodeData() {
  const [searchResult, setSearchResult] = useState([]);

  return (
    <>
      <AddNewData setSearchResult={setSearchResult} />

      <ContributorPostalCodes
        searchResult={searchResult}
        setSearchResult={setSearchResult}
      />
    </>
  );
}

export { PostalCodeData };
