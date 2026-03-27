import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../../src/components/Footer";

describe("ErrorPage Component", () => {
  test("Footer component", () => {
    render(<Footer />);
    const email = screen.getByText(/goran1010jovic@gmail.com/i);
    expect(email).toBeInTheDocument();
  });
});
