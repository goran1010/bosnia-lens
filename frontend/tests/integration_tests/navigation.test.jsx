import { test, describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../src/routes";
import UserDataContext from "../../src/utils/UserDataContext";

vi.mock("../../src/customHooks/useWeatherCheck", () => ({
  default: (setWeatherForecast, setLoading) => {
    setWeatherForecast([
      { datetime: "2025-12-08", temp: 5, iconURL: "icon.svg" },
    ]);
    setLoading(false);
  },
}));

describe("Navigation when loading a route", () => {
  test("render Error Page when visiting non-existent route", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/non-existent-route"],
    });
    render(<RouterProvider router={router} />);

    const linkElement = screen.getByText(/There is nothing here, sorry./i);
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

  test("navigate to Postal Codes page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/postal-codes"],
    });
    render(
      <UserDataContext value={{ message: [], setMessage: () => {} }}>
        <RouterProvider router={router} />
      </UserDataContext>
    );

    const linkElement = await screen.findByText(/Postal Code or Municipality/i);
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

    const linkElement = screen.getByText(/Bosnia Lens/i);
    expect(linkElement).toBeInTheDocument();
  });

  test.each(["/", "/postal-codes", "/universities", "/holidays"])(
    "render Footer on every page",
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
    "render Navbar on every page",
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

describe("Navigation when clicking links in Navbar", () => {
  test.only("clicking Universities link navigates to Universities page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);

    const user = userEvent.setup();
    const universitiesLink = await screen.findByRole("link", {
      name: /Universities/i,
    });
    expect(universitiesLink).toBeInTheDocument();

    await user.click(universitiesLink);

    const text = await screen.findByText(/Universities Page/i);
    expect(text).toBeInTheDocument();
  });

  test("clicking Postal Codes link navigates to Postal Codes page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(
      <UserDataContext value={{ message: [], setMessage: () => {} }}>
        <RouterProvider router={router} />
      </UserDataContext>
    );

    const user = userEvent.setup();
    const postalCodesLink = screen.getByRole("link", {
      name: /Postal Codes/i,
    });

    await user.click(postalCodesLink);

    screen.debug();
    const linkElement = await screen.findByText(/Postal Code or Municipality/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("clicking Holidays link navigates to Holidays page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);

    const user = userEvent.setup();
    const holidaysLink = screen.getByRole("link", { name: /Holidays/i });
    await user.click(holidaysLink);

    const linkElements = await screen.findAllByText(/Holidays/i);
    expect(linkElements[0]).toBeInTheDocument();
  });

  test("clicking Home link navigates to Home page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/postal-codes"],
    });
    render(<RouterProvider router={router} />);

    const user = userEvent.setup();
    const homeLink = screen.getByRole("link", { name: /Home/i });
    await user.click(homeLink);

    const linkElement = await screen.findByText(/Bosnia Lens/i);
    expect(linkElement).toBeInTheDocument();
  });
});
