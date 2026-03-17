import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ErrorPage } from "../../src/components/ErrorPage";

describe("Error page", () => {
  test("render component", () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );
    const linkElement = screen.getByText(/There is nothing here, sorry./i);
    expect(linkElement).toBeInTheDocument();
  });
});
