import { getDayInWeek } from "./utils/getDayInWeek";

function WeatherCard({ weatherForecast }) {
  try {
    if (!weatherForecast || weatherForecast.length === 0) {
      return (
        <section role="status" aria-live="polite">
          <p>Weather forecast failed to be fetched.</p>
        </section>
      );
    }
    return (
      <section className="w-full" aria-labelledby="weather-forecast-heading">
        <h2 id="weather-forecast-heading" className="sr-only">
          Weather forecast
        </h2>
        <ul className="flex items-center flex-wrap justify-center gap-3 dark:text-gray-100">
          {weatherForecast.slice(0, 6).map((day) => {
            const dayInWeek = getDayInWeek(day.datetime);
            return (
              <li
                key={day.datetime}
                className="flex flex-col min-w-20 items-center"
              >
                <p>{dayInWeek}</p>
                <div className="flex flex-col items-center justify-center w-16 h-16">
                  <img src={day.iconURL} alt={`Icon for ${dayInWeek}`} />
                </div>
                <p className="flex flex-col">
                  <span>min: {day.tempmin}</span>
                  <span>max: {day.tempmax}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    );
  } catch (error) {
    console.error("Error rendering WeatherCard:", error);
    return (
      <section role="status" aria-live="polite" className="w-full text-center">
        <p className="font-bold text-red-300">
          Weather forecast failed to be fetched.
        </p>
      </section>
    );
  }
}

export { WeatherCard };
