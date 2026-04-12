import { test, describe, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../src/routes";
import { UserDataContext } from "../src/contextData/UserDataContext";

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({
      data: [{ id: 1, code: "mocked code" }],
      message: "mocked message",
    }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
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

  test("visit home page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);

    const linkElement = await screen.findByRole("heading", {
      name: /Bosnia Lens/i,
      level: 1,
    });
    expect(linkElement).toBeInTheDocument();
  });

  test.each(["/", "/postal-codes", "/universities"])(
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

  test.each(["/", "/postal-codes", "/universities"])(
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

      expect(homeLink).toBeInTheDocument();
      expect(universitiesLink).toBeInTheDocument();
      expect(postalCodesLink).toBeInTheDocument();
    },
  );
});
