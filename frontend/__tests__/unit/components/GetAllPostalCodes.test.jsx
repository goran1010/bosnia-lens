import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GetAllPostalCodes } from "../../../src/components/PostalCodes/GetAllPostalCodes";
import { NotificationContext } from "../../../src/contextData/NotificationContext";

const user = userEvent.setup();

describe("GetAllPostalCodes Component", () => {
  let mockSetSearchResult;
  let mockSetLoading;
  let mockAddNotification;
  let fetchSpy;

  beforeEach(() => {
    mockSetSearchResult = vi.fn();
    mockSetLoading = vi.fn();
    mockAddNotification = vi.fn();
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    const contextValue = {
      addNotification: mockAddNotification,
    };

    return render(
      <NotificationContext value={contextValue}>
        <GetAllPostalCodes
          setSearchResult={mockSetSearchResult}
          setLoading={mockSetLoading}
        />
      </NotificationContext>,
    );
  };

  describe("Rendering", () => {
    test("renders button with correct text", () => {
      renderComponent();

      const button = screen.getByRole("button", {
        name: /Get All/i,
      });
      expect(button).toBeInTheDocument();
    });

    test("renders as a form with submit type button", () => {
      const { container } = renderComponent();

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();

      const button = screen.getByRole("button", {
        name: /get all/i,
      });
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Successful API call", () => {
    test("fetches postal codes and updates search result", async () => {
      const mockData = [
        { postalCode: "71000", municipality: "Sarajevo" },
        { postalCode: "75000", municipality: "Tuzla" },
        { postalCode: "78000", municipality: "Banja Luka" },
      ];

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData }),
      });

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      expect(fetchSpy).toHaveBeenCalledWith(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/postal-codes`,
        { mode: "cors" },
      );

      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetSearchResult).toHaveBeenCalledWith(mockData);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    test("sets loading state before and after fetch", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(true);
      });

      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe("Failed API call", () => {
    test("handles server error response", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Server Error",
          details: [{ msg: "Unable to fetch postal codes" }],
        }),
      });

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: "error",
        message: "Server Error",
        details: "Unable to fetch postal codes",
      });
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    test("handles 404 not found error", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: "Not Found",
          details: [{ msg: "Postal codes endpoint not found" }],
        }),
      });

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        expect(mockAddNotification).toHaveBeenCalledWith({
          type: "error",
          message: "Not Found",
          details: "Postal codes endpoint not found",
        });
      });
    });

    test("does not update search result on error", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Error",
          details: [{ msg: "Error details" }],
        }),
      });

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockAddNotification).toHaveBeenCalled();

      expect(mockSetSearchResult).not.toHaveBeenCalled();
    });
  });

  describe("Network error handling", () => {
    test("handles fetch network error", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const networkError = new Error("Network error");
      fetchSpy.mockRejectedValueOnce(networkError);

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: "error",
        message:
          "An error occurred while fetching postal codes and municipalities.",
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(networkError);
      expect(mockSetLoading).toHaveBeenCalledWith(false);

      consoleErrorSpy.mockRestore();
    });
  });
});
