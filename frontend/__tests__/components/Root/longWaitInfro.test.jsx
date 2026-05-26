import { render, screen } from "@testing-library/react";
import { LongWaitInfo } from "../../../src/utils/longWaitInfo";
import { describe, test, expect } from "vitest";
import { RootContextProvider } from "../../rootContextProvider";

function Wrapper({ serverIsDown }) {
  return (
    <RootContextProvider>
      <LongWaitInfo serverIsDown={serverIsDown} />
    </RootContextProvider>
  );
}

describe("LongWaitInfo component", () => {
  test("renders long wait message when server is not down", () => {
    render(<Wrapper serverIsDown={false} />);
    const message = screen.getByText(
      /Getting response from the server is taking longer than expected/i,
    );
    expect(message).toBeInTheDocument();
    expect(
      screen.queryByText(/Server can't be reached after multiple attempts/i),
    ).not.toBeInTheDocument();
  });

  test("renders server down message when server is down", () => {
    render(<Wrapper serverIsDown={true} />);
    const message = screen.getByText(
      /Server can't be reached after multiple attempts/i,
    );
    expect(message).toBeInTheDocument();
    expect(
      screen.queryByText(
        /Getting response from the server is taking longer than expected/i,
      ),
    ).not.toBeInTheDocument();
  });

  test("falls back to long wait message when serverIsDown prop is omitted", () => {
    render(<Wrapper />);
    expect(
      screen.getByText(
        /Getting response from the server is taking longer than expected/i,
      ),
    ).toBeInTheDocument();
  });
});
