import { useState, useRef, useContext } from "react";
import { checkPostalCodesValidity } from "./utils/checkPostalCodesValidity";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Button } from "../sharedComponents/Button";
import { Input } from "../sharedComponents/Input";
import { Label } from "../sharedComponents/Label";

const currentURL = import.meta.env.VITE_BACKEND_URL;

function SearchPostalCode({ setSearchResult, loading, setLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInput = useRef();
  const { addNotification } = useContext(NotificationContext);

  function handleSearch(e) {
    checkPostalCodesValidity(searchInput);
    setSearchTerm(e.target.value);
  }

  async function handleSubmit(e) {
    try {
      setLoading(true);
      e.preventDefault();

      const response = await fetch(
        `${currentURL}/api/v1/postal-codes/search?searchTerm=${searchTerm}`,
      );
      const result = await response.json();

      if (!response.ok) {
        addNotification({
          type: "error",
          message: result?.error?.message || result?.error || "Search failed.",
        });
        return;
      }
      addNotification({
        type: "success",
        message: "Postal codes retrieved successfully.",
      });
      setSearchResult(result.data);
    } catch (err) {
      addNotification({
        type: "error",
        message: "An error occurred while searching for postal codes.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center gap-2 w-full"
    >
      <Label htmlFor="search-term">Search by Postal Code or Municipality</Label>

      <div className="flex gap-2 w-full max-w-xl flex-wrap sm:flex-nowrap">
        <Input
          ref={searchInput}
          value={searchTerm}
          onChange={handleSearch}
          type="text"
          name="search-term"
          id="search-term"
          className="flex-1"
        />
        <Button
          type="submit"
          onClick={() => {
            checkPostalCodesValidity(searchInput);
          }}
          loading={loading}
          className="sm:w-auto text-white"
        >
          Search
        </Button>
      </div>
    </form>
  );
}

export { SearchPostalCode };
