import { useEffect, useContext } from "react";
import NotificationContext from "../utils/NotificationContext";

export default function useWeatherCheck(setWeatherForecast, setLoading) {
  const { addNotification } = useContext(NotificationContext);
  const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/bosnia?unitGroup=metric&include=current&key=RK9QGT68LJC4A8CZLA785FREP&contentType=json`;

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

        const data = await response.json();
        for (let day of data.days) {
          const URL = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/1st%20Set%20-%20Color/${day.icon}.svg`;
          day.iconURL = URL;
        }
        addNotification({
          type: "success",
          message: "Weather data fetched successfully!",
        });
        setWeatherForecast(data.days);
      } catch (err) {
        addNotification({
          type: "error",
          message: "An error occurred while fetching weather data.",
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getWeather();
  }, [URL, setLoading, setWeatherForecast, addNotification]);
}
