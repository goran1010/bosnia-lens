import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Universities } from "../../../src/components/Universities";

describe("ErrorPage Component", () => {
  test("Universities component", () => {
    render(<Universities />);
    const linkElement = screen.getByText(/Universities/i);
    expect(linkElement).toBeInTheDocument();
  });
});
