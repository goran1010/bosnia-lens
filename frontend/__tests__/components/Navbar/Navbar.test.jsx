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

describe("Render Navbar on root route", () => {
  function Wrapper({ initialUser = null }) {
    const [userData, setUserData] = useState(initialUser);
    const { notificationValue } = useNotification();

    return (
      <NotificationContext value={notificationValue}>
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
    const home = await screen.findByText(/Home/i);
    const universities = screen.getByText(/Universities/i);
    const postalCodes = screen.getByText(/Postal Codes/i);
    const holidays = screen.getByText(/Holidays/i);
    const profile = screen.queryByRole("link", { name: /profile/i });

    expect(profile).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^Log In$/i }),
    ).toBeInTheDocument();
    expect(home).toBeInTheDocument();
    expect(universities).toBeInTheDocument();
    expect(postalCodes).toBeInTheDocument();
    expect(holidays).toBeInTheDocument();
  });

  test("user logged in", async () => {
    render(
      <Wrapper
        initialUser={{ id: "1", username: "Test User", role: "USER" }}
      />,
    );
    const home = await screen.findByText(/Home/i);
    const universities = screen.getByText(/Universities/i);
    const postalCodes = screen.getByText(/Postal Codes/i);
    const holidays = screen.getByText(/Holidays/i);
    const profile = await screen.findByRole("link", { name: /profile/i });

    expect(profile).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^Log In$/i }),
    ).not.toBeInTheDocument();
    expect(home).toBeInTheDocument();
    expect(universities).toBeInTheDocument();
    expect(postalCodes).toBeInTheDocument();
    expect(holidays).toBeInTheDocument();
  });
});

function NavbarWrapper({ isOpen = false, role = "ADMIN" }) {
  const userData = createUser(role);
  const setUserData = vi.fn();

  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);
  return (
    <UserDataContext value={{ userData, setUserData }}>
      <MemoryRouter>
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </MemoryRouter>
    </UserDataContext>
  );
}

describe("render Navbar depending on open menu state", () => {
  test("mobile menu is closed", async () => {
    render(<NavbarWrapper />);
    const menuButton = await screen.findByRole("button", {
      name: /Menu/i,
    });
    expect(menuButton).toBeInTheDocument();

    await userEvent.click(menuButton);

    const mobileMenu = await screen.findByText(/Close/i);
    expect(mobileMenu).toBeInTheDocument();
    expect(screen.queryByText("Menu")).not.toBeInTheDocument();
  });

  test("mobile menu is open", async () => {
    render(<NavbarWrapper isOpen={true} />);

    const mobileMenu = await screen.findByText(/Close/i);
    expect(mobileMenu).toBeInTheDocument();
  });
});

describe("render Navbar when user is admin or contributor", () => {
  test("mobile menu is closed", async () => {
    render(<NavbarWrapper />);
    const menuButton = await screen.findByRole("button", {
      name: /Menu/i,
    });
    expect(menuButton).toBeInTheDocument();

    await userEvent.click(menuButton);

    const mobileMenu = await screen.findByText(/Close/i);
    expect(mobileMenu).toBeInTheDocument();
    expect(screen.queryByText("Menu")).not.toBeInTheDocument();
  });

  test("mobile menu is open", async () => {
    render(<NavbarWrapper isOpen={true} />);

    const mobileMenu = await screen.findByText(/Close/i);
    expect(mobileMenu).toBeInTheDocument();
  });
});
