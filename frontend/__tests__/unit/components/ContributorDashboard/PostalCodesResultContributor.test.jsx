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

const createFetchResponse = (result, ok = true) => ({
  ok,
  json: async () => result,
});

const fetchMock = vi.fn();

vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);

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

describe("PostalCodesResultContributor component", () => {
  beforeEach(async () => {
    setupFetchMock();
    render(<Wrapper initialUser={{ role: "CONTRIBUTOR" }} />);

    const selectElement = screen.getByLabelText(/Choose dataset/i);
    await user.selectOptions(selectElement, "Postal Codes");

    const getAllButton = screen.getByRole("button", { name: /get all/i });
    await user.click(getAllButton);
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
    fetchMock
      .mockImplementationOnce(() =>
        Promise.resolve(
          createFetchResponse({
            data: "mocked-csrf-token",
            message: "CSRF token generated successfully",
          }),
        ),
      )
      .mockImplementationOnce(() =>
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
    fetchMock
      .mockImplementationOnce(() =>
        Promise.resolve(
          createFetchResponse({
            data: "mocked-csrf-token",
            message: "CSRF token generated successfully",
          }),
        ),
      )
      .mockRejectedValueOnce(new Error("Delete failed"));

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
    fetchMock
      .mockImplementationOnce(() =>
        Promise.resolve(
          createFetchResponse({
            data: "mocked-csrf-token",
            message: "CSRF token generated successfully",
          }),
        ),
      )
      .mockImplementationOnce(() =>
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
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve(
        createFetchResponse("Failed to retrieve CSRF token", false),
      ),
    );

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
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve(
        createFetchResponse("Failed to retrieve CSRF token", false),
      ),
    );

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
