import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../../src/routes";
import { RouterProvider } from "react-router-dom";

const user = userEvent.setup();

vi.spyOn(console, "warn").mockImplementation(() => {});

const router = createMemoryRouter(routes, {
  initialEntries: ["/non-existent-route"],
});

function renderErrorPage() {
  render(<RouterProvider router={router} />);
}

describe("ErrorPage component", () => {
  test("renders error message", async () => {
    renderErrorPage();
    const errorMessage = await screen.findByText(
      /There is nothing here, sorry./i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("renders Go Home link with correct href", async () => {
    renderErrorPage();
    const goHomeLink = await screen.findByRole("link", { name: /Go Home/i });
    expect(goHomeLink).toBeInTheDocument();
    expect(goHomeLink).toHaveAttribute("href", "/");
  });
});

describe("ErrorPage navigation", () => {
  test("navigates to home page when Go Home link is clicked", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderErrorPage();
    const goHomeLink = await screen.findByRole("link", { name: /Go Home/i });
    await user.click(goHomeLink);

    const homePageHeading = await screen.findByRole("heading", {
      name: /Bosnia Lens/i,
    });
    expect(homePageHeading).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
