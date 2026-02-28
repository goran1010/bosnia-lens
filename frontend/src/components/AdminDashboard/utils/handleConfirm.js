const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

async function handleConfirm(
  user,
  setPendingRequests,
  setCurrentContributors,
  addNotification,
) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/users/admin/add-contributor/${user.id}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const data = await response.json();

    if (response.ok) {
      setPendingRequests((prev) =>
        prev.filter((request) => request._id !== user._id),
      );
      setCurrentContributors((prev) => [...prev, user]);
      addNotification({
        type: "success",
        message: `User ${user.username} is now a contributor.`,
      });
      return;
    }
    addNotification({
      type: "error",
      message: data.error,
      details: data.details?.[0]?.msg,
    });
  } catch (error) {
    addNotification({
      type: "error",
      message: `Failed to promote ${user.username} to contributor.`,
    });
    console.error(`Error promoting ${user.username} to contributor:`, error);
  }
}

export { handleConfirm };
