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

describe("Render SignUp Component", () => {
  test("SignUp component", () => {
    const linkElement = screen.getByRole("heading", {
      name: /Create your account/i,
    });
    expect(linkElement).toBeInTheDocument();
  });

  test("renders SignUp form fields", () => {
    const usernameField = screen.getByLabelText(/Username/i);
    const emailField = screen.getByLabelText(/Email/i);
    const passwordField = screen.getByLabelText("Password");
    const confirmPasswordField = screen.getByLabelText(/Confirm Password/i);
    const signUpButton = screen.getByRole("button", { name: /Create/i });

    expect(usernameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(confirmPasswordField).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});

describe("User interaction with SignUp Component", () => {
  test("allows user to fill out and submit the SignUp form", async () => {
    const user = userEvent.setup();
    const usernameField = screen.getByLabelText(/Username/i);
    const emailField = screen.getByLabelText(/Email/i);
    const passwordField = screen.getByLabelText("Password");
    const confirmPasswordField = screen.getByLabelText(/Confirm Password/i);
    const signUpButton = screen.getByRole("button", { name: /Create/i });

    await user.type(usernameField, "testuser");
    await user.type(emailField, "testuser@example.com");
    await user.type(passwordField, "password123");
    await user.type(confirmPasswordField, "password123");
    await user.click(signUpButton);

    expect(usernameField).toHaveValue("testuser");
    expect(emailField).toHaveValue("testuser@example.com");
    expect(passwordField).toHaveValue("password123");
    expect(confirmPasswordField).toHaveValue("password123");
  });
});
