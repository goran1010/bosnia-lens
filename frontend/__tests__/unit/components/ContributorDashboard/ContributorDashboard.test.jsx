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

const { getCsrfTokenMock } = vi.hoisted(() => ({
  getCsrfTokenMock: vi.fn(),
}));

vi.mock("../../../../src/components/utils/getCsrfToken", () => {
  return {
    getCsrfToken: getCsrfTokenMock,
  };
});

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

const createFetchResponse = (result, ok = true) => ({
  ok,
  json: async () => result,
});

const fetchMock = vi.fn();

vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);

beforeEach(() => {
  getCsrfTokenMock.mockReset();
  getCsrfTokenMock.mockResolvedValue("mocked-csrf-token");
});

const setupFetchMock = () => {
  fetchMock.mockReset();
  fetchMock.mockImplementation((requestUrl) => {
    if (requestUrl.includes("/users/contributor")) {
      return Promise.resolve(
        createFetchResponse({
          data: {
            id: 1,
            city: "Test City",
            code: "12345",
            post: "",
          },

          message: "Success",
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
      createFetchResponse({ data: [], message: "Success" }),
    );
  });
};

describe("render ContributorDashboard component", () => {
  test("render message if user doesn't exist", async () => {
    render(<Wrapper />);

    const paragraphElement = await screen.findByText(
      /You need to be logged in and a contributor to see the contributor dashboard./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });

  test("render message if user is not a contributor", async () => {
    render(<Wrapper initialUser={{ role: "USER" }} />);

    const paragraphElement = await screen.findByText(
      /You need to be a contributor to see the contributor dashboard./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });
});

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

describe("SearchPostalCode component", () => {
  beforeEach(async () => {
    setupFetchMock();
    render(<Wrapper initialUser={{ role: "CONTRIBUTOR" }} />);

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "Postal Codes");
  });

  test("renders search input and button", async () => {
    const searchInput = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    const searchButton = screen.getByRole("button", { name: /search/i });

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test("validates search input and shows error for invalid postal code", async () => {
    const searchInput = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );

    await user.type(searchInput, "1234567");
    expect(searchInput).toHaveValue("1234567");

    expect(searchInput.validationMessage).toMatch(
      /Postal code must be a 5-digit number/i,
    );

    await user.clear(searchInput);
    await user.type(searchInput, "12345");

    expect(searchInput).toHaveValue("12345");
    expect(searchInput.validationMessage).toBe("");
  });

  test("shows error notification when search fails", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(createFetchResponse({ error: "Search failed" }, false)),
    );

    const searchInput = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.type(searchInput, "12345");
    await user.click(searchButton);

    const errorNotification = await screen.findByText(/Search failed/i);
    expect(errorNotification).toBeInTheDocument();
  });

  test("shows error notification when search throws an error", async () => {
    fetchMock.mockImplementation(() =>
      Promise.reject(new Error("Network error")),
    );

    const searchInput = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.type(searchInput, "12345");
    await user.click(searchButton);

    const errorNotification = await screen.findByText(
      /An error occurred while searching for postal codes/i,
    );
    expect(errorNotification).toBeInTheDocument();
  });

  test("shows search results in the table", async () => {
    setupFetchMock();

    const searchInput = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.type(searchInput, "12345");
    await user.click(searchButton);

    const successNotification = await screen.findByText(
      /Postal codes retrieved successfully/i,
    );
    expect(successNotification).toBeInTheDocument();

    const dataCodeRow = await screen.findByText("12345");
    const dataInputCity = await screen.findByRole("textbox", {
      name: /city for postal code 12345/i,
      value: "Test City",
    });
    expect(dataCodeRow).toBeInTheDocument();
    expect(dataInputCity).toBeInTheDocument();
  });
});

describe("GetAllPostalCodes component", () => {
  beforeEach(async () => {
    setupFetchMock();
    render(<Wrapper initialUser={{ role: "CONTRIBUTOR" }} />);

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "Postal Codes");
  });

  test("renders Get All button", async () => {
    const getAllButton = screen.getByRole("button", { name: /get all/i });
    expect(getAllButton).toBeInTheDocument();
  });

  test("shows success notification and results when Get All is successful", async () => {
    setupFetchMock();

    const getAllButton = screen.getByRole("button", { name: /get all/i });
    await user.click(getAllButton);

    const successNotification = await screen.findByText(
      /Postal codes and municipalities retrieved successfully/i,
    );
    expect(successNotification).toBeInTheDocument();

    const dataCodeRow = await screen.findByText("12345");
    const dataInputCity = await screen.findByRole("textbox", {
      name: /city for postal code 12345/i,
      value: "Test City",
    });
    expect(dataCodeRow).toBeInTheDocument();
    expect(dataInputCity).toBeInTheDocument();
  });

  test("shows error notification when Get All fails", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(createFetchResponse({ error: "Get All failed" }, false)),
    );

    const getAllButton = screen.getByRole("button", { name: /get all/i });
    await user.click(getAllButton);

    const errorNotification = await screen.findByText(/Get All failed/i);
    expect(errorNotification).toBeInTheDocument();
  });

  test("shows error notification when Get All throws an error", async () => {
    fetchMock.mockImplementation(() =>
      Promise.reject(new Error("Network error")),
    );

    const getAllButton = screen.getByRole("button", { name: /get all/i });
    await user.click(getAllButton);

    const errorNotification = await screen.findByText(
      /An error occurred while fetching postal codes and municipalities/i,
    );
    expect(errorNotification).toBeInTheDocument();
  });
});

