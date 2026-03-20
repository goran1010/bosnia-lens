import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContributorForm } from "../../../../src/components/ContributorDashboard/ContributorForm";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../../src/contextData/UserDataContext";
import userEvent from "@testing-library/user-event";

const renderComponent = () => {
  const userDataContextValue = { userData: { role: "ADMIN" } };

  return render(
    <NotificationContext
      value={{
        notifications: [],
        addNotification: vi.fn(),
        removeNotification: vi.fn(),
      }}
    >
      <UserDataContext value={userDataContextValue}>
        <ContributorForm />
      </UserDataContext>
    </NotificationContext>,
  );
};

describe("ContributorForm component rendering", () => {
  test("renders ContributorForm component's select element", async () => {
    renderComponent();

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    expect(selectElement).toBeInTheDocument();
  });

  test("renders You need to select a dataset message when no choice is made", async () => {
    renderComponent();

    const messageElement = screen.getByText(/You need to select a dataset/i);
    expect(messageElement).toBeInTheDocument();
  });

  test("renders You need to select a dataset message when No dataset is selected", async () => {
    renderComponent();

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    userEvent.selectOptions(selectElement, "No dataset");

    const messageElement = screen.getByText(/You need to select a dataset/i);
    expect(messageElement).toBeInTheDocument();
  });

  test("renders Holidays component when Holidays is selected", async () => {
    renderComponent();

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    userEvent.selectOptions(selectElement, "Holidays");

    const holidaysElement = screen.getByText(/Holidays/i);
    expect(holidaysElement).toBeInTheDocument();
  });

  test("renders Universities component when Universities is selected", async () => {
    renderComponent();

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    userEvent.selectOptions(selectElement, "Universities");

    const universitiesElement = screen.getByText(/Universities/i);
    expect(universitiesElement).toBeInTheDocument();
  });

  test("renders PostalCodeData component when Postal Codes is selected", async () => {
    renderComponent();

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    userEvent.selectOptions(selectElement, "Postal Codes");

    const postalCodeDataElement = await screen.findByText(/Add new data/i);
    expect(postalCodeDataElement).toBeInTheDocument();

    const viewDataElement = screen.getByRole("heading", {
      name: /View and edit all data/i,
    });
    expect(viewDataElement).toBeInTheDocument();
  });
});
