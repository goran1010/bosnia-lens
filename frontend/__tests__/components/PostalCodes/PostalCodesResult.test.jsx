import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostalCodesResult } from "../../../src/components/PostalCodes/PostalCodesResult";

describe("PostalCodesResult component", () => {
  test("renders no results message when searchResult is empty", () => {
    render(<PostalCodesResult searchResult={[]} />);
    const message = screen.getByText(/No results to display/i);
    expect(message).toBeInTheDocument();
  });

  test("renders search results when searchResult has data", () => {
    const mockResults = [
      { code: "71000", city: "Sarajevo", post: "" },
      { code: "75000", city: "Tuzla", post: "" },
    ];
    render(<PostalCodesResult searchResult={mockResults} />);
    const code1 = screen.getByText(/71000/i);
    const city1 = screen.getByText(/Sarajevo/i);
    const code2 = screen.getByText(/75000/i);
    const city2 = screen.getByText(/Tuzla/i);

    expect(code1).toBeInTheDocument();
    expect(city1).toBeInTheDocument();
    expect(code2).toBeInTheDocument();
    expect(city2).toBeInTheDocument();
  });
});
