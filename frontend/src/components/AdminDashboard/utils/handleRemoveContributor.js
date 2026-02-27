const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

async function handleRemoveContributor(
  user,
  setCurrentContributors,
  addNotification,
) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/admin/remove-contributor/${user.id}`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      addNotification({
        type: "error",
        message: result.error,
        details: result.details?.[0].msg,
      });
      return;
    }

    setCurrentContributors((prev) =>
      prev.filter((contributor) => contributor.id !== user.id),
    );
    addNotification({
      type: "success",
      message: `User ${user.username} removed from contributors.`,
    });
  } catch (error) {
    addNotification({
      type: "error",
      message: `Failed to remove ${user.username} from contributors.`,
    });
    console.error(`Error removing ${user.username} from contributors:`, error);
  }
}

export { handleRemoveContributor };
