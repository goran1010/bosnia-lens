import { describe, expect, vi, test } from "vitest";
import userEvent from "@testing-library/user-event";

function createFormElements() {
  return {
    usernameField: screen.getByLabelText(/Username/i),
    emailField: screen.getByLabelText(/Email/i),
    passwordField: screen.getByLabelText("Password"),
    confirmPasswordField: screen.getByLabelText(/Confirm Password/i),
    signUpButton: screen.getByRole("button", { name: /Create/i }),
  };
}

describe.skip("Redirect Tests", () => {
  test("Redirects to LogIn on successful form submit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Registration successful! Check your email.",
      }),
    });

    const formElements = createFormElements();
    const user = userEvent.setup();

    await user.type(formElements.usernameField, "new_user");
    await user.type(formElements.emailField, "newemail@mail.com");
    await user.type(formElements.passwordField, "Password123!");
    await user.type(formElements.confirmPasswordField, "Password123!");

    await user.click(formElements.signUpButton);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText(/Registration successful! Check your email./i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Please log in/i)).toBeInTheDocument();
  });
});
