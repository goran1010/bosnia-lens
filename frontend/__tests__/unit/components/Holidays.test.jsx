import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Holidays } from "../../../src/components/Holidays";

describe("Holidays component", () => {
  test("Holidays component", () => {
    render(<Holidays />);
    const linkElement = screen.getByText(/Holidays/i);
    expect(linkElement).toBeInTheDocument();
  });
});
