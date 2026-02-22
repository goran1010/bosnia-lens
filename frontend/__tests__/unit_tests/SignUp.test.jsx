import { test, describe, expect, beforeEach, vi } from "vitest";
import { SignUp } from "../../src/components/SignUp/SignUp";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { UserDataContext } from "../../src/utils/UserDataContext";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { LogIn } from "../../src/components/LogIn/LogIn";

const user = userEvent.setup();

beforeEach(async () => {
  function Wrapper() {
    const [message, setMessage] = useState([]);

    return (
      <UserDataContext value={{ message, setMessage }}>
        <MemoryRouter initialEntries={["/signup"]}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
          </Routes>
        </MemoryRouter>
      </UserDataContext>
    );
  }

  render(<Wrapper />);
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

  test("SignUp form fields", () => {
    const formElements = createFormElements();

    for (let element in formElements) {
      expect(formElements[element]).toBeInTheDocument();
    }
  });
});

describe("User typing in input fields in SignUp Component", () => {
  test("displays user input", async () => {
    const { passwordField, confirmPasswordField, emailField, usernameField } =
      createFormElements();

    await user.type(usernameField, "testuser");
    await user.type(emailField, "testuser@example.com");
    await user.type(passwordField, "Password123!");
    await user.type(confirmPasswordField, "Password123!");

    expect(usernameField).toHaveValue("testuser");
    expect(emailField).toHaveValue("testuser@example.com");
    expect(passwordField).toHaveValue("Password123!");
    expect(confirmPasswordField).toHaveValue("Password123!");
  });
});

describe("SignUp Form Validation on input", () => {
  test("shows validation messages for username input", async () => {
    const { usernameField } = createFormElements();

    await user.type(usernameField, "test");
    expect(usernameField).toHaveValue("test");
    // JSDOM doesn't render browser validation UI so check the input's validationMessage
    expect(usernameField.validationMessage).toMatch(/at least 6 characters/i);

    await user.type(usernameField, "user");
    expect(usernameField).toHaveValue("testuser");
    expect(usernameField.validationMessage).toBe("");
  });

  test("shows validation messages for email input", async () => {
    const { emailField } = createFormElements();

    await user.type(emailField, "te");
    expect(emailField).toHaveValue("te");
    expect(emailField.validationMessage).toMatch(
      /Email must have at least 3 characters/i,
    );
    await user.type(emailField, "st");
    expect(emailField).toHaveValue("test");
    expect(emailField.validationMessage).toMatch(
      /Please include an '@' in the email address. 'test' is missing an '@'./i,
    );
    await user.type(emailField, "@");
    expect(emailField).toHaveValue("test@");
    expect(emailField.validationMessage).toMatch(
      /Please enter a part following '@'. test@ is incomplete./i,
    );
    await user.type(emailField, "mail");
    expect(emailField).toHaveValue("test@mail");
    expect(emailField.validationMessage).toBe("");
  });

  test("shows validation messages for password input", async () => {
    const { passwordField } = createFormElements();

    await user.type(passwordField, "pass");
    expect(passwordField).toHaveValue("pass");
    expect(passwordField.validationMessage).toMatch(/at least 6 characters/i);
    await user.type(passwordField, "word");
    expect(passwordField).toHaveValue("password");
    expect(passwordField.validationMessage).toBe("");
  });

  test("shows validation messages for confirm password input", async () => {
    const { passwordField, confirmPasswordField } = createFormElements();

    await user.type(passwordField, "password");
    expect(passwordField).toHaveValue("password");

    await user.type(confirmPasswordField, "different");
    expect(confirmPasswordField).toHaveValue("different");
    expect(confirmPasswordField.validationMessage).toMatch(/must match/i);
    await user.clear(confirmPasswordField);
    await user.type(confirmPasswordField, "password");
    expect(confirmPasswordField).toHaveValue("password");
    expect(confirmPasswordField.validationMessage).toBe("");
  });
});

