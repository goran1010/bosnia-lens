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
import { LanguageContext } from "../../../src/contextData/LanguageContext";
import { useLanguage } from "../../../src/customHooks/useLanguage";

function createUser(role = "ADMIN") {
  return {
    id: "1",
    username: "Test User",
    email: "test@example.com",
    role,
  };
}

beforeEach(() => {
  localStorage.setItem("language", "en");

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
    const { language, setLanguage, t } = useLanguage();
    const [userData, setUserData] = useState(initialUser);
    const { notifications, addNotification, removeNotification } =
      useNotification();

    return (
      <LanguageContext value={{ language, setLanguage, t }}>
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
      </LanguageContext>
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

function NavbarWrapper({ role = "ADMIN", withUser = true }) {
  const { language, setLanguage, t } = useLanguage();
  const userData = withUser ? createUser(role) : null;
  const setUserData = vi.fn();

  const closeMenu = useCloseMenu();
  return (
    <LanguageContext value={{ language, setLanguage, t }}>
      <NotificationContext
        value={{
          notifications: [],
          addNotification: vi.fn(),
          removeNotification: vi.fn(),
        }}
      >
        <UserDataContext value={{ userData, setUserData }}>
          <MemoryRouter>
            <Navbar closeMenu={closeMenu} />
          </MemoryRouter>
        </UserDataContext>
      </NotificationContext>
    </LanguageContext>
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

  test("shows user-only links for contributor in mobile menu", async () => {
    render(<NavbarWrapper role="CONTRIBUTOR" />);

    await openMobileMenu();

    const contributeLinks = document.querySelectorAll(
      "#mobile-menu a[href='/contribution-dashboard']",
    );
    const adminLinks = document.querySelectorAll(
      "#mobile-menu a[href='/admin-dashboard']",
    );

    expect(contributeLinks.length).toBe(1);
    expect(adminLinks.length).toBe(0);
  });

  test("shows admin link for admin in mobile menu", async () => {
    render(<NavbarWrapper role="ADMIN" />);

    await openMobileMenu();

    const contributeLinks = document.querySelectorAll(
      "#mobile-menu a[href='/contribution-dashboard']",
    );
    const adminLinks = document.querySelectorAll(
      "#mobile-menu a[href='/admin-dashboard']",
    );

    expect(contributeLinks.length).toBe(1);
    expect(adminLinks.length).toBe(1);
  });

  test("hides user-only links when user is not logged in", async () => {
    render(<NavbarWrapper withUser={false} />);

    await openMobileMenu();

    const contributeLinks = document.querySelectorAll(
      "#mobile-menu a[href='/contribution-dashboard']",
    );
    const adminLinks = document.querySelectorAll(
      "#mobile-menu a[href='/admin-dashboard']",
    );
    const loginLinks = document.querySelectorAll("a[href='/login']");

    expect(contributeLinks.length).toBe(0);
    expect(adminLinks.length).toBe(0);
    expect(loginLinks.length).toBeGreaterThan(0);
  });
});

describe("Navbar switchers", () => {
  test("opens language menu and closes theme menu", async () => {
    render(<NavbarWrapper />);

    const themeButton = document.getElementById("theme-switcher");
    const languageButton = document.getElementById("language-switcher");

    expect(themeButton).toBeInTheDocument();
    expect(languageButton).toBeInTheDocument();

    await userEvent.click(themeButton);
    expect(themeButton).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(languageButton);

    expect(themeButton).toHaveAttribute("aria-expanded", "false");
    expect(languageButton).toHaveAttribute("aria-expanded", "true");
  });

  test("closes open menus when navbar is clicked", async () => {
    render(<NavbarWrapper />);

    const languageButton = document.getElementById("language-switcher");
    expect(languageButton).toBeInTheDocument();

    await userEvent.click(languageButton);
    expect(languageButton).toHaveAttribute("aria-expanded", "true");

    const navigation = screen.getByRole("navigation");
    expect(navigation).toBeInTheDocument();

    await userEvent.click(navigation);

    expect(languageButton).toHaveAttribute("aria-expanded", "false");
  });
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
