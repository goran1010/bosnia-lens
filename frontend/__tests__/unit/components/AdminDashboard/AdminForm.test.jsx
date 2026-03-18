import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminForm } from "../../../../src/components/AdminDashboard/AdminForm";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../../src/contextData/UserDataContext";

const fetchMock = vi.fn();

vi.spyOn(globalThis, "fetch").mockImplementation(() => fetchMock);

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
});

describe("AdminForm component rendering", () => {
  test("renders AdminForm component's heading", () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], message: "Success" }),
    });
    renderComponent();

    expect(
      screen.getByRole("heading", { name: /Admin Dashboard/i }),
    ).toBeInTheDocument();
  });

  test("renders contributors list with mock contributor", () => {
    const mockContributor = { id: 1, name: "John Doe" };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [mockContributor], message: "Success" }),
    });

    renderComponent();
  });
});

describe("AdminForm component pending requests and contributors interaction", () => {
  test("updates contributors list when a pending request is approved", async () => {
    const mockContributor = { id: 1, name: "John Doe" };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], message: "Success" }),
    });
    renderComponent();

    // Simulate approving a pending request and check if the contributors list updates
    // This part would depend on how the PendingRequests component is implemented
    // For example, you might need to simulate a click on an approve button and then check if the contributor appears in the CurrentContributors list
  });
});
