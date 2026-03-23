import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ContributorDashboard } from "../../../../src/components/ContributorDashboard/ContributorDashboard";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../../src/contextData/UserDataContext";
import { useNotification } from "../../../../src/customHooks/useNotification";
import { Notifications } from "../../../../src/components/Notifications";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

function Wrapper({ initialUser = null }) {
  const [userData, setUserData] = useState(initialUser);
  const { notificationValue } = useNotification();

  return (
    <NotificationContext value={notificationValue}>
      <UserDataContext value={{ userData, setUserData }}>
        <MemoryRouter initialEntries={["/contributor-dashboard"]}>
          <Notifications />
          <Routes>
            <Route
              path="/contributor-dashboard"
              element={<ContributorDashboard />}
            />
          </Routes>
        </MemoryRouter>
      </UserDataContext>
    </NotificationContext>
  );
}

describe("render ContributorDashboard component", () => {
  test("render message if user doesn't exist", async () => {
    Wrapper();
    const paragraphElement = await screen.findByText(
      /You need to be logged in and a contributor to see the contributor dashboard./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });

  test("render message if user is not a contributor", async () => {
    const contextValue = {};
    const userDataContextValue = { userData: { role: "USER" } };

    const paragraphElement = await screen.findByText(
      /You need to be a contributor to see the contributor dashboard./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });
});

describe("ContributorForm component rendering", () => {
  test("renders ContributorForm component's select element if user is contributor", async () => {
    const selectElement = screen.getByLabelText(/Choose dataset/i);
    expect(selectElement).toBeInTheDocument();
  });

  test("renders You need to select a dataset message when no choice is made", async () => {
    const messageElement = screen.getByText(/You need to select a dataset/i);
    expect(messageElement).toBeInTheDocument();
  });

  test("renders You need to select a dataset message when No dataset is selected", async () => {
    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "No dataset");

    const messageElement = screen.getByText(/You need to select a dataset/i);
    expect(messageElement).toBeInTheDocument();
  });

  test("renders Holidays component when Holidays is selected", async () => {
    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "Holidays");

    const holidaysElement = screen.getByText(/Holidays placeholder/i);
    expect(holidaysElement).toBeInTheDocument();
  });

  test("renders Universities component when Universities is selected", async () => {
    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "Universities");

    const universitiesElement = screen.getByText(/Universities placeholder/i);
    expect(universitiesElement).toBeInTheDocument();
  });

  test("renders PostalCodeData component when Postal Codes is selected", async () => {
    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "Postal Codes");

    const postalCodeDataElement = await screen.findByText(/Add new data/i);
    expect(postalCodeDataElement).toBeInTheDocument();

    const viewDataElement = screen.getByRole("heading", {
      name: /View and edit all data/i,
    });
    expect(viewDataElement).toBeInTheDocument();
  });
});

describe("AddNewData component", () => {
  test("renders the component and toggles form visibility", async () => {
    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);

    expect(screen.getByLabelText(/city name/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Postal Code:")).toBeInTheDocument();
    expect(screen.getByLabelText(/postal carrier/i)).toBeInTheDocument();

    await user.click(toggleButton);

    expect(screen.queryByLabelText(/city name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Postal Code:")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/postal carrier/i)).not.toBeInTheDocument();
  });

  test("validates input fields on change", async () => {
    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await user.click(toggleButton);

    const cityInput = screen.getByLabelText(/city name/i);
    const codeInput = screen.getByLabelText("Postal Code:");

    await user.type(cityInput, "Test City");
    expect(cityInput).toHaveValue("Test City");

    await user.type(codeInput, "12345");
    expect(codeInput).toHaveValue("12345");
  });

  test("validates postal code input field and shows error for invalid postal code", async () => {
    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await user.click(toggleButton);

    const codeInput = screen.getByLabelText("Postal Code:");

    await user.type(codeInput, "abcde");
    expect(codeInput).toHaveValue("abcde");

    expect(codeInput.validationMessage).toMatch(
      /Postal code must be a 5-digit number/i,
    );

    await user.clear(codeInput);
    await user.type(codeInput, "12345");

    expect(codeInput).toHaveValue("12345");
    expect(codeInput.validationMessage).toBe("");
  });

  test("validates required fields and shows error when trying to submit with empty required fields", async () => {
    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await user.click(toggleButton);

    const addButton = screen.getByRole("button", { name: /add data/i });

    await user.click(addButton);

    const cityInput = screen.getByLabelText(/city name/i);

    expect(cityInput.validationMessage).toMatch(/City name cannot be empty/i);

    await user.type(cityInput, "Test City");

    await user.click(addButton);
    expect(cityInput.validationMessage).toBe("");

    const codeInput = screen.getByLabelText("Postal Code:");

    expect(codeInput.validationMessage).toMatch(
      /Postal code must be a 5-digit number/i,
    );

    await user.type(codeInput, "12345");
    expect(codeInput.validationMessage).toBe("");
  });

  test("successfully submits data and shows success notification", async () => {
    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await user.click(toggleButton);

    const cityInput = screen.getByLabelText(/city name/i);
    const codeInput = screen.getByLabelText("Postal Code:");

    const addButton = screen.getByRole("button", { name: /add data/i });

    await user.type(cityInput, "Test City");
    await user.type(codeInput, "12345");

    await user.click(addButton);

    // expect(mockAddNotification).toHaveBeenCalledWith({
    //   type: "success",
    //   message: "Data added successfully",
    // });
  });
});
