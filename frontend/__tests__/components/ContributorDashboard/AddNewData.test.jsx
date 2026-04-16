import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
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
  const { notifications, addNotification, removeNotification } = useNotification();

  return (
    <NotificationContext value={{ notifications, addNotification, removeNotification }}>
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

const createFetchResponse = (result, ok = true) => ({
  ok,
  json: async () => result,
});

const fetchMock = vi.fn();

const setupFetchMock = () => {
  fetchMock.mockReset();
  fetchMock.mockImplementation((requestUrl) => {
    if (requestUrl.includes("/csrf-token")) {
      return Promise.resolve(
        createFetchResponse({
          data: "mocked-csrf-token",
          message: "CSRF token generated successfully",
        }),
      );
    }

    if (requestUrl.includes("/users/contributor")) {
      return Promise.resolve(
        createFetchResponse({
          data: {
            id: 1,
            city: "Test City",
            code: "12345",
            post: "",
          },

          message: "Data added successfully",
        }),
      );
    }

    if (requestUrl.includes("/postal-codes/search")) {
      return Promise.resolve(
        createFetchResponse({
          data: [
            {
              id: 1,
              city: "Test City",
              code: "12345",
              post: "",
            },
          ],
          message: "Postal codes retrieved successfully",
        }),
      );
    }

    if (requestUrl.includes("/postal-codes")) {
      return Promise.resolve(
        createFetchResponse({
          data: [
            {
              id: 1,
              city: "Test City",
              code: "12345",
              post: "",
            },
            { id: 2, city: "Test City 2", code: "12346", post: "" },
          ],
          message: "Data added successfully",
        }),
      );
    }

    return Promise.resolve(
      createFetchResponse({ data: [], message: "Data added successfully" }),
    );
  });
};

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AddNewData component", () => {
  beforeEach(async () => {
    setupFetchMock();
    render(<Wrapper initialUser={{ role: "CONTRIBUTOR" }} />);

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "Postal Codes");
  });

  test("renders the component and toggles form visibility", async () => {
    const toggleButton = screen.getByRole("button", {
      name: /add new data/i,
    });
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
    setupFetchMock();

    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await user.click(toggleButton);

    const cityInput = screen.getByLabelText(/city name/i);
    const codeInput = screen.getByLabelText("Postal Code:");

    const addButton = screen.getByRole("button", { name: /add data/i });

    await user.type(cityInput, "Test City");
    await user.type(codeInput, "12345");

    await user.click(addButton);

    const successNotification = await screen.findByText(
      /Data added successfully/i,
    );
    expect(successNotification).toBeInTheDocument();

    const dataCodeRow = await screen.findByText("12345");

    const dataInputCity = await screen.findByRole("textbox", {
      name: /city for postal code 12345/i,
      value: "Test City",
    });

    const deleteButton = await screen.findByRole("button", { name: /delete/i });

    expect(deleteButton).toBeInTheDocument();
    expect(dataCodeRow).toBeInTheDocument();
    expect(dataInputCity).toBeInTheDocument();
  });
});
