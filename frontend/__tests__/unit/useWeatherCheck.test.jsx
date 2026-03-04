import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { useWeatherCheck } from "../../src/components/Home/customHooks/useWeatherCheck";
import { renderHook, waitFor } from "@testing-library/react";
import { NotificationContext } from "../../src/contextData/NotificationContext";

let mockSetWeatherForecast;
let mockSetLoading;
let fetchSpy;
let wrapper;
let addNotificationMock;

beforeEach(() => {
  mockSetWeatherForecast = vi.fn();
  mockSetLoading = vi.fn();
  addNotificationMock = vi.fn();

  fetchSpy = vi.spyOn(globalThis, "fetch");
  wrapper = function Wrapper({ children }) {
    const mockNotificationValue = {
      notifications: [],
      addNotification: addNotificationMock,
      removeNotification: vi.fn(),
    };

    return (
      <NotificationContext value={mockNotificationValue}>
        {children}
      </NotificationContext>
    );
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Weather fetch", () => {
  test("fetches weather data and sets weather forecast", async () => {
    const mockWeatherData = {
      days: [
        {
          datetime: "2026-01-17",
          tempmin: 5,
          tempmax: 15,
          icon: "clear-day",
        },
        {
          datetime: "2026-01-18",
          tempmin: 3,
          tempmax: 12,
          icon: "rain",
        },
        {
          datetime: "2026-01-19",
          tempmin: 7,
          tempmax: 18,
          icon: "cloudy",
        },
      ],
    };

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    });

    renderHook(() => useWeatherCheck(mockSetWeatherForecast, mockSetLoading), {
      wrapper,
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockSetWeatherForecast).toHaveBeenCalled();
    });

    const calledWithData = mockSetWeatherForecast.mock.calls[0][0];
    expect(calledWithData).toHaveLength(3);
    expect(calledWithData[0]).toMatchObject({
      datetime: "2026-01-17",
      tempmin: 5,
      tempmax: 15,
      icon: "clear-day",
    });
    expect(calledWithData[0].iconURL).toContain("clear-day.svg");
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  test("sets loading to false after successful fetch", async () => {
    const mockWeatherData = {
      days: [{ datetime: "2026-01-17", icon: "clear-day" }],
    };

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    });

    renderHook(() => useWeatherCheck(mockSetWeatherForecast, mockSetLoading), {
      wrapper,
    });

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  test("handles non-ok response", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    };

    fetchSpy.mockResolvedValueOnce(mockResponse);

    renderHook(() => useWeatherCheck(mockSetWeatherForecast, mockSetLoading), {
      wrapper,
    });

    await waitFor(() => {
      expect(addNotificationMock).toHaveBeenCalled();
    });

    expect(mockSetWeatherForecast).not.toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });
});
describe("Network errors", () => {
  test("handles network error", async () => {
    const networkError = new Error("Network error");
    fetchSpy.mockRejectedValueOnce(networkError);

    renderHook(() => useWeatherCheck(mockSetWeatherForecast, mockSetLoading), {
      wrapper,
    });

    await waitFor(() => {
      expect(addNotificationMock).toHaveBeenCalled();
    });

    expect(mockSetWeatherForecast).not.toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });
});
