import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotification } from "../../src/customHooks/useNotification";

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(crypto, "randomUUID").mockImplementation(
    () => `id-${Math.random().toString(36).slice(2, 8)}`,
  );
});

function NotificationProbe() {
  const { notifications, addNotification, removeNotification } =
    useNotification();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          addNotification({
            type: "success",
            message: "Created",
            duration: 1000,
          })
        }
      >
        Add Custom
      </button>
      <button
        type="button"
        onClick={() =>
          addNotification({
            message: "Default values",
          })
        }
      >
        Add Default
      </button>
      <button
        type="button"
        onClick={() => {
          for (let i = 0; i < 6; i++) {
            addNotification({ message: `N${i}` });
          }
        }}
      >
        Add Six
      </button>
      <button
        type="button"
        onClick={() => {
          const firstId = notifications[0]?.id;
          if (firstId) removeNotification(firstId);
        }}
      >
        Remove First
      </button>

      <div data-testid="count">{notifications.length}</div>
      <div data-testid="first-message">
        {notifications[0]?.message ?? "none"}
      </div>
      <div data-testid="last-message">
        {notifications[notifications.length - 1]?.message ?? "none"}
      </div>
      <div data-testid="first-type">{notifications[0]?.type ?? "none"}</div>
      <div data-testid="first-duration">
        {String(notifications[0]?.duration ?? "none")}
      </div>
    </div>
  );
}

describe("useNotification", () => {
  test("adds notification with provided values", async () => {
    render(<NotificationProbe />);

    const addCustomButton = screen.getByRole("button", {
      name: /Add Custom/i,
    });

    expect(addCustomButton).toBeInTheDocument();
    await userEvent.click(addCustomButton);

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("first-message")).toHaveTextContent("Created");
    expect(screen.getByTestId("first-type")).toHaveTextContent("success");
    expect(screen.getByTestId("first-duration")).toHaveTextContent("1000");
  });

  test("uses default type and duration", async () => {
    render(<NotificationProbe />);

    const addDefaultButton = screen.getByRole("button", {
      name: /Add Default/i,
    });

    expect(addDefaultButton).toBeInTheDocument();
    await userEvent.click(addDefaultButton);

    expect(screen.getByTestId("first-type")).toHaveTextContent("info");
    expect(screen.getByTestId("first-duration")).toHaveTextContent("3000");
  });

  test("keeps max 5 notifications and removes oldest", async () => {
    render(<NotificationProbe />);

    const addSixButton = screen.getByRole("button", { name: /Add Six/i });

    expect(addSixButton).toBeInTheDocument();
    await userEvent.click(addSixButton);

    expect(screen.getByTestId("count")).toHaveTextContent("5");
    expect(screen.getByTestId("first-message")).toHaveTextContent("N1");
    expect(screen.getByTestId("last-message")).toHaveTextContent("N5");
  });

  test("removes notification by id", async () => {
    render(<NotificationProbe />);

    const addCustomButton = screen.getByRole("button", {
      name: /Add Custom/i,
    });
    const removeFirstButton = screen.getByRole("button", {
      name: /Remove First/i,
    });

    expect(addCustomButton).toBeInTheDocument();
    expect(removeFirstButton).toBeInTheDocument();

    await userEvent.click(addCustomButton);
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await userEvent.click(removeFirstButton);

    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(screen.getByTestId("first-message")).toHaveTextContent("none");
  });
});
