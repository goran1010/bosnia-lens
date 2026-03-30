import { render, screen } from "@testing-library/react";
import { LongWaitInfo } from "../../../src/utils/longWaitInfo";
import { describe, test, expect } from "vitest";

describe("LongWaitInfo component", () => {
  test("renders long wait message when server is not down", () => {
    render(<LongWaitInfo serverIsDown={false} />);
    const message = screen.getByText(
      /Getting response from the server is taking longer than expected/i,
    );
    expect(message).toBeInTheDocument();
  });

  test("renders server down message when server is down", () => {
    render(<LongWaitInfo serverIsDown={true} />);
    const message = screen.getByText(
      /Server can't be reached after multiple attempts/i,
    );
    expect(message).toBeInTheDocument();
  });
});
