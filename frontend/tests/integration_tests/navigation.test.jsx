import { test, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../src/routes";

describe("Navigation Integration Tests", () => {
  test("render Error Page when visiting non-existent route", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/non-existent-route"],
    });
    render(<RouterProvider router={router} />);

    const linkElement = screen.getByText(/This is a custom 404 error page./i);
    expect(linkElement).toBeInTheDocument();
  });

  test("navigate to Universities page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/universities"],
    });
    render(<RouterProvider router={router} />);

    const linkElements = screen.getAllByText(/Universities/i);
    expect(linkElements[0]).toBeInTheDocument();
  });

  test("navigate to Postal Codes page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/postal-codes"],
    });
    render(<RouterProvider router={router} />);

    const linkElement = screen.getByText(/Postal Code or Municipality/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("navigate to Holidays page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/holidays"],
    });
    render(<RouterProvider router={router} />);

    const linkElements = screen.getAllByText(/Holidays/i);
    expect(linkElements[0]).toBeInTheDocument();
  });

  test("navigate to Home page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);

    const linkElement = screen.getByText(/Welcome to Bosnia Lens/i);
    expect(linkElement).toBeInTheDocument();
  });

  test.each(["/", "/postal-codes", "/universities", "/holidays"])(
    "render Footer on %s page",
    (route) => {
      const router = createMemoryRouter(routes, {
        initialEntries: [route],
      });
      render(<RouterProvider router={router} />);

      const footer = screen.getByText(/goran1010jovic@gmail.com/i);
      expect(footer).toBeInTheDocument();
    }
  );

  test.each(["/", "/postal-codes", "/universities", "/holidays"])(
    "render Navbar on %s page",
    (route) => {
      const router = createMemoryRouter(routes, {
        initialEntries: [route],
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
    }
  );
});
