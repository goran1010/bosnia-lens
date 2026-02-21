import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GetAllPostalCodes } from "../../src/components/PostalCodes/GetAllPostalCodes";
import { UserDataContext } from "../../src/utils/UserDataContext";

const user = userEvent.setup();

describe("GetAllPostalCodes Component", () => {
  let mockSetSearchResult;
  let mockSetLoading;
  let mockSetMessage;
  let fetchSpy;

  beforeEach(() => {
    mockSetSearchResult = vi.fn();
    mockSetLoading = vi.fn();
    mockSetMessage = vi.fn();
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    const contextValue = {
      setMessage: mockSetMessage,
      userData: [],
      message: [],
    };

    return render(
      <UserDataContext value={contextValue}>
        <GetAllPostalCodes
          setSearchResult={mockSetSearchResult}
          setLoading={mockSetLoading}
        />
      </UserDataContext>,
    );
  };

  describe("Rendering", () => {
    test("renders button with correct text", () => {
      renderComponent();

      const button = screen.getByRole("button", {
        name: "Get All Postal Codes and Municipalities",
      });
      expect(button).toBeInTheDocument();
    });

    test("renders as a form with submit type button", () => {
      const { container } = renderComponent();

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();

      screen.debug();

      const button = screen.getByRole("button", {
        name: /get all postal codes and municipalities/i,
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
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Server Error",
          details: ["Unable to fetch postal codes"],
        }),
      });

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetMessage).toHaveBeenCalledWith([
        "Server Error",
        ["Unable to fetch postal codes"],
      ]);

      expect(consoleWarnSpy).toHaveBeenCalledWith("Server Error", [
        "Unable to fetch postal codes",
      ]);
      expect(mockSetLoading).toHaveBeenCalledWith(false);

      consoleWarnSpy.mockRestore();
    });

    test("handles 404 not found error", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: "Not Found",
          details: ["Postal codes endpoint not found"],
        }),
      });

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        expect(mockSetMessage).toHaveBeenCalledWith([
          "Not Found",
          ["Postal codes endpoint not found"],
        ]);
      });

      consoleWarnSpy.mockRestore();
    });

    test("does not update search result on error", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Error",
          details: ["Error details"],
        }),
      });

      renderComponent();

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetMessage).toHaveBeenCalled();

      expect(mockSetSearchResult).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
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

      expect(mockSetMessage).toHaveBeenCalledWith([networkError]);

      expect(consoleErrorSpy).toHaveBeenCalledWith(networkError);
      expect(mockSetLoading).toHaveBeenCalledWith(false);

      consoleErrorSpy.mockRestore();
    });
  });
});
