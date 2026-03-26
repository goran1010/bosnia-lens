import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";

import { AdminDashboard } from "../../../../src/components/AdminDashboard/AdminDashboard";
import { useNotification } from "../../../../src/customHooks/useNotification";
import { Notifications } from "../../../../src/components/Notifications";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { UserDataContext } from "../../../../src/contextData/UserDataContext";

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

vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);

beforeEach(() => {
  fetchMock.mockReset();
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
});
