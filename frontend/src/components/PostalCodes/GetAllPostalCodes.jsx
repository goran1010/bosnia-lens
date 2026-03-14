import { useContext } from "react";
import { NotificationContext } from "../../contextData/NotificationContext";
import { Spinner } from "../../utils/Spinner";
import { Button } from "../sharedComponents/Button";

const currentURL = import.meta.env.VITE_BACKEND_URL;

function GetAllPostalCodes({ setSearchResult, loading, setLoading }) {
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
          details: result.details?.[0]?.msg,
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
    <form onSubmit={handleGetAll} className="w-full">
      <Button
        type="submit"
        disabled={loading}
        className=" bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-500 disabled:text-gray-200"
      >
        <div className="h-full w-full flex justify-center items-center absolute">
          {loading && <Spinner />}
        </div>
        Get All
      </Button>
    </form>
  );
}

export { GetAllPostalCodes };
