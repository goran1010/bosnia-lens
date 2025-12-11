import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import UserDataContext from "../../src/utils/UserDataContext";
import LogIn from "../../src/components/LogIn/LogIn";

function createFormElements() {
  return {
    usernameField: screen.getByLabelText(/Username/i),
    passwordField: screen.getByLabelText("Password"),
    logInButton: screen.getByRole("button", { name: /Log in/i }),
  };
}

beforeEach(async () => {
  render(
    <MemoryRouter>
      <UserDataContext value={{ message: [], setMessage: () => {} }}>
        <LogIn />
      </UserDataContext>
    </MemoryRouter>
  );
});

describe("Render LogIn Component", () => {
  test("LogIn component heading", () => {
    const linkElement = screen.getByRole("heading", {
      name: /Please log in/i,
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
    const formElements = createFormElements();
    const user = userEvent.setup();

    await user.type(formElements.usernameField, "testuser");
    await user.type(formElements.passwordField, "Password123!");

    expect(formElements.usernameField).toHaveValue("testuser");
    expect(formElements.passwordField).toHaveValue("Password123!");
  });
});

describe("LogIn form validation", () => {
  test("shows validation messages for invalid input", async () => {
    const user = userEvent.setup();
    const usernameField = screen.getByLabelText(/Username/i);
    await user.type(usernameField, "test");
    expect(usernameField).toHaveValue("test");
    // JSDOM doesn't render browser validation UI so check the input's validationMessage
    expect(usernameField.validationMessage).toMatch(/at least 6 characters/i);
    await user.type(usernameField, "user");
    expect(usernameField).toHaveValue("testuser");
    expect(usernameField.validationMessage).toBe("");

    const passwordField = screen.getByLabelText("Password");
    await user.type(passwordField, "pass");
    expect(passwordField).toHaveValue("pass");
    expect(passwordField.validationMessage).toMatch(/at least 6 characters/i);
    await user.type(passwordField, "word");
    expect(passwordField).toHaveValue("password");
    expect(passwordField.validationMessage).toBe("");
  });

  test("shows validation messages for invalid input on Login button click", async () => {
    const logInButton = screen.getByRole("button", { name: /Log in/i });

    const user = userEvent.setup();
    const usernameField = screen.getByLabelText(/Username/i);
    await user.type(usernameField, "test");
    await user.click(logInButton);
    expect(usernameField).toHaveValue("test");
    // JSDOM doesn't render browser validation UI so check the input's validationMessage
    expect(usernameField.validationMessage).toMatch(/at least 6 characters/i);
    await user.type(usernameField, "user");
    await user.click(logInButton);
    expect(usernameField).toHaveValue("testuser");
    expect(usernameField.validationMessage).toBe("");

    const passwordField = screen.getByLabelText("Password");
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
