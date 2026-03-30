import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router-dom";
import { routes } from "../../../src/routes";
import { RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

const fetchSpy = vi.spyOn(globalThis, "fetch");

vi.spyOn(console, "error").mockImplementation(() => {});

function renderRoot() {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/"],
  });

  render(<RouterProvider router={router} />);
}

describe("Root component", () => {
  fetchSpy.mockImplementation((url) => {
    if (url.endsWith("/api")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          message: "Server is LIVE",
          data: null,
        }),
      });
    }
  });

  test("renders Home heading if server is live", async () => {
    renderRoot();
    const homeHeading = await screen.findByRole("heading", {
      name: /Bosnia Lens/i,
    });
    expect(homeHeading).toBeInTheDocument();
  });

  test("renders Profile link when user is logged in", async () => {
    fetchSpy.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          message: "User retrieved successfully.",
          data: {
            id: 1,
            username: "testuser",
            email: "testuser@example.com",
          },
        }),
      });
    });

    renderRoot();

    const notificationSuccess = await screen.findByText(
      /Login status checked successfully./i,
    );
    expect(notificationSuccess).toBeInTheDocument();
    const profileLink = await screen.findByRole("link", { name: /Profile/i });
    expect(profileLink).toBeInTheDocument();
  });

  test("renders Log In link when user is not logged in", async () => {
    fetchSpy.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        json: async () => ({
          error: "User not authenticated.",
        }),
      });
    });

    renderRoot();

    const notificationError = await screen.findByText(
      /User not authenticated./i,
    );
    expect(notificationError).toBeInTheDocument();
    const loginLink = await screen.findByRole("link", { name: /Log In/i });
    expect(loginLink).toBeInTheDocument();
  });
});

describe("Root component - Menu interaction", () => {
  fetchSpy.mockImplementation((url) => {
    if (url.endsWith("/api")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          message: "Server is LIVE",
          data: null,
        }),
      });
    }
  });

  test("closes menu when main content is clicked", async () => {
    fetchSpy.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        json: async () => ({
          error: "User not authenticated.",
        }),
      });
    });

    renderRoot();

    const menuButton = await screen.findByRole("button", { name: /Menu/i });
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mainContent = await screen.findByRole("main");
    await user.click(mainContent);

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
