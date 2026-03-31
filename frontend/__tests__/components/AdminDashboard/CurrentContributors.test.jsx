import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../src/contextData/NotificationContext";

import { AdminDashboard } from "../../../src/components/AdminDashboard/AdminDashboard";
import { useNotification } from "../../../src/customHooks/useNotification";
import { Notifications } from "../../../src/components/Notifications";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { UserDataContext } from "../../../src/contextData/UserDataContext";

const createFetchResponse = (data, ok = true) => ({
  ok,
  json: async () => data,
});

const fetchMock = vi.fn();

const setupFetchMock = ({ contributors = [], pendingRequests = [] } = {}) => {
  fetchMock.mockImplementation((url) => {
    const requestUrl = String(url);

    if (requestUrl.includes("users/admin/requested-contributors")) {
      return Promise.resolve(
        createFetchResponse({ data: pendingRequests, message: "Success" }),
      );
    }

    if (requestUrl.includes("/users/admin/contributors")) {
      return Promise.resolve(
        createFetchResponse({ data: contributors, message: "Success" }),
      );
    }

    return Promise.resolve(
      createFetchResponse({ data: [], message: "Success" }),
    );
  });
};

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);
  fetchMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function Wrapper({ initialUser = null }) {
  const [userData, setUserData] = useState(initialUser);
  const { notificationValue } = useNotification();

  return (
    <NotificationContext value={notificationValue}>
      <UserDataContext value={{ userData, setUserData }}>
        <MemoryRouter initialEntries={["/admin-dashboard"]}>
          <Notifications />
          <Routes>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
      </UserDataContext>
    </NotificationContext>
  );
}

describe("CurrentContributors Component", () => {
  test("renders without contributors", async () => {
    setupFetchMock();
    render(<Wrapper initialUser={{ role: "ADMIN" }} />);
    expect(await screen.findByText("Current Contributors")).toBeInTheDocument();
    expect(
      await screen.findByText("No contributors found"),
    ).toBeInTheDocument();

    const countBadge = await screen.findByLabelText("number of contributors");
    expect(countBadge).toHaveTextContent("0");
  });

  test("renders with contributors", async () => {
    const mockContributors = [
      {
        id: 1,
        username: "user1",
        email: "user1@example.com",
      },
    ];
    setupFetchMock({ contributors: mockContributors });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    const email = await screen.findByText("user1@example.com");
    const username = await screen.findByText("user1");
    const countBadge = await screen.findByLabelText("number of contributors");

    expect(countBadge).toHaveTextContent("1");
    expect(username).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });

  test("renders multiple contributors with correct count", async () => {
    const mockContributors = [
      { id: 1, username: "contrib1", email: "contrib1@example.com" },
      { id: 2, username: "contrib2", email: "contrib2@example.com" },
      { id: 3, username: "contrib3", email: "contrib3@example.com" },
    ];
    setupFetchMock({ contributors: mockContributors });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    await screen.findByText("contrib1");

    const countBadge = screen.getByLabelText("number of contributors");
    expect(countBadge).toHaveTextContent("3");
    expect(screen.getByText("contrib1")).toBeInTheDocument();
    expect(screen.getByText("contrib2")).toBeInTheDocument();
    expect(screen.getByText("contrib3")).toBeInTheDocument();
  });

  test("shows error notification when contributors fetch throws a network error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockImplementation((url) => {
      if (String(url).includes("/users/admin/contributors")) {
        return Promise.reject(new Error("Network error"));
      }
      return Promise.resolve(
        createFetchResponse({ data: [], message: "Success" }),
      );
    });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    expect(
      await screen.findByText(/Failed to fetch current contributors/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("No contributors found"),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  test("renders contributor with missing email without crashing", async () => {
    const mockContributors = [{ id: 1, username: "noemail_user" }];
    setupFetchMock({ contributors: mockContributors });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    await screen.findByText("noemail_user");

    expect(screen.getByLabelText("number of contributors")).toHaveTextContent(
      "1",
    );
    expect(screen.getByText("noemail_user")).toBeInTheDocument();
  });
});
