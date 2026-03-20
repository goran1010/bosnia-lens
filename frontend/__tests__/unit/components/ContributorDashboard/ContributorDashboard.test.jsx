import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContributorDashboard } from "../../../../src/components/ContributorDashboard/ContributorDashboard";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../../src/contextData/UserDataContext";

function renderContributorDashboard(
  contextValue = {},
  userDataContextValue = {},
) {
  render(
    <NotificationContext value={contextValue}>
      <UserDataContext value={userDataContextValue}>
        <ContributorDashboard />
      </UserDataContext>
    </NotificationContext>,
  );
}

describe("ContributorDashboard component", () => {
  test("render component if user doesn't exist", async () => {
    renderContributorDashboard();

    const paragraphElement = await screen.findByText(
      /You need to be logged in and a contributor to see the contributor dashboard./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });

  test("render component if user is not a contributor", async () => {
    const contextValue = {};
    const userDataContextValue = { userData: { role: "USER" } };

    renderContributorDashboard(contextValue, userDataContextValue);

    const paragraphElement = await screen.findByText(
      /You need to be a contributor to see the contributor dashboard./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });

  test("render component if user is a contributor", async () => {
    const contextValue = {
      addNotification: vi.fn(() => {}),
    };
    const userDataContextValue = { userData: { role: "CONTRIBUTOR" } };

    renderContributorDashboard(contextValue, userDataContextValue);

    const headingElement = await screen.findByLabelText(/Choose dataset/i);
    expect(headingElement).toBeInTheDocument();
  });
});
