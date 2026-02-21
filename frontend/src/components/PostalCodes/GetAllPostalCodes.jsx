import { useContext } from "react";
import NotificationContext from "../../utils/NotificationContext";

const currentURL = import.meta.env.VITE_BACKEND_URL;

export default function GetAllPostalCodes({ setSearchResult, setLoading }) {
  const { addNotification } = useContext(NotificationContext);

  async function handleGetAll(e) {
    try {
      setLoading(true);
      e.preventDefault();

      const response = await fetch(`${currentURL}/api/v1/postal-codes`, {
        mode: "cors",
      });
      const result = await response.json();

      if (!response.ok) {
        addNotification({
          type: "error",
          message: result.error,
        });
        return;
      }
      addNotification({
        type: "success",
        message: "Postal codes and municipalities retrieved successfully.",
      });
      setSearchResult(result.data);
    } catch (err) {
      addNotification({
        type: "error",
        message:
          "An error occurred while fetching postal codes and municipalities.",
      });
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
