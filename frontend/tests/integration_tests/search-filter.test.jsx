import { test, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../src/routes";
import userEvent from "@testing-library/user-event";

describe("Search and Filter Tests", () => {
  test("postal codes search input exists and is functional", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, {
      initialEntries: ["/postal-codes"],
    });
    render(<RouterProvider router={router} />);

    const searchInput = await screen.findByLabelText(
      /Postal Code or Municipality/i
    );
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, "Sarajevo");
    expect(searchInput).toHaveValue("Sarajevo");
  });
});
