import { useEffect, useContext, useState } from "react";
import { NotificationContext } from "../../../contextData/NotificationContext";
const WEATHER_API = import.meta.env.VITE_WEATHER_API_KEY;
const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/bosnia?unitGroup=metric&include=current&key=${WEATHER_API}&contentType=json`;

function useWeatherCheck(setLoading) {
  const [weatherForecast, setWeatherForecast] = useState([]);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    async function getWeather() {
      try {
        const response = await fetch(URL, { mode: "cors" });
        if (!response.ok) {
          addNotification({
            type: "error",
            message: "Failed to fetch weather data. Please try again later.",
          });
          return;
        }

        const result = await response.json();
        if (result.days && Array.isArray(result.days)) {
          for (let day of result.days) {
            const URL = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/1st%20Set%20-%20Color/${day.icon}.svg`;
            day.iconURL = URL;
          }
          addNotification({
            type: "success",
            message: "Weather data fetched successfully!",
          });
          setWeatherForecast(result.days);
        }
      } catch (err) {
        addNotification({
          type: "error",
          message: "An error occurred while fetching weather data.",
        });
        console.error("Error fetching weather data:", err);
      } finally {
        setLoading(false);
      }
    }
    getWeather();
  }, [setLoading, addNotification]);

  return { weatherForecast };
}

export { useWeatherCheck };
