import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../src/contextData/UserDataContext";
import { useNotification } from "../../../src/customHooks/useNotification";
import { Notifications } from "../../../src/components/Notifications";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Profile } from "../../../src/components/Profile/Profile";
import { LogIn } from "../../../src/components/LogIn/LogIn";
import userEvent from "@testing-library/user-event";
import { LanguageContext } from "../../../src/contextData/LanguageContext";
import { useLanguage } from "../../../src/customHooks/useLanguage";

let getCsrfTokenMock = "mocked-csrf-token";

vi.mock("../../../src/components/utils/getCsrfToken", () => ({
  getCsrfToken: async () => getCsrfTokenMock,
  clearCsrfToken: () => {},
}));

const user = userEvent.setup();

let fetchSpy;
let consoleErrorSpy;

beforeEach(() => {
  getCsrfTokenMock = "mocked-csrf-token";

  fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({
        message: "default response",
        data: null,
      }),
    }),
  );

  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function Wrapper({ initialUser = null }) {
  const [userData, setUserData] = useState(initialUser);
  const { notifications, addNotification, removeNotification } =
    useNotification();
  const { language, setLanguage, t } = useLanguage();

  return (
    <LanguageContext value={{ language, setLanguage, t }}>
      <NotificationContext
        value={{ notifications, addNotification, removeNotification }}
      >
        <UserDataContext value={{ userData, setUserData }}>
          <MemoryRouter initialEntries={["/profile"]}>
            <Notifications />
            <Routes>
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </MemoryRouter>
        </UserDataContext>
      </NotificationContext>
    </LanguageContext>
  );
}

async function clickLogout() {
  const logoutButton = await screen.findByRole("button", {
    name: /Log out/i,
  });

  expect(logoutButton).toBeInTheDocument();
  await user.click(logoutButton);

  return logoutButton;
}

describe("Profile Component", () => {
  test("renders profile component when user is not logged in", async () => {
    render(<Wrapper />);
    const paragraphElement = await screen.findByText(
      /You need to be logged in. Redirected to the login page./i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });

  test("renders profile component when user is logged in", async () => {
    render(<Wrapper initialUser={{ username: "testuser" }} />);
    const headingElement = await screen.findByRole("heading", {
      name: /My Profile/i,
    });
    expect(headingElement).toBeInTheDocument();
  });

  test("displays user information correctly", async () => {
    const user = {
      email: "testuser@example.com",
      role: "USER",
    };
    render(<Wrapper initialUser={user} />);
    const emailElement = await screen.findByText(/testuser@example.com/i);
    const roleElement = await screen.findByText("USER");
    expect(emailElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });

  test("displays contributor role when user role is CONTRIBUTOR", async () => {
    const user = {
      email: "contributor@example.com",
      role: "CONTRIBUTOR",
    };
    render(<Wrapper initialUser={user} />);
    const emailElement = await screen.findByText(/contributor@example.com/i);
    const roleElement = await screen.findByText("CONTRIBUTOR");
    expect(emailElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });

  test("displays admin role when user role is ADMIN", async () => {
    const user = {
      email: "admin@example.com",
      role: "ADMIN",
    };
    render(<Wrapper initialUser={user} />);
    const emailElement = await screen.findByText(/admin@example.com/i);
    const roleElement = await screen.findByText("ADMIN");
    expect(emailElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });
});

describe("Profile Component handle logout", () => {
  test("handles logout failure due to missing CSRF token", async () => {
    getCsrfTokenMock = null;
    render(<Wrapper initialUser={{ username: "testuser" }} />);

    await clickLogout();

    const notificationElement = await screen.findByText(
      /Failed to retrieve CSRF token./i,
    );
    expect(notificationElement).toBeInTheDocument();
  });

  test("handles logout failure due to server error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Network error.",
      }),
    });

    render(<Wrapper initialUser={{ username: "testuser" }} />);

    await clickLogout();

    const notificationElement = await screen.findByText(/Network error./i);
    expect(notificationElement).toBeInTheDocument();
  });

  test("handles logout failure due to unexpected error", async () => {
    fetchSpy.mockImplementation((url) => {
      if (url.endsWith("/users/logout")) {
        throw new Error("Unexpected error");
      }
    });

    render(<Wrapper initialUser={{ username: "testuser" }} />);

    await clickLogout();

    const notificationElement = await screen.findByText(
      /An error occurred while logging out./i,
    );
    expect(notificationElement).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("handles logout correctly", async () => {
    fetchSpy.mockImplementation((url) => {
      if (url.endsWith("/users/logout")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            message: "User logged out successfully",
            data: null,
          }),
        });
      }
    });

    render(<Wrapper initialUser={{ username: "testuser" }} />);
    const logoutButton = await clickLogout();

    const notificationElement = await screen.findByText(
      /User logged out successfully/i,
    );
    expect(notificationElement).toBeInTheDocument();

    const logIn = await screen.findByRole("heading", { name: /Log In/i });

    expect(logIn).toBeInTheDocument();
    expect(logoutButton).not.toBeInTheDocument();
  });
});
