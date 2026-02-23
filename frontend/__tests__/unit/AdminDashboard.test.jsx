import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminDashboard } from "../../src/components/AdminDashboard/AdminDashboard";
import { UserDataContext } from "../../src/utils/UserDataContext";

describe("render AdminDashboard component", () => {
  test("when user not logged in", () => {
    render(
      <UserDataContext value={{ userData: null }}>
        <AdminDashboard />
      </UserDataContext>,
    );

    const linkElement = screen.getByText(
      /User needs to an admin to see the dashboard./i,
    );
    expect(linkElement).toBeInTheDocument();
  });

  test("when user logged in but not admin", () => {
    render(
      <UserDataContext value={{ userData: { isAdmin: false } }}>
        <AdminDashboard />
      </UserDataContext>,
    );

    const linkElement = screen.getByText(
      /User needs to an admin to see the dashboard./i,
    );
    expect(linkElement).toBeInTheDocument();
  });

  test("when user logged in and is admin", () => {
    render(
      <UserDataContext value={{ userData: { isAdmin: true } }}>
        <AdminDashboard />
      </UserDataContext>,
    );

    const dataSetLabel = screen.getByLabelText(/Choose dataset:/i);
    expect(dataSetLabel).toBeInTheDocument();

    const linkElement = screen.queryByText(
      /User needs to an admin to see the dashboard./i,
    );
    expect(linkElement).not.toBeInTheDocument();
  });
});
