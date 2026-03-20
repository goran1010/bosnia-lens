import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AdminForm } from "../../../../src/components/AdminDashboard/AdminForm";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../../src/contextData/UserDataContext";
import userEvent from "@testing-library/user-event";

const createFetchResponse = (data, ok = true) => ({
  ok,
  json: async () => data,
});

const fetchMock = vi.fn();

vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);

const renderComponent = () => {
  const userDataContextValue = { userData: { role: "ADMIN" } };

  return render(
    <NotificationContext
      value={{
        notifications: [],
        addNotification: vi.fn(),
        removeNotification: vi.fn(),
      }}
    >
      <UserDataContext value={userDataContextValue}>
        <AdminForm />
      </UserDataContext>
    </NotificationContext>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  fetchMock.mockReset();
});

describe("AdminForm component rendering", () => {
  test("renders AdminForm component's heading", async () => {
    fetchMock
      .mockResolvedValueOnce(
        createFetchResponse({ data: [], message: "Success" }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({ data: [], message: "Success" }),
      );

    renderComponent();

    expect(
      screen.getByRole("heading", { name: /Admin Dashboard/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  test("renders contributors list with mock contributor", async () => {
    const mockContributor = {
      id: 1,
      username: "John Doe",
      email: "john.doe@example.com",
    };
    fetchMock
      .mockResolvedValueOnce(
        createFetchResponse({ data: [mockContributor], message: "Success" }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({ data: [], message: "Success" }),
      );

    renderComponent();

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
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockContributor], message: "Success" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], message: "Success" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "csrf-token", message: "Success" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "User promoted to contributor successfully.",
        }),
      });
    renderComponent();

    const user = userEvent.setup();

    expect(await screen.findByText(/Pending Requests/i)).toBeInTheDocument();
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
    expect(screen.getAllByText(/John Doe/i)).toHaveLength(1);
    expect(screen.getByText(/test_mail@example.com/i)).toBeInTheDocument();
  });

  test("removes pending request from the list when declined", async () => {
    const mockRequest = {
      id: 1,
      username: "John Doe",
      email: "john.doe@example.com",
    };
    fetchMock
      .mockResolvedValueOnce(
        createFetchResponse({ data: [mockRequest], message: "Success" }),
      )
      .mockResolvedValueOnce(
        createFetchResponse({ data: [], message: "Success" }),
      )
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "csrf-token", message: "Success" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "User's request declined successfully.",
        }),
      });
    renderComponent();

    const user = userEvent.setup();

    expect(await screen.findByText(/Pending Requests/i)).toBeInTheDocument();
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
});
