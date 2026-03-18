import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminForm } from "../../../../src/components/AdminDashboard/AdminForm";
import { NotificationContext } from "../../../../src/contextData/NotificationContext";
import { UserDataContext } from "../../../../src/contextData/UserDataContext";
import { useGetAllContributors } from "../../../../src/components/AdminDashboard/customHooks/useGetAllContributors";

const renderComponent = () => {
  const contextValue = {
    addNotification: vi.fn(),
  };

  const userDataContextValue = { userData: { role: "ADMIN" } };

  return render(
    <NotificationContext value={contextValue}>
      <UserDataContext value={userDataContextValue}>
        <AdminForm />
      </UserDataContext>
    </NotificationContext>,
  );
};

describe("AdminForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("renders AdminForm component's heading", () => {
    vi.mock(
      import("../../../../src/components/AdminDashboard/customHooks/useGetAllContributors"),
      () => ({
        useGetAllContributors: vi.fn().mockReturnValue({
          currentContributors: [],
          setCurrentContributors: vi.fn(),
        }),
      }),
    );
    renderComponent();

    expect(
      screen.getByRole("heading", { name: /Admin Dashboard/i }),
    ).toBeInTheDocument();
  });

  test("getAllContributors hook is called", () => {
    vi.mock(
      import("../../../../src/components/AdminDashboard/customHooks/useGetAllContributors"),
      () => ({
        useGetAllContributors: vi.fn().mockReturnValue({
          currentContributors: [],
          setCurrentContributors: vi.fn(),
        }),
      }),
    );
    renderComponent();

    expect(useGetAllContributors).toHaveBeenCalled();
  });
});
