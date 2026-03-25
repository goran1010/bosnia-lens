import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";

const createFetchResponse = (data, ok = true) => ({
  ok,
  json: async () => data,
});

const fetchMock = vi.fn();

const setupFetchMock = ({ contributors = [] } = {}) => {
  fetchMock.mockImplementation((url) => {
    const requestUrl = String(url);

    if (requestUrl.includes("users/admin/requested-contributors")) {
      return Promise.resolve(
        createFetchResponse({ data: contributors, message: "Success" }),
      );
    }
  });
};

vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);

import { AdminDashboard } from "../../../../src/components/AdminDashboard/AdminDashboard";
import { useNotification } from "../../../../src/customHooks/useNotification";
import { Notifications } from "../../../../src/components/Notifications";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { UserDataContext } from "../../../../src/contextData/UserDataContext";

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
  vi.clearAllMocks();
});

describe("PendingRequests Component", () => {
  test("renders PendingRequests component", () => {
    setupFetchMock();

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    const numberOfRequests = screen.getByLabelText(/pending requests count/i);
    const pendingRequestsText = screen.getAllByText(/Pending Requests/i);

    expect(numberOfRequests).toHaveTextContent("0");
    expect(pendingRequestsText).toHaveLength(2);
  });

  test("renders PendingRequests with 1 request", async () => {
    const mockPendingRequests = [
      {
        id: 1,
        username: "Jane Doe",
        email: "jane.doe@example.com",
      },
    ];
    setupFetchMock({ contributors: mockPendingRequests });

    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    await screen.findByText(/Jane Doe/i);

    expect(screen.getByText("Pending Requests")).toBeInTheDocument();
    expect(screen.getByLabelText(/pending requests count/i)).toHaveTextContent(
      "1",
    );
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane.doe@example.com/i)).toBeInTheDocument();
  });
});
