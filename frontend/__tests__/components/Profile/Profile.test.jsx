import { describe, test, expect, vi } from "vitest";
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

const user = userEvent.setup();

const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({
      message: "default response",
      data: null,
    }),
  }),
);
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

function Wrapper({ initialUser = null }) {
  const [userData, setUserData] = useState(initialUser);
  const { notificationValue } = useNotification();

  return (
    <NotificationContext value={notificationValue}>
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
  );
}

describe("Profile Component", () => {
  test("renders profile component when user is not logged in", async () => {
    render(<Wrapper />);
    const paragraphElement = await screen.findByText(
      /You need to be logged in. Redirected to the login page./i,
    );
    const usernameElement = screen.queryByText(/Username/i);
    expect(usernameElement).toBeInTheDocument();
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
      username: "testuser",
      role: "USER",
    };
    render(<Wrapper initialUser={user} />);
    const emailElement = await screen.findByText(/testuser@example.com/i);
    const usernameElement = await screen.findByText("testuser");
    const roleElement = await screen.findByText("USER");
    expect(emailElement).toBeInTheDocument();
    expect(usernameElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });

  test("displays contributor role when user role is CONTRIBUTOR", async () => {
    const user = {
      email: "contributor@example.com",
      username: "contributor",
      role: "CONTRIBUTOR",
    };
    render(<Wrapper initialUser={user} />);
    const emailElement = await screen.findByText(/contributor@example.com/i);
    const usernameElement = await screen.findByText("contributor");
    const roleElement = await screen.findByText("CONTRIBUTOR");
    expect(emailElement).toBeInTheDocument();
    expect(usernameElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });

  test("displays admin role when user role is ADMIN", async () => {
    const user = {
      email: "admin@example.com",
      username: "admin",
      role: "ADMIN",
    };
    render(<Wrapper initialUser={user} />);
    const emailElement = await screen.findByText(/admin@example.com/i);
    const usernameElement = await screen.findByText("admin");
    const roleElement = await screen.findByText("ADMIN");
    expect(emailElement).toBeInTheDocument();
    expect(usernameElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });
});

describe("Profile Component handle logout", () => {
  test("handles logout failure due to missing CSRF token", async () => {
    render(<Wrapper initialUser={{ username: "testuser" }} />);
    const logoutButton = await screen.findByRole("button", {
      name: /Log out/i,
    });
    expect(logoutButton).toBeInTheDocument();
    await user.click(logoutButton);
    const notificationElement = await screen.findByText(
      /Failed to retrieve CSRF token./i,
    );
    expect(notificationElement).toBeInTheDocument();
  });

  test("handles logout failure due to server error", async () => {
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "CSRF token generated successfully",
          data: "some-csrf-token",
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Network error.",
        }),
      });

    render(<Wrapper initialUser={{ username: "testuser" }} />);
    const logoutButton = await screen.findByRole("button", {
      name: /Log out/i,
    });
    expect(logoutButton).toBeInTheDocument();
    await user.click(logoutButton);

    const notificationElement = await screen.findByText(/Network error./i);
    expect(notificationElement).toBeInTheDocument();
  });

  test("handles logout failure due to unexpected error", async () => {
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "CSRF token generated successfully",
          data: "some-csrf-token",
        }),
      })
      .mockRejectedValueOnce(new Error("Unexpected error"));

    render(<Wrapper initialUser={{ username: "testuser" }} />);
    const logoutButton = await screen.findByRole("button", {
      name: /Log out/i,
    });
    expect(logoutButton).toBeInTheDocument();
    await user.click(logoutButton);

    const notificationElement = await screen.findByText(/Unexpected error/i);
    expect(notificationElement).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("handles logout correctly", async () => {
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "CSRF token generated successfully",
          data: "some-csrf-token",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "User logged out successfully",
        }),
      });

    render(<Wrapper initialUser={{ username: "testuser" }} />);
    const logoutButton = await screen.findByRole("button", {
      name: /Log out/i,
    });
    expect(logoutButton).toBeInTheDocument();
    await user.click(logoutButton);

    const notificationElement = await screen.findByText(
      /User logged out successfully/i,
    );
    expect(notificationElement).toBeInTheDocument();
    // const homeHeading = await screen.findByRole("heading", {
    //   name: /Bosnia Lens/i,
    // });
    // expect(homeHeading).toBeInTheDocument();
    expect(logoutButton).not.toBeInTheDocument();
  });
});

describe("Profile Component handle become contributor", () => {
  test("handles become contributor failure due to missing CSRF token", async () => {
    render(<Wrapper initialUser={{ username: "testuser", role: "USER" }} />);
    const becomeContributorButton = await screen.findByRole("button", {
      name: /Become a Contributor/i,
    });
    expect(becomeContributorButton).toBeInTheDocument();
    await user.click(becomeContributorButton);
    const notificationElement = await screen.findByText(
      /Failed to retrieve CSRF token./i,
    );
    expect(notificationElement).toBeInTheDocument();
  });

  test("handles become contributor failure due to server error", async () => {
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "CSRF token generated successfully",
          data: "some-csrf-token",
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Network error",
        }),
      });

    render(<Wrapper initialUser={{ username: "testuser", role: "USER" }} />);
    const becomeContributorButton = await screen.findByRole("button", {
      name: /Become a Contributor/i,
    });
    expect(becomeContributorButton).toBeInTheDocument();
    await user.click(becomeContributorButton);

    const notificationElement = await screen.findByText(/Network error/i);
    expect(notificationElement).toBeInTheDocument();
  });

  test("handles become contributor failure due to unexpected error", async () => {
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "CSRF token generated successfully",
          data: "some-csrf-token",
        }),
      })
      .mockRejectedValueOnce(new Error("Unexpected error"));

    render(<Wrapper initialUser={{ username: "testuser", role: "USER" }} />);
    const becomeContributorButton = await screen.findByRole("button", {
      name: /Become a Contributor/i,
    });
    expect(becomeContributorButton).toBeInTheDocument();
    await user.click(becomeContributorButton);

    const notificationElement = await screen.findByText(
      /An error occurred while requesting contributor status./i,
    );
    expect(notificationElement).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("handles become contributor correctly", async () => {
    fetchSpy
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "CSRF token generated successfully",
          data: "some-csrf-token",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Contributor status requested successfully",
          data: { role: "CONTRIBUTOR" },
        }),
      });

    render(<Wrapper initialUser={{ username: "testuser", role: "USER" }} />);
    const becomeContributorButton = await screen.findByRole("button", {
      name: /Become a Contributor/i,
    });
    expect(becomeContributorButton).toBeInTheDocument();
    await user.click(becomeContributorButton);

    const notificationElement = await screen.findByText(
      /Contributor status requested successfully/i,
    );
    expect(notificationElement).toBeInTheDocument();
    const roleElement = await screen.findByText("CONTRIBUTOR");
    expect(roleElement).toBeInTheDocument();
  });
});
