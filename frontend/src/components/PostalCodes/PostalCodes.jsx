import { useContext, useState } from "react";
import Spinner from "@goran1010/spinner";
import MessageCard from "../MessageCard";
import SearchPostalCode from "./SearchPostalCode";
import GetAllPostalCodes from "./GetAllPostalCodes";
import PostalCodesResult from "./PostalCodesResult";
import { PostalCodesResultAdmin } from "../AdminDashboard/PostalCodesResultAdmin";
import UserDataContext from "../../utils/UserDataContext";

export default function PostalCodes() {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserDataContext);

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
      {userData.isAdmin ? (
        <PostalCodesResultAdmin searchResult={searchResult} />
      ) : (
        <PostalCodesResult searchResult={searchResult} />
      )}
      <div className="relative">
        <MessageCard />
      </div>
    </>
  );
}
