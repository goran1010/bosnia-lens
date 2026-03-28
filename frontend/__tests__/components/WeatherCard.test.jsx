import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeatherCard } from "../../src/components/Home/WeatherCard";

describe("WeatherCard Component", () => {
  const mockWeatherForecast = [
    {
      datetime: "2026-01-17",
      tempmin: 5,
      tempmax: 15,
      iconURL: "https://example.com/icon1.png",
    },
    {
      datetime: "2026-01-18",
      tempmin: 3,
      tempmax: 12,
      iconURL: "https://example.com/icon2.png",
    },
    {
      datetime: "2026-01-19",
      tempmin: 7,
      tempmax: 18,
      iconURL: "https://example.com/icon3.png",
    },
    {
      datetime: "2026-01-20",
      tempmin: 6,
      tempmax: 16,
      iconURL: "https://example.com/icon4.png",
    },
    {
      datetime: "2026-01-21",
      tempmin: 8,
      tempmax: 19,
      iconURL: "https://example.com/icon5.png",
    },
    {
      datetime: "2026-01-22",
      tempmin: 4,
      tempmax: 14,
      iconURL: "https://example.com/icon6.png",
    },
  ];

  test("renders all weather forecast items (max 6)", () => {
    render(<WeatherCard weatherForecast={mockWeatherForecast} />);

    const allDays = screen.getAllByText(/min:/i);
    expect(allDays).toHaveLength(6);
  });

  test("displays correct temperature min and max for each day", () => {
    render(<WeatherCard weatherForecast={mockWeatherForecast} />);

    expect(screen.getByText("min: 5")).toBeInTheDocument();
    expect(screen.getByText("max: 15")).toBeInTheDocument();
    expect(screen.getByText("min: 3")).toBeInTheDocument();
    expect(screen.getByText("max: 12")).toBeInTheDocument();
    expect(screen.getByText("min: 7")).toBeInTheDocument();
    expect(screen.getByText("max: 18")).toBeInTheDocument();
  });

  test("renders weather icons with correct URLs", () => {
    render(<WeatherCard weatherForecast={mockWeatherForecast} />);
    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(6);

    expect(images[0]).toHaveAttribute("src", "https://example.com/icon1.png");
    expect(images[1]).toHaveAttribute("src", "https://example.com/icon2.png");
    expect(images[5]).toHaveAttribute("src", "https://example.com/icon6.png");
  });

  test("only renders first 6 days when more than 6 days provided", () => {
    const extendedForecast = [
      ...mockWeatherForecast,
      {
        datetime: "2026-01-23",
        tempmin: 10,
        tempmax: 20,
        iconURL: "https://example.com/icon7.png",
      },
      {
        datetime: "2026-01-24",
        tempmin: 11,
        tempmax: 21,
        iconURL: "https://example.com/icon8.png",
      },
    ];

    render(<WeatherCard weatherForecast={extendedForecast} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(6);

    expect(screen.getByText("min: 5")).toBeInTheDocument();
    expect(screen.queryByText("min: 10")).not.toBeInTheDocument();
    expect(screen.queryByText("min: 11")).not.toBeInTheDocument();
  });

  test("renders with fewer than 6 days", () => {
    const shortForecast = mockWeatherForecast.slice(0, 3);
    render(<WeatherCard weatherForecast={shortForecast} />);

    const allDays = screen.getAllByText(/min:/i);
    expect(allDays).toHaveLength(3);
  });

  test("displays different day names correctly", () => {
    render(<WeatherCard weatherForecast={mockWeatherForecast} />);

    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
    expect(screen.getByText("Thursday")).toBeInTheDocument();
    expect(screen.getByText("Saturday")).toBeInTheDocument();
    expect(screen.getByText("Sunday")).toBeInTheDocument();
  });

  test("renders forecast failed when weatherForecast is empty array", () => {
    render(<WeatherCard weatherForecast={[]} />);

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);

    const errorParagraph = screen.getByText(
      "Weather forecast failed to be fetched.",
    );
    expect(errorParagraph).toBeInTheDocument();
  });
});
