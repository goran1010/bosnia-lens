import { test, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../src/routes";

describe("Accessibility Tests", () => {
  test("navigation links are keyboard accessible", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);

    const homeLink = screen.getByRole("link", { name: /Home/i });
    const universitiesLink = screen.getByRole("link", {
      name: /Universities/i,
    });
    const postalCodesLink = screen.getByRole("link", {
      name: /Postal Codes/i,
    });
    const holidaysLink = screen.getByRole("link", { name: /Holidays/i });

    expect(homeLink).toBeInTheDocument();
    expect(universitiesLink).toBeInTheDocument();
    expect(postalCodesLink).toBeInTheDocument();
    expect(holidaysLink).toBeInTheDocument();

    expect(homeLink).toHaveAttribute("href");
    expect(universitiesLink).toHaveAttribute("href");
    expect(postalCodesLink).toHaveAttribute("href");
    expect(holidaysLink).toHaveAttribute("href");
  });

  test("external links have proper security attributes", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    const { container } = render(<RouterProvider router={router} />);

    const externalLinks = container.querySelectorAll(
      'a[href^="http://"], a[href^="https://"]'
    );

    externalLinks.forEach((link) => {
      if (!link.href.includes(window.location.hostname)) {
        const rel = link.getAttribute("rel");
        if (rel) {
          expect(rel).toMatch(/noopener|noreferrer/);
        }
      }
    });
  });

  test("images have alt text", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    const { container } = render(<RouterProvider router={router} />);

    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });
  });
});
