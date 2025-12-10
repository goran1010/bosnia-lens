import { test, describe, expect, beforeEach } from "vitest";
import SignUp from "../../src/components/SignUp/SignUp";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserDataContext from "../../src/utils/UserDataContext";
import { userEvent } from "@testing-library/user-event";

beforeEach(() => {
  render(
    <MemoryRouter>
      <UserDataContext value={{ message: [], setMessage: () => {} }}>
        <SignUp />
      </UserDataContext>
    </MemoryRouter>
  );
});

function createFormElements() {
  return {
    usernameField: screen.getByLabelText(/Username/i),
    emailField: screen.getByLabelText(/Email/i),
    passwordField: screen.getByLabelText("Password"),
    confirmPasswordField: screen.getByLabelText(/Confirm Password/i),
    signUpButton: screen.getByRole("button", { name: /Create/i }),
  };
}

describe("Render SignUp Component", () => {
  test("SignUp component heading", () => {
    const linkElement = screen.getByRole("heading", {
      name: /Create your account/i,
    });
    expect(linkElement).toBeInTheDocument();
  });

  test("renders SignUp form fields", () => {
    const formElements = createFormElements();

    for (let element in formElements) {
      expect(formElements[element]).toBeInTheDocument();
    }
  });
});

describe("User typing in input fields in SignUp Component", () => {
  test("allows user to fill out and submit the SignUp form", async () => {
    const formElements = createFormElements();
    const user = userEvent.setup();

    await user.type(formElements.usernameField, "testuser");
    await user.type(formElements.emailField, "testuser@example.com");
    await user.type(formElements.passwordField, "Password123!");
    await user.type(formElements.confirmPasswordField, "Password123!");

    expect(formElements.usernameField).toHaveValue("testuser");
    expect(formElements.emailField).toHaveValue("testuser@example.com");
    expect(formElements.passwordField).toHaveValue("Password123!");
    expect(formElements.confirmPasswordField).toHaveValue("Password123!");
  });
});

describe("SignUp Form Validation", () => {
  test("shows validation messages for invalid input", async () => {
    const user = userEvent.setup();
    const usernameField = screen.getByLabelText(/Username/i);
    await user.type(usernameField, "test");
    expect(usernameField).toHaveValue("test");
    // JSDOM doesn't render browser validation UI so check the input's validationMessage
    expect(usernameField.validationMessage).toMatch(/at least 6 characters/i);

    const emailField = screen.getByLabelText(/Email/i);
    await user.type(emailField, "te");
    expect(emailField).toHaveValue("te");
    expect(emailField.validationMessage).toMatch(
      /Email must have at least 3 characters/i
    );
    await user.type(emailField, "st");
    expect(emailField).toHaveValue("test");
    expect(emailField.validationMessage).toMatch(
      /Please include an '@' in the email address. 'test' is missing an '@'./i
    );
    await user.type(emailField, "@");
    expect(emailField).toHaveValue("test@");
    expect(emailField.validationMessage).toMatch(
      /Please enter a part following '@'. test@ is incomplete./i
    );
    await user.type(emailField, "mail");
    expect(emailField).toHaveValue("test@mail");
    expect(emailField.validationMessage).toBe("");
  });
});
