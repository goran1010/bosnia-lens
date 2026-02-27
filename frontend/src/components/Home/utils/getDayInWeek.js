function getDayInWeek(dayNumber) {
  const day = new Date(dayNumber).getDay();
  const DAY_IN_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return DAY_IN_WEEK[day];
}

export { getDayInWeek };
