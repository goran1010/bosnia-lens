import { test, describe, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { UserDataContext } from "../../../src/contextData/UserDataContext";
import { Root } from "../../../src/Root";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { useNotification } from "../../../src/customHooks/useNotification";
import { useState } from "react";
import { Notifications } from "../../../src/components/Notifications";
import { Navbar } from "../../../src/components/Navbar/Navbar";
import userEvent from "@testing-library/user-event";
import { useCloseMenu } from "../../../src/customHooks/useCloseMenu";

function createUser(role = "ADMIN") {
  return {
    id: "1",
    username: "Test User",
    email: "test@example.com",
    role,
  };
}

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

async function openMobileMenu() {
  const menuButton = await screen.findByRole("button", {
    name: /Toggle navigation menu/i,
  });

  await userEvent.click(menuButton);

  return {
    menuButton,
    mobileMenu: await screen.findByText(/Close/i),
  };
}

function expectSharedNavbarLinks() {
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Universities/i)).toBeInTheDocument();
  expect(screen.getByText(/Postal Codes/i)).toBeInTheDocument();
}

describe("Render Navbar on root route", () => {
  function Wrapper({ initialUser = null }) {
    const [userData, setUserData] = useState(initialUser);
    const { notifications, addNotification, removeNotification } =
      useNotification();

    return (
      <NotificationContext
        value={{ notifications, addNotification, removeNotification }}
      >
        <UserDataContext value={{ userData, setUserData }}>
          <MemoryRouter initialEntries={["/"]}>
            <Notifications />
            <Routes>
              <Route path="/" element={<Root />} />
            </Routes>
          </MemoryRouter>
        </UserDataContext>
      </NotificationContext>
    );
  }
  test("user not logged in", async () => {
    render(<Wrapper initialUser={null} />);
    await screen.findByText(/Home/i);

    const profile = screen.queryByRole("link", { name: /profile/i });

    expect(profile).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^Log In$/i }),
    ).toBeInTheDocument();
    expectSharedNavbarLinks();
  });

  test("user logged in", async () => {
    render(
      <Wrapper
        initialUser={{ id: "1", username: "Test User", role: "USER" }}
      />,
    );
    await screen.findByText(/Home/i);

    const profile = await screen.findByRole("link", { name: /profile/i });

    expect(profile).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^Log In$/i }),
    ).not.toBeInTheDocument();
    expectSharedNavbarLinks();
  });
});

function NavbarWrapper({ role = "ADMIN" }) {
  const userData = createUser(role);
  const setUserData = vi.fn();

  const closeMenu = useCloseMenu();
  return (
    <UserDataContext value={{ userData, setUserData }}>
      <MemoryRouter>
        <Navbar closeMenu={closeMenu} />
      </MemoryRouter>
    </UserDataContext>
  );
}

describe("render Navbar mobile menu", () => {
  test.each(["ADMIN", "CONTRIBUTOR"])(
    "opens mobile menu for %s role",
    async (role) => {
      render(<NavbarWrapper role={role} />);

      const { menuButton, mobileMenu } = await openMobileMenu();

      expect(menuButton).toBeInTheDocument();
      expect(mobileMenu).toBeInTheDocument();
      expect(screen.queryByText("Menu")).not.toBeInTheDocument();
    },
  );
});

describe("render Menu based on viewport size", () => {
  test("Menu has the appropriate css", async () => {
    render(<NavbarWrapper />);

    const homeLink = await screen.findByRole("link", { name: /Home/i });
    const universitiesLink = screen.getByRole("link", {
      name: /Universities/i,
    });
    const postalCodesLink = screen.getByRole("link", { name: /Postal Codes/i });

    expect(homeLink).toBeInTheDocument();
    expect(universitiesLink).toBeInTheDocument();
    expect(postalCodesLink).toBeInTheDocument();

    const menuButton = screen.getByRole("button", {
      name: /Toggle navigation menu/i,
    });

    expect(menuButton.parentElement).toHaveClass("flex");
    expect(menuButton.parentElement).toHaveClass("lg:hidden");
  });
});
