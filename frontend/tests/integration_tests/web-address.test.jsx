import { test, describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

describe("Loading components when visiting an address", () => {
  test("render Error Page when visiting non-existent address", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/non-existent-address"],
    });
    render(<RouterProvider router={router} />);

    const linkElement = screen.getByText(/There is nothing here, sorry./i);
    expect(linkElement).toBeInTheDocument();
  });

  test("visit universities page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/universities"],
    });
    render(<RouterProvider router={router} />);

    const linkElements = screen.getAllByText(/Universities/i);
    expect(linkElements[0]).toBeInTheDocument();
  });

  test("visit postal codes page", async () => {
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

  test("visit holidays page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/holidays"],
    });
    render(<RouterProvider router={router} />);

    const linkElements = screen.getAllByText(/Holidays/i);
    expect(linkElements[0]).toBeInTheDocument();
  });

  test("visit home page", () => {
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

      const footerEmail = screen.getByText(/goran1010jovic@gmail.com/i);
      const footerAuthor = screen.getByText(/Goran Jović/i);
      expect(footerEmail).toBeInTheDocument();
      expect(footerAuthor).toBeInTheDocument();
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
