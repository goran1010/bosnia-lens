const currentUrl = import.meta.env.VITE_BACKEND_URL;

async function handleDeleteContributor(e, setSearchResult, addNotification) {
  try {
    e.preventDefault();
    const code = e.target.dataset.postalcode;

    const response = await fetch(
      `${currentUrl}/users/contributor/postal-codes/?code=${code}`,
      {
        mode: "cors",
        method: "delete",
        credentials: "include",
      },
    );
    const result = await response.json();

    if (response.ok) {
      setSearchResult((previousState) => {
        return previousState.filter((item) => item.code !== result.data.code);
      });
      addNotification({
        type: "success",
        message: `Postal code deleted successfully!`,
      });
      return;
    }
    addNotification({
      type: "error",
      message: result.error,
      details: result.details?.[0]?.msg,
    });
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while deleting the postal code.",
    });
    console.error(err);
  }
}

export { handleDeleteContributor };
