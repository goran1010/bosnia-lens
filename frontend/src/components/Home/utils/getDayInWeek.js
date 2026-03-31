function getDayInWeek(dateInput) {
  try {
    if (typeof dateInput !== "string") {
      throw new Error("Invalid date");
    }

    const date = new Date(dateInput);

    if (isNaN(date)) {
      throw new Error("Invalid date");
    }

    return date.toLocaleDateString("en-US", { weekday: "long" });
  } catch (error) {
    console.error("Error in getDayInWeek:", error);
    throw new Error("Invalid date");
  }
}

export { getDayInWeek };
