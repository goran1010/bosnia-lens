import { describe, test, expect } from "vitest";
import { getDayInWeek } from "../../../../src/components/Home/utils/getDayInWeek";

describe("getDayInWeek", () => {
  test("returns correct day of the week for a valid date", () => {
    expect(getDayInWeek("2024-06-01")).toBe("Saturday");
    expect(getDayInWeek("2024-06-02")).toBe("Sunday");
    expect(getDayInWeek("2024-06-03")).toBe("Monday");
    expect(getDayInWeek("2024-06-04")).toBe("Tuesday");
    expect(getDayInWeek("2024-06-05")).toBe("Wednesday");
    expect(getDayInWeek("2024-06-06")).toBe("Thursday");
    expect(getDayInWeek("2024-06-07")).toBe("Friday");
  });

  test("throws an error for an invalid date string", () => {
    expect(() => getDayInWeek("invalid-date")).toThrow("Invalid date");
    expect(() => getDayInWeek("2024-13-01")).toThrow("Invalid date"); // Invalid month
    expect(() => getDayInWeek("2024-00-01")).toThrow("Invalid date"); // Invalid month
    expect(() => getDayInWeek(123)).toThrow("Invalid date"); // Invalid day
  });
});
