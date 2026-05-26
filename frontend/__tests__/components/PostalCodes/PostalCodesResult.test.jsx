import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostalCodesResult } from "../../../src/components/PostalCodes/PostalCodesResult";
import { RootContextProvider } from "../../rootContextProvider";

function Wrapper({ searchResult }) {
  return (
    <RootContextProvider>
      <PostalCodesResult searchResult={searchResult} />
    </RootContextProvider>
  );
}

describe("PostalCodesResult component", () => {
  test("renders no results message when searchResult is empty", () => {
    render(<Wrapper searchResult={[]} />);
    const message = screen.getByText(/No results to display/i);
    expect(message).toBeInTheDocument();
  });

  test("renders search results when searchResult has data", () => {
    const mockResults = [
      { code: "71000", city: "Sarajevo", post: "" },
      { code: "75000", city: "Tuzla", post: "" },
    ];
    render(<Wrapper searchResult={mockResults} />);
    const code1 = screen.getByText(/71000/i);
    const city1 = screen.getByText(/Sarajevo/i);
    const code2 = screen.getByText(/75000/i);
    const city2 = screen.getByText(/Tuzla/i);

    expect(code1).toBeInTheDocument();
    expect(city1).toBeInTheDocument();
    expect(code2).toBeInTheDocument();
    expect(city2).toBeInTheDocument();
  });

  test("renders no results message when searchResult is null", () => {
    render(<Wrapper searchResult={null} />);
    expect(screen.getByText(/No results to display/i)).toBeInTheDocument();
  });

  test("renders no results message when searchResult is undefined", () => {
    render(<Wrapper searchResult={undefined} />);
    expect(screen.getByText(/No results to display/i)).toBeInTheDocument();
  });

  test("renders a single result correctly", () => {
    const mockResults = [
      { code: "71000", city: "Sarajevo", post: "Main Post" },
    ];
    render(<Wrapper searchResult={mockResults} />);
    expect(screen.getByText("71000")).toBeInTheDocument();
    expect(screen.getByText("Sarajevo")).toBeInTheDocument();
    expect(screen.getByText("Main Post")).toBeInTheDocument();
  });

  test("renders result with null post field without crashing", () => {
    const mockResults = [{ code: "71000", city: "Sarajevo", post: null }];
    render(<Wrapper searchResult={mockResults} />);
    expect(screen.getByText("71000")).toBeInTheDocument();
    expect(screen.getByText("Sarajevo")).toBeInTheDocument();
  });

  test("renders result with undefined post field without crashing", () => {
    const mockResults = [{ code: "71000", city: "Sarajevo" }];
    render(<Wrapper searchResult={mockResults} />);
    expect(screen.getByText("71000")).toBeInTheDocument();
    expect(screen.getByText("Sarajevo")).toBeInTheDocument();
  });
});