describe("PostalCodesResultContributor component", () => {
  beforeEach(async () => {
    setupFetchMock();
    render(<Wrapper initialUser={{ role: "CONTRIBUTOR" }} />);

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "Postal Codes");

    const getAllButton = screen.getByRole("button", { name: /get all/i });
    await user.click(getAllButton);

    await screen.findByText("12345");
  });

  test("renders search results in the table", async () => {
    const successNotification = await screen.findByText(
      /Postal codes and municipalities retrieved successfully/i,
    );
    expect(successNotification).toBeInTheDocument();

    const dataCodeRow = await screen.findByText("12345");
    const dataInputCity = await screen.findByRole("textbox", {
      name: /city for postal code 12345/i,
      value: "Test City",
    });
    expect(dataCodeRow).toBeInTheDocument();
    expect(dataInputCity).toBeInTheDocument();
  });

  test("shows no results message when searchResult is empty", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(createFetchResponse({ data: [], message: "Success" })),
    );

    const getAllButton = screen.getByRole("button", { name: /get all/i });
    await user.click(getAllButton);

    const noResultsMessage = await screen.findByText(/No results to display/i);
    expect(noResultsMessage).toBeInTheDocument();
  });

  test("shows error notification when edit fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Edit failed"));

    const editButtons = await screen.findAllByRole("button", { name: /save/i });
    const editButton = editButtons[0];
    await user.click(editButton);

    const errorNotification = await screen.findByText(
      /An error occurred while updating the postal code/i,
    );
    expect(errorNotification).toBeInTheDocument();
  });

  test("shows success notification and updates data when edit is successful", async () => {
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve(
        createFetchResponse({
          data: {
            id: 1,
            city: "Updated City",
            code: "12345",
            post: "",
          },
          message: "Data updated successfully",
        }),
      ),
    );

    const cityInput = await screen.findByDisplayValue("Test City");
    await user.clear(cityInput);
    await user.type(cityInput, "Updated City");

    const editButtons = await screen.findAllByRole("button", { name: /save/i });
    const editButton = editButtons[0];
    await user.click(editButton);

    const successNotification = await screen.findByText(
      /Postal code updated successfully/i,
    );
    expect(successNotification).toBeInTheDocument();

    const updatedCityInput = await screen.findByDisplayValue("Updated City");
    expect(updatedCityInput).toBeInTheDocument();
  });

  test("shows error notification when delete fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Delete failed"));

    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });
    const deleteButton = deleteButtons[0];
    await user.click(deleteButton);

    const errorNotification = await screen.findByText(
      /An error occurred while deleting the postal code/i,
    );
    expect(errorNotification).toBeInTheDocument();
  });

  test("shows success notification and removes data when delete is successful", async () => {
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve(
        createFetchResponse({
          data: { code: "12345" },
          message: "Postal code deleted successfully",
        }),
      ),
    );

    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });
    const deleteButton = deleteButtons[0];
    await user.click(deleteButton);

    const successNotification = await screen.findByText(
      /Postal code deleted successfully/i,
    );
    expect(successNotification).toBeInTheDocument();

    const dataCodeRow = screen.queryByText("12345");
    expect(dataCodeRow).not.toBeInTheDocument();
  });

  test("shows error when csrfToken retrieval fails during edit", async () => {
    getCsrfTokenMock.mockResolvedValueOnce(false);

    const cityInput = await screen.findByDisplayValue("Test City");
    await user.clear(cityInput);
    await user.type(cityInput, "Updated City");

    const editButtons = await screen.findAllByRole("button", { name: /save/i });
    const editButton = editButtons[0];
    await user.click(editButton);

    const errorNotification = await screen.findByText(
      /Failed to retrieve CSRF token/i,
    );
    expect(errorNotification).toBeInTheDocument();
  });

  test("shows error when csrfToken retrieval fails during delete", async () => {
    getCsrfTokenMock.mockResolvedValueOnce(false);

    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });
    const deleteButton = deleteButtons[0];
    await user.click(deleteButton);

    const errorNotification = await screen.findByText(
      /Failed to retrieve CSRF token/i,
    );
    expect(errorNotification).toBeInTheDocument();
  });
});
