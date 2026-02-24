import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminDashboard } from "../../src/components/AdminDashboard/AdminDashboard";
import { UserDataContext } from "../../src/utils/UserDataContext";
import { NotificationContext } from "../../src/utils/NotificationContext";

const user = userEvent.setup();

function Wrapper(userData = null, addNotification = () => {}) {
  return (
    <NotificationContext value={{ addNotification }}>
      <UserDataContext value={{ userData }}>
        <AdminDashboard />
      </UserDataContext>
    </NotificationContext>
  );
}

describe("render AdminDashboard component", () => {
  test("when user not logged in", () => {
    render(Wrapper());

    const linkElement = screen.getByText(
      /User needs to an admin to see the dashboard./i,
    );
    expect(linkElement).toBeInTheDocument();
  });

  test("when user logged in but not admin", () => {
    render(Wrapper({ isAdmin: false }));

    const linkElement = screen.getByText(
      /User needs to an admin to see the dashboard./i,
    );
    expect(linkElement).toBeInTheDocument();
  });

  test("when user logged in and is admin", () => {
    render(Wrapper({ isAdmin: true }));

    const dataSetLabel = screen.getByLabelText(/Choose dataset:/i);
    expect(dataSetLabel).toBeInTheDocument();

    const linkElement = screen.queryByText(
      /User needs to an admin to see the dashboard./i,
    );
    expect(linkElement).not.toBeInTheDocument();
  });

  test("when no dataset is selected", () => {
    render(Wrapper({ isAdmin: true }));

    const linkElement = screen.getByText(/You need to select a dataset./i);
    expect(linkElement).toBeInTheDocument();
  });

  test("when postal-codes dataset is selected", async () => {
    render(Wrapper({ isAdmin: true }));

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    await user.selectOptions(selectElement, "postal-codes");

    const linkElement = screen.queryByText(/You need to select a dataset./i);
    expect(linkElement).not.toBeInTheDocument();

    const postalCodeLabel = screen.getByText(/Postal Code:/i);
    expect(postalCodeLabel).toBeInTheDocument();
  });
});

describe("AdminDashboard component user input", () => {
  test("handles user input in postal-codes dataset form", async () => {
    render(Wrapper({ isAdmin: true }));

    const selectElement = screen.getByRole("combobox");
    await user.selectOptions(selectElement, "postal-codes");

    const cityInput = screen.getByLabelText(/City name:/i);
    const postalCodeInput = screen.getByLabelText(/Postal Code:/i);
    const postalCarrierInput = screen.getByLabelText(/Postal Carrier:/i);

    await user.type(cityInput, "Test City");
    await user.type(postalCodeInput, "12345");
    await user.type(postalCarrierInput, "Test Carrier");

    expect(cityInput).toHaveValue("Test City");
    expect(postalCodeInput).toHaveValue("12345");
    expect(postalCarrierInput).toHaveValue("Test Carrier");
  });
});
