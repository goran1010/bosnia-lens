import { getDayInWeek } from "./utils/getDayInWeek";

function WeatherCard({ weatherForecast }) {
  if (!weatherForecast || weatherForecast.length === 0) {
    return (
      <section>
        <p>Weather forecast failed to be fetched.</p>
      </section>
    );
  }
  return (
    <section className="flex items-center flex-wrap justify-center gap-3 dark:text-gray-100">
      {weatherForecast.slice(0, 6).map((day) => {
        return (
          <div
            key={day.datetime}
            className="flex flex-col min-w-20 items-center"
          >
            <div>{getDayInWeek(day.datetime)}</div>
            <div className="flex flex-col items-center justify-center w-16 h-16">
              <img
                src={day.iconURL}
                alt={`Icon for ${getDayInWeek(day.datetime)}`}
              />
            </div>
            <div className="flex flex-col">
              <div>min: {day.tempmin}</div>
              <div>max: {day.tempmax}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export { WeatherCard };
