import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminDashboard } from "../../src/components/AdminDashboard/AdminDashboard";
import { UserDataContext } from "../../src/utils/UserDataContext";

describe("AdminDashboard component", () => {
  test("render AdminDashboard component when user not logged in", () => {
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
});