describe("SignUp Form Validation on Create button click", () => {
  test("shows validation messages for invalid input when clicking Create button", async () => {
    const { usernameField, signUpButton } = createFormElements();

    await user.type(usernameField, "test");
    expect(usernameField).toHaveValue("test");
    await user.click(signUpButton);
    expect(usernameField.validationMessage).toMatch(/at least 6 characters/i);
    await user.type(usernameField, "user");
    expect(usernameField).toHaveValue("testuser");
    expect(usernameField.validationMessage).toBe("");
  });

  test("shows validation messages for invalid input on Create button click", async () => {
    const { signUpButton, emailField } = createFormElements();

    await user.type(emailField, "te");
    expect(emailField).toHaveValue("te");
    await user.click(signUpButton);
    expect(emailField.validationMessage).toMatch(
      /Email must have at least 3 characters/i,
    );
    await user.type(emailField, "st");
    expect(emailField).toHaveValue("test");
    await user.click(signUpButton);
    expect(emailField.validationMessage).toMatch(
      /Please include an '@' in the email address. 'test' is missing an '@'./i,
    );
    await user.type(emailField, "@");
    expect(emailField).toHaveValue("test@");
    await user.click(signUpButton);
    expect(emailField.validationMessage).toMatch(
      /Please enter a part following '@'. test@ is incomplete./i,
    );
    await user.type(emailField, "mail");
    expect(emailField).toHaveValue("test@mail");
    await user.click(signUpButton);
    expect(emailField.validationMessage).toBe("");
  });

  test("shows validation messages for password input", async () => {
    const { passwordField, signUpButton } = createFormElements();

    await user.type(passwordField, "pass");
    expect(passwordField).toHaveValue("pass");
    await user.click(signUpButton);
    expect(passwordField.validationMessage).toMatch(/at least 6 characters/i);
    await user.type(passwordField, "word");
    expect(passwordField).toHaveValue("password");
    await user.click(signUpButton);
    expect(passwordField.validationMessage).toBe("");
  });

  test("shows validation messages for confirm password input", async () => {
    const { passwordField, confirmPasswordField, signUpButton } =
      createFormElements();

    await user.type(passwordField, "password");
    expect(passwordField).toHaveValue("password");

    await user.type(confirmPasswordField, "different");
    expect(confirmPasswordField).toHaveValue("different");
    await user.click(signUpButton);
    expect(confirmPasswordField.validationMessage).toMatch(/must match/i);
    await user.clear(confirmPasswordField);
    await user.type(confirmPasswordField, "password");
    expect(confirmPasswordField).toHaveValue("password");
    await user.click(signUpButton);
    expect(confirmPasswordField.validationMessage).toBe("");
  });
});

describe("SignUp Form Submit", () => {
  test("Shows error message after clicking Create when fetching with existing username/email", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: "Validation failed",
        details: [
          {
            msg: "Username already in use",
          },
          { msg: "Email already in use" },
        ],
      }),
    });
    const {
      usernameField,
      emailField,
      passwordField,
      confirmPasswordField,
      signUpButton,
    } = createFormElements();

    await user.type(usernameField, "new_user");
    await user.type(emailField, "newemail@mail.com");
    await user.type(passwordField, "Password123!");
    await user.type(confirmPasswordField, "Password123!");

    await user.click(signUpButton);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText(/Username already in use/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Email already in use/i),
    ).toBeInTheDocument();
  });

  test("Redirects to LogIn on successful form submit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Registration successful! Check your email.",
      }),
    });

    const {
      usernameField,
      emailField,
      passwordField,
      confirmPasswordField,
      signUpButton,
    } = createFormElements();

    await user.type(usernameField, "new_user");
    await user.type(emailField, "newemail@mail.com");
    await user.type(passwordField, "Password123!");
    await user.type(confirmPasswordField, "Password123!");

    await user.click(signUpButton);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/Please log in/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Registration successful! Check your email./i),
    ).toBeInTheDocument();
  });
});
