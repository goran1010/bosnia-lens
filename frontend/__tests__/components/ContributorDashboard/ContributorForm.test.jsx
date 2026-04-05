import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ContributorDashboard } from "../../../src/components/ContributorDashboard/ContributorDashboard";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../src/contextData/UserDataContext";
import { useNotification } from "../../../src/customHooks/useNotification";
import { Notifications } from "../../../src/components/Notifications";
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

describe("ContributorForm component rendering", () => {
  beforeEach(() => {
    render(<Wrapper initialUser={{ role: "CONTRIBUTOR" }} />);
  });

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
