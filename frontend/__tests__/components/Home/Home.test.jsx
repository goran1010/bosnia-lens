import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "../../../src/components/Home/Home";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { MemoryRouter } from "react-router-dom";

describe("Home component", () => {
  test("render component", async () => {
    const contextValue = {};

    render(
      <NotificationContext value={contextValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </NotificationContext>,
    );
    const linkElement = await screen.findByRole("heading", {
      name: /Bosnia Lens/i,
      level: 1,
    });
    expect(linkElement).toBeInTheDocument();
  });
});
