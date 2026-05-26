import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostalCodes } from "../../../src/components/PostalCodes/PostalCodes";
import { RootContextProvider } from "../../rootContextProvider";

function Wrapper() {
  return (
    <RootContextProvider>
      <PostalCodes />
    </RootContextProvider>
  );
}

describe("PostalCodes Component", () => {
  test("render PostalCodes", () => {
    render(<Wrapper />);

    const linkElement = screen.getByText(/Postal Code or Municipality/i);
    expect(linkElement).toBeInTheDocument();
  });
});
