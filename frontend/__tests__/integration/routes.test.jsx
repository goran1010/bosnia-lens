import { test, describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../../src/routes";
import { UserDataContext } from "../../src/contextData/UserDataContext";

vi.mock("../../src/customHooks/useWeatherCheck", () => ({
  default: (setWeatherForecast, setLoading) => {
    setWeatherForecast([
      { datetime: "2025-12-08", temp: 5, iconURL: "icon.svg" },
    ]);
    setLoading(false);
  },
}));

vi.spyOn(globalThis, "fetch").mockResolvedValue({
  ok: true,
  json: async () => ({
    data: [{ id: 1, code: "mocked code" }],
    message: "mocked message",
  }),
});

describe("Loading components when visiting an address", () => {
  test("render Error Page when visiting non-existent address", async () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const router = createMemoryRouter(routes, {
      initialEntries: ["/non-existent-address"],
    });
    render(<RouterProvider router={router} />);

    const linkElement = await screen.findByText(
      /There is nothing here, sorry./i,
    );
    expect(linkElement).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test("visit universities page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/universities"],
    });
    render(<RouterProvider router={router} />);

    const linkElements = await screen.findAllByText(/Universities/i);
    expect(linkElements[0]).toBeInTheDocument();
  });

  test("visit postal codes page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/postal-codes"],
    });
    render(
      <UserDataContext value={{ message: [], setMessage: () => {} }}>
        <RouterProvider router={router} />
      </UserDataContext>,
    );

    const linkElement = await screen.findByText(/Postal Code or Municipality/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("visit holidays page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/holidays"],
    });
    render(<RouterProvider router={router} />);

    const linkElements = await screen.findAllByText(/Holidays/i);
    expect(linkElements[0]).toBeInTheDocument();
  });

  test("visit home page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);

    const linkElement = await screen.findByText(/Bosnia Lens/i);
    expect(linkElement).toBeInTheDocument();
  });

  test.each(["/", "/postal-codes", "/universities", "/holidays"])(
    "render Footer on every page",
    async (route) => {
      const router = createMemoryRouter(routes, {
        initialEntries: [route],
      });
      render(<RouterProvider router={router} />);

      const footerEmail = await screen.findByText(/goran1010jovic@gmail.com/i);
      const footerAuthor = await screen.findByText(/Goran Jović/i);
      expect(footerEmail).toBeInTheDocument();
      expect(footerAuthor).toBeInTheDocument();
    },
  );

  test.each(["/", "/postal-codes", "/universities", "/holidays"])(
    "render Navbar on every page",
    async (route) => {
      const router = createMemoryRouter(routes, {
        initialEntries: [route],
      });
      render(<RouterProvider router={router} />);

      const homeLink = await screen.findByRole("link", { name: /Home/i });
      const universitiesLink = await screen.findByRole("link", {
        name: /Universities/i,
      });
      const postalCodesLink = await screen.findByRole("link", {
        name: /Postal Codes/i,
      });
      const holidaysLink = await screen.findByRole("link", {
        name: /Holidays/i,
      });

      expect(homeLink).toBeInTheDocument();
      expect(universitiesLink).toBeInTheDocument();
      expect(postalCodesLink).toBeInTheDocument();
      expect(holidaysLink).toBeInTheDocument();
    },
  );
});
