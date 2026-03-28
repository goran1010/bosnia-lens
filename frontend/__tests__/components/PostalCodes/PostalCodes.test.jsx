import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { PostalCodes } from "../../../src/components/PostalCodes/PostalCodes";

describe("PostalCodes Component", () => {
  const contextValue = {};

  test("render PostalCodes", () => {
    render(
      <NotificationContext value={contextValue}>
        <PostalCodes />
      </NotificationContext>,
    );
    const linkElement = screen.getByText(/Postal Code or Municipality/i);
    expect(linkElement).toBeInTheDocument();
  });
});
