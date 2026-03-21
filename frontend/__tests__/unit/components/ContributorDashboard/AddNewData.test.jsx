import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AddNewData } from "../../../../src/components/ContributorDashboard/AddNewData";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";
import userEvent from "@testing-library/user-event";

const mockAddNotification = vi.fn();

beforeEach(() => {
  mockAddNotification.mockClear();
});

const renderComponent = () => {
  return render(
    <NotificationContext
      value={{
        addNotification: mockAddNotification,
      }}
    >
      <AddNewData setLoading={vi.fn()} setSearchResult={vi.fn()} />
    </NotificationContext>,
  );
};

describe("AddNewData component", () => {
  test("renders the component and toggles form visibility", async () => {
    renderComponent();

    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    expect(toggleButton).toBeInTheDocument();

    expect(screen.queryByLabelText(/city name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/postal code/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/postal carrier/i)).not.toBeInTheDocument();

    await userEvent.click(toggleButton);

    expect(screen.getByLabelText(/city name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal carrier/i)).toBeInTheDocument();

    await userEvent.click(toggleButton);

    expect(screen.queryByLabelText(/city name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/postal code/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/postal carrier/i)).not.toBeInTheDocument();
  });

  test("validates input fields on change", async () => {
    renderComponent();

    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await userEvent.click(toggleButton);

    const cityInput = screen.getByLabelText(/city name/i);
    const codeInput = screen.getByLabelText(/postal code/i);

    await userEvent.type(cityInput, "Test City");
    expect(cityInput).toHaveValue("Test City");

    await userEvent.type(codeInput, "12345");
    expect(codeInput).toHaveValue("12345");
  });

  test("validates postal code input field and shows error for invalid postal code", async () => {
    renderComponent();

    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await userEvent.click(toggleButton);

    const codeInput = screen.getByLabelText(/postal code/i);

    await userEvent.type(codeInput, "abcde");
    expect(codeInput).toHaveValue("abcde");

    expect(codeInput.validationMessage).toMatch(
      /Postal code must be a 5-digit number/i,
    );

    await userEvent.clear(codeInput);
    await userEvent.type(codeInput, "12345");

    expect(codeInput).toHaveValue("12345");
    expect(codeInput.validationMessage).toBe("");
  });

  test("validates required fields and shows error when trying to submit with empty required fields", async () => {
    renderComponent();

    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await userEvent.click(toggleButton);

    const addButton = screen.getByRole("button", { name: /add data/i });

    await userEvent.click(addButton);

    const cityInput = screen.getByLabelText(/city name/i);

    expect(cityInput.validationMessage).toMatch(/City name cannot be empty/i);

    await userEvent.type(cityInput, "Test City");

    await userEvent.click(addButton);
    expect(cityInput.validationMessage).toBe("");

    const codeInput = screen.getByLabelText(/postal code/i);

    expect(codeInput.validationMessage).toMatch(
      /Postal code must be a 5-digit number/i,
    );

    await userEvent.type(codeInput, "12345");
    expect(codeInput.validationMessage).toBe("");
  });

  test("successfully submits data and shows success notification", async () => {
    renderComponent();

    const toggleButton = screen.getByRole("button", { name: /add new data/i });
    await userEvent.click(toggleButton);

    const cityInput = screen.getByLabelText(/city name/i);
    const codeInput = screen.getByLabelText(/postal code/i);

    const addButton = screen.getByRole("button", { name: /add data/i });

    await userEvent.type(cityInput, "Test City");
    await userEvent.type(codeInput, "12345");

    await userEvent.click(addButton);

    expect(mockAddNotification).toHaveBeenCalledWith({
      type: "success",
      message: "Data added successfully",
    });
  });
});
