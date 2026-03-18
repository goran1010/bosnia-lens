import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminDashboard } from "../../../src/components/AdminDashboard/AdminDashboard";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../src/contextData/UserDataContext";

describe("AdminDashboard component", () => {
  test("render component if user doesn't exist", () => {
    const contextValue = {};
    const userDataContextValue = {};

    render(
      <NotificationContext value={contextValue}>
        <UserDataContext value={userDataContextValue}>
          <AdminDashboard />
        </UserDataContext>
      </NotificationContext>,
    );

    const paragraphElement = screen.getByText(
      /You need to be logged in and an admin to see the admin dashboard./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });

  test("render component if user is not admin", () => {
    const contextValue = {};
    const userDataContextValue = { userData: { role: "USER" } };

    render(
      <NotificationContext value={contextValue}>
        <UserDataContext value={userDataContextValue}>
          <AdminDashboard />
        </UserDataContext>
      </NotificationContext>,
    );

    const paragraphElement = screen.getByText(
      /You need to be an admin to see the admin dashboard./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });

  test("render component if user is admin", () => {
    const contextValue = {
      addNotification: vi.fn(() => {}),
    };
    const userDataContextValue = { userData: { role: "ADMIN" } };

    render(
      <NotificationContext value={contextValue}>
        <UserDataContext value={userDataContextValue}>
          <AdminDashboard />
        </UserDataContext>
      </NotificationContext>,
    );

    const headingElement = screen.getByRole("heading", {
      name: /Admin Dashboard/i,
    });
    expect(headingElement).toBeInTheDocument();
  });
});
