import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminDashboard } from "../../src/components/AdminDashboard/AdminDashboard";
import { UserDataContext } from "../../src/utils/UserDataContext";
import { NotificationContext } from "../../src/utils/NotificationContext";

const user = userEvent.setup();

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

describe("render AdminDashboard page when no dataset is selected", () => {
  test("when no dataset is selected", () => {
    render(
      <UserDataContext value={{ userData: { isAdmin: true } }}>
        <AdminDashboard />
      </UserDataContext>,
    );

    const linkElement = screen.getByText(/You need to select a dataset./i);
    expect(linkElement).toBeInTheDocument();
  });

  test("when postal-codes dataset is selected", async () => {
    render(
      <NotificationContext value={{ addNotification: () => {} }}>
        <UserDataContext value={{ userData: { isAdmin: true } }}>
          <AdminDashboard />
        </UserDataContext>
        ,
      </NotificationContext>,
    );

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    await user.selectOptions(selectElement, "postal-codes");

    const linkElement = screen.queryByText(/You need to select a dataset./i);
    expect(linkElement).not.toBeInTheDocument();
  });
});
