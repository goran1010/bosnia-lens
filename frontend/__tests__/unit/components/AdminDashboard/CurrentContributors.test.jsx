import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";
import { CurrentContributors } from "../../../../src/components/AdminDashboard/CurrentContributors";

function renderComponent(currentContributors = []) {
  render(
    <NotificationContext value={{ addNotification: vi.fn() }}>
      <CurrentContributors currentContributors={currentContributors} />
    </NotificationContext>,
  );
}

describe("CurrentContributors Component", () => {
  test("renders without contributors", () => {
    renderComponent();
    expect(screen.getByText("Current Contributors")).toBeInTheDocument();
    expect(screen.getByText("No contributors found")).toBeInTheDocument();

    const countBadge = screen.getByLabelText("number of contributors");
    expect(countBadge).toHaveTextContent("0");
  });

  test("renders with contributors", () => {
    const mockContributors = [
      { id: 1, username: "user1", email: "user1@example.com" },
    ];
    renderComponent(mockContributors);

    const email = screen.getByText("user1@example.com");
    const username = screen.getByText("user1");
    const countBadge = screen.getByLabelText("number of contributors");

    expect(countBadge).toHaveTextContent("1");
    expect(username).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });
});
