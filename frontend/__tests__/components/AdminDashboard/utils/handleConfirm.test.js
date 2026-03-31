import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { handleConfirm } from "../../../../src/components/AdminDashboard/utils/handleConfirm";

vi.mock("../../../../src/components/utils/getCsrfToken", () => ({
  getCsrfToken: vi.fn(),
}));

import { getCsrfToken } from "../../../../src/components/utils/getCsrfToken";

let fetchSpy;

beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, "fetch");
  getCsrfToken.mockResolvedValue("test-csrf-token");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("handleConfirm", () => {
  test("removes user from pending requests and adds to contributors on success", async () => {
    const user = { id: 1, username: "testuser" };
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    const setPendingRequests = vi.fn();
    const setCurrentContributors = vi.fn();
    const addNotification = vi.fn();

    await handleConfirm(
      user,
      setPendingRequests,
      setCurrentContributors,
      addNotification,
    );

    expect(setPendingRequests).toHaveBeenCalled();
    expect(setCurrentContributors).toHaveBeenCalled();

    // Verify pending requests filters out the user
    const filterCallback = setPendingRequests.mock.calls[0][0];
    const prev = [
      { id: 1, username: "testuser" },
      { id: 2, username: "other" },
    ];
    expect(filterCallback(prev)).toEqual([{ id: 2, username: "other" }]);
  });

  test("adds contributor to current contributors list", async () => {
    const user = { id: 1, username: "testuser" };
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    const setPendingRequests = vi.fn();
    const setCurrentContributors = vi.fn();
    const addNotification = vi.fn();

    await handleConfirm(
      user,
      setPendingRequests,
      setCurrentContributors,
      addNotification,
    );

    // Verify contributor is added
    const addCallback = setCurrentContributors.mock.calls[0][0];
    const prev = [{ id: 2, username: "other" }];
    expect(addCallback(prev)).toEqual([
      { id: 2, username: "other" },
      { id: 1, username: "testuser" },
    ]);
  });

  test("sends success notification on confirmation success", async () => {
    const user = { id: 1, username: "testuser" };
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    const addNotification = vi.fn();

    await handleConfirm(user, vi.fn(), vi.fn(), addNotification);

    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        message: expect.stringContaining("testuser"),
      }),
    );
  });

  test("sends error notification and does not update state on failed response", async () => {
    const user = { id: 1, username: "testuser" };
    fetchSpy.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Already a contributor",
        details: [{ msg: "Duplicate" }],
      }),
    });
    const setPendingRequests = vi.fn();
    const setCurrentContributors = vi.fn();
    const addNotification = vi.fn();

    await handleConfirm(
      user,
      setPendingRequests,
      setCurrentContributors,
      addNotification,
    );

    expect(setPendingRequests).not.toHaveBeenCalled();
    expect(setCurrentContributors).not.toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
  });

  test("sends error notification when getCsrfToken returns null", async () => {
    getCsrfToken.mockResolvedValue(null);
    const addNotification = vi.fn();

    await handleConfirm(
      { id: 1, username: "test" },
      vi.fn(),
      vi.fn(),
      addNotification,
    );

    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("sends CSRF token as header in request", async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await handleConfirm({ id: 1, username: "test" }, vi.fn(), vi.fn(), vi.fn());

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-csrf-token": "test-csrf-token",
        }),
      }),
    );
  });
});
