import { useState } from "react";
import Spinner from "@goran1010/spinner";
import MessageCard from "../MessageCard";
import SearchPostalCode from "./SearchPostalCode";
import GetAllPostalCodes from "./GetAllPostalCodes";
import PostalCodesResult from "./PostalCodesResult";

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
      <div>{loading && <Spinner />}</div>
      <MessageCard />
      <PostalCodesResult searchResult={searchResult} />
    </>
  );
}
