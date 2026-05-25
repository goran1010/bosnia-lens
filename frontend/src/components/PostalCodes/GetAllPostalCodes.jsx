import { useContext } from "react";
import { RootContext } from "../../contextData/RootContext";
import { Spinner } from "../../utils/Spinner";
import { Button } from "../sharedComponents/Button";

const currentURL = import.meta.env.VITE_BACKEND_URL;

function GetAllPostalCodes({ setSearchResult, loading, setLoading }) {
  const { addNotification } = useContext(RootContext);
  const { t } = useContext(RootContext);

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
          message:
            result?.error?.message ||
            result?.error ||
            t("postal.getAll.failed"),
        });
        return;
      }
      addNotification({
        type: "success",
        message: result.message,
      });
      setSearchResult(result.data);
    } catch (err) {
      addNotification({
        type: "error",
        message: t("postal.getAll.error"),
      });
      console.error("Error fetching postal codes and municipalities:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleGetAll} className="w-full">
      <Button type="submit" loading={loading} variant="warning">
        {t("form.getAll")}
      </Button>
    </form>
  );
}

export { GetAllPostalCodes };
