import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../src/contextData/UserDataContext";
import userEvent from "@testing-library/user-event";

const createFetchResponse = (data, ok = true) => ({
  ok,
  json: async () => data,
});

const fetchMock = vi.fn();

const setupFetchMock = ({
  contributors = [],
  pendingRequests = [],
  csrfToken = "csrf-token",
  addContributorResponse = {
    message: "User promoted to contributor successfully.",
  },
  declineContributorResponse = {
    message: "User's request declined successfully.",
  },
  removeContributorResponse = {
    message: "User removed from contributors successfully.",
  },
} = {}) => {
  fetchMock.mockImplementation((url) => {
    const requestUrl = String(url);

    if (requestUrl.includes("/users/admin/contributors")) {
      return Promise.resolve(
        createFetchResponse({ data: contributors, message: "Success" }),
      );
    }

    if (requestUrl.includes("/users/admin/requested-contributors")) {
      return Promise.resolve(
        createFetchResponse({ data: pendingRequests, message: "Success" }),
      );
    }

    if (requestUrl.includes("/csrf-token")) {
      return Promise.resolve(
        createFetchResponse({ data: csrfToken, message: "Success" }),
      );
    }

    if (requestUrl.includes("/users/admin/add-contributor/")) {
      return Promise.resolve(createFetchResponse(addContributorResponse));
    }

    if (requestUrl.includes("/users/admin/decline-contributor/")) {
      return Promise.resolve(createFetchResponse(declineContributorResponse));
    }

    if (requestUrl.includes("/users/admin/remove-contributor/")) {
      return Promise.resolve(createFetchResponse(removeContributorResponse));
    }

    throw new Error(`Unexpected fetch request: ${requestUrl}`);
  });
};

import { AdminDashboard } from "../../../src/components/AdminDashboard/AdminDashboard";
import { useNotification } from "../../../src/customHooks/useNotification";
import { Notifications } from "../../../src/components/Notifications";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

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

describe("AdminForm component rendering", () => {
  test("renders AdminForm component's heading", async () => {
    setupFetchMock();
    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    expect(
      await screen.findByRole("heading", { name: /Admin Dashboard/i }),
    ).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("renders contributors list with mock contributor", async () => {
    const mockAdmin = {
      id: 1,
      username: "John Doe",
      email: "john.doe@example.com",
      role: "ADMIN",
    };
    setupFetchMock({ contributors: [mockAdmin] });

    render(<Wrapper initialUser={mockAdmin} />);

    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
  });
});

describe("AdminForm component pending requests and contributors interaction", () => {
  test("updates contributors list when a pending request is approved", async () => {
    const mockContributor = {
      id: 1,
      username: "John Doe",
      email: "test_mail@example.com",
    };
    setupFetchMock({ pendingRequests: [mockContributor] });
    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    const user = userEvent.setup();

    expect(await screen.findByText("Pending Requests")).toBeInTheDocument();
    const confirmButton = await screen.findByRole("button", {
      name: /Confirm/i,
    });

    await user.click(confirmButton);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/users/admin/add-contributor/1"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-csrf-token": "csrf-token",
        }),
        credentials: "include",
      }),
    );

    const pendingCount = await screen.findByLabelText(
      /pending requests count/i,
    );
    expect(pendingCount).toHaveTextContent("0");

    const contributorsCount = await screen.findByLabelText(
      /number of contributors/i,
    );
    expect(contributorsCount).toHaveTextContent("1");

    expect(screen.getByText(/No pending requests/i)).toBeInTheDocument();
    expect(screen.getByText(/test_mail@example.com/i)).toBeInTheDocument();
  });

  test("removes pending request from the list when declined", async () => {
    const mockRequest = {
      id: 1,
      username: "John Doe",
      email: "john.doe@example.com",
    };
    setupFetchMock({ pendingRequests: [mockRequest] });
    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    const user = userEvent.setup();

    expect(await screen.findByText("Pending Requests")).toBeInTheDocument();
    const declineButton = await screen.findByRole("button", {
      name: /Decline/i,
    });

    await user.click(declineButton);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/users/admin/decline-contributor/1"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-csrf-token": "csrf-token",
        }),
        credentials: "include",
      }),
    );

    const pendingCount = await screen.findByLabelText(
      /pending requests count/i,
    );
    expect(pendingCount).toHaveTextContent("0");

    expect(screen.getByText(/No pending requests/i)).toBeInTheDocument();
  });

  test("removes contributor from the list when removed", async () => {
    const mockContributor = {
      id: 1,
      username: "John Doe",
      email: "john.doe@example.com",
    };
    setupFetchMock({ contributors: [mockContributor] });
    render(<Wrapper initialUser={{ role: "ADMIN" }} />);

    const contributorsCount = await screen.findByLabelText(
      /number of contributors/i,
    );
    const user = userEvent.setup();

    expect(contributorsCount).toBeInTheDocument();

    expect(contributorsCount).toHaveTextContent("1");

    expect(await screen.findByText("Current Contributors")).toBeInTheDocument();
    const removeButton = await screen.findByRole("button", {
      name: /Remove/i,
    });

    await user.click(removeButton);

    expect(contributorsCount).toHaveTextContent("0");

    expect(screen.getByText(/No contributors/i)).toBeInTheDocument();
  });
});
