import { test, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../src/routes";
import UserDataContext from "../../src/utils/UserDataContext";

describe("Navigation Tests", () => {
  test("SignUp page navigation", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
    });
    render(
      <UserDataContext value={{ message: [], setMessage: () => {} }}>
        <RouterProvider router={router} />
      </UserDataContext>
    );

    const linkElement = await screen.findByRole("heading", {
      name: /Create your account/i,
    });
    expect(linkElement).toBeInTheDocument();
  });
});
