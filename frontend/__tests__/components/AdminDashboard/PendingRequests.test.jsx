import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../src/contextData/NotificationContext";

const createFetchResponse = (data, ok = true) => ({
  ok,
  json: async () => data,
});

const fetchMock = vi.fn();

const setupFetchMock = ({ pendingRequests = [], contributors = [] } = {}) => {
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

import { AdminDashboard } from "../../../src/components/AdminDashboard/AdminDashboard";
import { useNotification } from "../../../src/customHooks/useNotification";
import { Notifications } from "../../../src/components/Notifications";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { UserDataContext } from "../../../src/contextData/UserDataContext";

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

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);
  fetchMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PendingRequests Component", () => {
  test("renders PendingRequests component", async () => {
    setupFetchMock();

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    const numberOfRequests = await screen.findByLabelText(
      /pending requests count/i,
    );
    const pendingRequestsText = await screen.findAllByText(/Pending Requests/i);

    expect(numberOfRequests).toHaveTextContent("0");
    expect(pendingRequestsText).toHaveLength(3);
  });

  test("renders PendingRequests with 1 request", async () => {
    const mockPendingRequests = [
      {
        id: 1,
        username: "Jane Doe",
        email: "jane.doe@example.com",
      },
    ];
    setupFetchMock({ pendingRequests: mockPendingRequests });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    await screen.findByText(/Jane Doe/i);

    expect(screen.getByText("Pending Requests")).toBeInTheDocument();
    expect(screen.getByLabelText(/pending requests count/i)).toHaveTextContent(
      "1",
    );
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane.doe@example.com/i)).toBeInTheDocument();
  });

  test("renders multiple pending requests with correct count", async () => {
    const mockPendingRequests = [
      { id: 1, username: "user1", email: "user1@example.com" },
      { id: 2, username: "user2", email: "user2@example.com" },
      { id: 3, username: "user3", email: "user3@example.com" },
    ];
    setupFetchMock({ pendingRequests: mockPendingRequests });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    await screen.findByText("user1");

    expect(screen.getByLabelText(/pending requests count/i)).toHaveTextContent(
      "3",
    );
    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();
    expect(screen.getByText("user3")).toBeInTheDocument();
  });

  test("shows no pending requests when fetch throws a network error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockImplementation((url) => {
      if (String(url).includes("requested-contributors")) {
        return Promise.reject(new Error("Network error"));
      }
      return Promise.resolve(
        createFetchResponse({ data: [], message: "Success" }),
      );
    });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    const countBadge = await screen.findByLabelText(/pending requests count/i);
    expect(countBadge).toHaveTextContent("0");
    expect(screen.getByText(/No pending requests/i)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  test("renders pending request with missing email without crashing", async () => {
    const mockPendingRequests = [{ id: 1, username: "ghostuser" }];
    setupFetchMock({ pendingRequests: mockPendingRequests });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    await screen.findByText(/ghostuser/i);

    expect(screen.getByLabelText(/pending requests count/i)).toHaveTextContent(
      "1",
    );
    expect(screen.getByText(/ghostuser/i)).toBeInTheDocument();
  });
});
