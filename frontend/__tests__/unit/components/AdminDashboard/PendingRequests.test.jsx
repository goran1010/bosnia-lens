import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PendingRequests } from "../../../../src/components/AdminDashboard/PendingRequests";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";

vi.mock(
  "../../../../src/components/AdminDashboard/customHooks/useGetPendingRequests",
  () => ({
    useGetPendingRequests: vi.fn(),
  }),
);

import { useGetPendingRequests } from "../../../../src/components/AdminDashboard/customHooks/useGetPendingRequests";

function renderComponent() {
  render(
    <NotificationContext.Provider value={{ addNotification: vi.fn() }}>
      <PendingRequests />
    </NotificationContext.Provider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PendingRequests Component", () => {
  test("renders PendingRequests component", () => {
    useGetPendingRequests.mockReturnValue({
      pendingRequests: [],
      setPendingRequests: vi.fn(),
    });

    renderComponent();

    const numberOfRequests = screen.getByLabelText(/pending requests count/i);
    const pendingRequestsText = screen.getAllByText(/Pending Requests/i);

    expect(numberOfRequests).toHaveTextContent("0");
    expect(pendingRequestsText).toHaveLength(2);
  });

  test("renders PendingRequests with 1 request", () => {
    useGetPendingRequests.mockReturnValue({
      pendingRequests: [
        { id: 1, username: "Jane Doe", email: "jane.doe@example.com" },
      ],
      setPendingRequests: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText(/Pending Requests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pending requests count/i)).toHaveTextContent(
      "1",
    );
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane.doe@example.com/i)).toBeInTheDocument();
  });
});
