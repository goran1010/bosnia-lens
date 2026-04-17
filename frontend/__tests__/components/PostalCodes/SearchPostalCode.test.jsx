import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PostalCodes } from "../../../src/components/PostalCodes/PostalCodes";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../src/contextData/UserDataContext";
import { useNotification } from "../../../src/customHooks/useNotification";
import { Notifications } from "../../../src/components/Notifications";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

let fetchSpy;

beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [{ id: 1, code: "12345", city: "Sarajevo" }],
          message: "Postal codes retrieved successfully.",
        }),
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

function Wrapper({ initialUser = null }) {
  const [userData, setUserData] = useState(initialUser);
  const { notifications, addNotification, removeNotification } = useNotification();

  return (
    <NotificationContext value={{ notifications, addNotification, removeNotification }}>
      <UserDataContext value={{ userData, setUserData }}>
        <MemoryRouter initialEntries={["/postal-codes"]}>
          <Notifications />
          <Routes>
            <Route path="/postal-codes" element={<PostalCodes />} />
          </Routes>
        </MemoryRouter>
      </UserDataContext>
    </NotificationContext>
  );
}

describe("SearchPostalCode component", () => {
  beforeEach(() => {
    render(<Wrapper initialUser={null} />);
  });

  test("renders search input and label", () => {
    const label = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    expect(label).toBeInTheDocument();
  });

  test("validates invalid postal code input", async () => {
    const input = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    await user.type(input, "12345");
    expect(input.value).toBe("12345");
    await user.clear(input);
    await user.type(input, "1234");
    expect(input.validationMessage).toBe(
      "Postal code must be a 5-digit number",
    );
    await user.clear(input);
    await user.type(input, "a");
    expect(input.validationMessage).toBe(
      "Search must have at least 2 characters",
    );
  });

  test("accepts valid postal code input", async () => {
    const input = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    await user.type(input, "12345");
    expect(input.value).toBe("12345");
    expect(input.validationMessage).toBe("");
  });

  test("accepts valid municipality input", async () => {
    const input = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    await user.type(input, "Sarajevo");
    expect(input.value).toBe("Sarajevo");
    expect(input.validationMessage).toBe("");
  });
});

describe("SearchPostalCode component - API interaction", () => {
  beforeEach(() => {
    render(<Wrapper initialUser={null} />);
  });

  test("displays success notification on successful search", async () => {
    const input = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    await user.type(input, "12345");
    await user.keyboard("{Enter}");
    const notification = await screen.findByText(
      /Postal codes retrieved successfully./i,
    );
    expect(notification).toBeInTheDocument();

    const postalCode = await screen.findByText(/12345/i);
    const municipality = await screen.findByText(/Sarajevo/i);

    expect(postalCode).toBeInTheDocument();
    expect(municipality).toBeInTheDocument();
  });

  test("displays error notification on failed search", async () => {
    fetchSpy.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            error: "Postal code not found",
            details: [{ msg: null }],
          }),
      }),
    );

    const input = screen.getByLabelText(
      /Search by Postal Code or Municipality/i,
    );
    await user.type(input, "invalid");
    await user.keyboard("{Enter}");
    const notification = await screen.findByText(/Postal code not found/i);
    expect(notification).toBeInTheDocument();
  });
});
