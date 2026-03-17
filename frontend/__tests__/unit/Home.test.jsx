import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "../../src/components/Home/Home";
import { NotificationContext } from "../../src/contextData/NotificationContext";

describe("Home component", () => {
  test("render component", () => {
    const contextValue = {};

    render(
      <NotificationContext value={contextValue}>
        <Home />
      </NotificationContext>,
    );
    const linkElement = screen.getByText(/Bosnia Lens/i);
    expect(linkElement).toBeInTheDocument();
  });
});
