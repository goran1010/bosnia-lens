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
