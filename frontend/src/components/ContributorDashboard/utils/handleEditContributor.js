const currentUrl = import.meta.env.VITE_BACKEND_URL;

async function handleEditContributor(e, setSearchResult, addNotification) {
  try {
    e.preventDefault();
    const code = e.target.children[0].textContent;
    const city = e.target[0].value;
    const post = e.target[1].value;

    const response = await fetch(
      `${currentUrl}/contributor/postal-codes/?city=${city}&code=${code}&post=${post}`,
      {
        mode: "cors",
        method: "put",
        credentials: "include",
      },
    );
    const result = await response.json();

    if (response.ok) {
      setSearchResult((prevState) => {
        return prevState.map((item) =>
          item.code === result.data.code ? result.data : item,
        );
      });
      addNotification({
        type: "success",
        message: `Postal code updated successfully!`,
      });
      return;
    }
    addNotification({
      type: "error",
      message: result.error,
      details: result.details?.[0].msg,
    });
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while updating the postal code.",
    });
    console.error(err);
  }
}

export { handleEditContributor };
