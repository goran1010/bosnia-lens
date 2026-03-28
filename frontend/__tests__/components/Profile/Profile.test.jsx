import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../src/contextData/UserDataContext";
import { useNotification } from "../../../src/customHooks/useNotification";
import { Notifications } from "../../../src/components/Notifications";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Profile } from "../../../src/components/Profile/Profile";
import { LogIn } from "../../../src/components/LogIn/LogIn";

function Wrapper({ initialUser = null }) {
  const [userData, setUserData] = useState(initialUser);
  const { notificationValue } = useNotification();

  return (
    <NotificationContext value={notificationValue}>
      <UserDataContext value={{ userData, setUserData }}>
        <MemoryRouter initialEntries={["/profile"]}>
          <Notifications />
          <Routes>
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
    screen.debug(undefined, Infinity);
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
    screen.debug(undefined, Infinity);
    const usernameElement = await screen.findByText("testuser");
    const roleElement = await screen.findByText("USER");
    expect(emailElement).toBeInTheDocument();
    expect(usernameElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });
});
