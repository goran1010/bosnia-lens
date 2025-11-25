import { useContext } from "react";
import UserDataContext from "../../utils/UserDataContext";

const currentURL = import.meta.env.VITE_BACKEND_URL;

export default function GetAllPostalCodes({ setSearchResult, setLoading }) {
  const { setMessage } = useContext(UserDataContext);

  async function handleGetAll(e) {
    try {
      setLoading(true);
      e.preventDefault();

      const response = await fetch(`${currentURL}/api/v1/postal-codes`, {
        mode: "cors",
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage([result.error, result.details]);
        return console.warn(result.error, result.details);
      }
      setSearchResult(result.data);
    } catch (err) {
      setMessage([err]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleGetAll}>
      <button
        type="submit"
        className="bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700 hover:cursor-pointer active:scale-98"
      >
        Get All Postal Codes and Municipalities
      </button>
    </form>
  );
}
