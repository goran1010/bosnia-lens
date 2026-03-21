import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { LogIn } from "../../../src/components/LogIn/LogIn";
import { Home } from "../../../src/components/Home/Home";
import { useState } from "react";
import { UserDataContext } from "../../../src/contextData/UserDataContext";
import { useNotification } from "../../../src/customHooks/useNotification";
import { Notifications } from "../../../src/components/Notifications";

vi.mock("../../src/components/utils/getCsrfToken", () => ({
  getCsrfToken: vi.fn().mockResolvedValue("mocked-csrf-token"),
}));

const user = userEvent.setup();

function createFormElements() {
  return {
    usernameField: screen.getByLabelText(/Username/i),
    passwordField: screen.getByLabelText("Password"),
    logInButton: screen.getByRole("button", { name: "Log in" }),
  };
}

beforeEach(async () => {
  function Wrapper() {
    const [userData, setUserData] = useState(null);
    const { notificationValue } = useNotification();

    return (
      <NotificationContext value={notificationValue}>
        <UserDataContext value={{ userData, setUserData }}>
          <MemoryRouter initialEntries={["/login"]}>
            <Notifications />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
            </Routes>
          </MemoryRouter>
        </UserDataContext>
      </NotificationContext>
    );
  }

  render(<Wrapper />);
});

describe("Render LogIn Component", () => {
  test("LogIn component heading", () => {
    const linkElement = screen.getByRole("heading", {
      name: /Log in/i,
    });
    expect(linkElement).toBeInTheDocument();
  });

  test("LogIn form fields", () => {
    const formElements = createFormElements();

    for (let element in formElements) {
      expect(formElements[element]).toBeInTheDocument();
    }
  });
});

describe("User typing in input fields in LogIn Component", () => {
  test("displays user input", async () => {
    const { passwordField, usernameField } = createFormElements();

    await user.type(usernameField, "testuser");
    await user.type(passwordField, "Password123!");

    expect(usernameField).toHaveValue("testuser");
    expect(passwordField).toHaveValue("Password123!");
  });
});

describe("LogIn form validation on input", () => {
  test("shows validation messages for invalid username", async () => {
    const { usernameField } = createFormElements();

    await user.type(usernameField, "test");
    expect(usernameField).toHaveValue("test");
    // JSDOM doesn't render browser validation UI so check the input's validationMessage
    expect(usernameField.validationMessage).toMatch(/at least 6 characters/i);
    await user.type(usernameField, "user");
    expect(usernameField).toHaveValue("testuser");
    expect(usernameField.validationMessage).toBe("");
  });
  test("shows validation messages for invalid password", async () => {
    const { passwordField } = createFormElements();

    await user.type(passwordField, "pass");
    expect(passwordField).toHaveValue("pass");
    expect(passwordField.validationMessage).toMatch(/at least 6 characters/i);
    await user.type(passwordField, "word");
    expect(passwordField).toHaveValue("password");
    expect(passwordField.validationMessage).toBe("");
  });
});

describe("LogIn for validation on button click", () => {
  test("shows validation messages for invalid username input", async () => {
    const { logInButton, usernameField } = createFormElements();

    await user.type(usernameField, "test");
    await user.click(logInButton);

    expect(usernameField).toHaveValue("test");
    expect(usernameField.validationMessage).toMatch(/at least 6 characters/i);

    await user.type(usernameField, "user");
    await user.click(logInButton);

    expect(usernameField).toHaveValue("testuser");
    expect(usernameField.validationMessage).toBe("");
  });

  test("shows validation messages for invalid password input", async () => {
    const { logInButton, passwordField } = createFormElements();

    await user.type(passwordField, "pass");
    await user.click(logInButton);

    expect(passwordField).toHaveValue("pass");
    expect(passwordField.validationMessage).toMatch(/at least 6 characters/i);

    await user.type(passwordField, "word");
    await user.click(logInButton);

    expect(passwordField).toHaveValue("password");
    expect(passwordField.validationMessage).toBe("");
  });
});

describe("LogIn Form Submit", () => {
  test("Shows error message after clicking Create when fetching with wrong username/password", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          message: "CSRF token generated successfully",
          data: "123",
        }),
      })
      .mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: "Validation failed",
          details: [
            {
              msg: "Invalid username or password",
            },
          ],
        }),
      });

    const { logInButton, usernameField, passwordField } = createFormElements();

    await user.type(usernameField, "existing_user");
    await user.type(passwordField, "Password123!");

    await user.click(logInButton);
    const errorMessage = await screen.findByText(
      /Invalid username or password/i,
    );

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(errorMessage).toBeInTheDocument();
  });

  test("Redirects to Home on successful form submit", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          message: "CSRF token generated successfully",
          data: "123",
        }),
      })
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          username: "new_user",
        }),
      });

    const { usernameField, passwordField, logInButton } = createFormElements();

    await user.type(usernameField, "new_user");
    await user.type(passwordField, "Password123!");

    await user.click(logInButton);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByText(/A free, open-source project/i),
    ).toBeInTheDocument();
  });
});
