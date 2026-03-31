import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "../../../src/components/Home/Home";
import { NotificationContext } from "../../../src/contextData/NotificationContext";

describe("Home component", () => {
  test("render component", async () => {
    const contextValue = {};

    render(
      <NotificationContext value={contextValue}>
        <Home />
      </NotificationContext>,
    );
    const linkElement = await screen.findByText(/Bosnia Lens/i);
    expect(linkElement).toBeInTheDocument();
  });
});
