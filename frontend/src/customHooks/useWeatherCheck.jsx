import { useEffect } from "react";

export default function useWeatherCheck(setWeatherForecast, setLoading) {
  const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/bosnia?unitGroup=metric&include=current&key=RK9QGT68LJC4A8CZLA785FREP&contentType=json`;

  useEffect(() => {
    async function getWeather() {
      try {
        const response = await fetch(URL, { mode: "cors" });
        if (!response.ok) {
          return console.warn(response);
        }

        const data = await response.json();
        for (let day of data.days) {
          const URL = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/1st%20Set%20-%20Color/${day.icon}.svg`;
          day.iconURL = URL;
        }

        setWeatherForecast(data.days);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getWeather();
  }, [URL, setLoading, setWeatherForecast]);
}
