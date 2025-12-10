import { test, describe, expect } from "vitest";
import SignUp from "../../src/components/SignUp/SignUp";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserDataContext from "../../src/utils/UserDataContext";

describe("Render SignUp Component", () => {
  test("SignUp component", () => {
    render(
      <MemoryRouter>
        <UserDataContext value={{ message: [], setMessage: () => {} }}>
          <SignUp />
        </UserDataContext>
      </MemoryRouter>
    );

    const linkElement = screen.getByRole("heading", {
      name: /Create your account/i,
    });
    expect(linkElement).toBeInTheDocument();
  });
});
