import getDayInWeek from "../../utils/getDayInWeek";

export default function WeatherCard({ weatherForecast }) {
  return (
    <section className="flex flex-col items-center">
      <div className="flex">
        {weatherForecast.slice(0, 6).map((day) => {
          return (
            <div
              key={day.datetime}
              className="flex flex-col min-w-21 items-center"
            >
              <div>{getDayInWeek(day.datetime)}</div>
              <div className="flex flex-col items-center justify-center w-15 h-15">
                <img src={day.iconURL} alt="" />
              </div>
              <div className="flex flex-col">
                <div>min: {day.tempmin}</div>
                <div>max: {day.tempmax}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
