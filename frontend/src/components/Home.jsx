import { useEffect, useState } from "react";
import getDayInWeek from "../utils/getDayInWeek";

export default function Home() {
  const [weatherForecast, setWeatherForecast] = useState([]);
  const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/bosnia?unitGroup=metric&include=current&key=RK9QGT68LJC4A8CZLA785FREP&contentType=json`;

  useEffect(() => {
    async function getWeather() {
      const response = await fetch(URL, { mode: "cors" });
      if (!response.ok) {
        return console.log(response);
      }
      const data = await response.json();
      console.log(data.days);
      for (let day of data.days) {
        const URL = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/1st%20Set%20-%20Color/${day.icon}.svg`;
        day.iconURL = URL;
      }
      console.log(data.days);
      setWeatherForecast(data.days);
    }
    getWeather();
  }, [URL]);

  return (
    <>
      <header className="flex flex-col items-center">
        <h1 className="font-bold">Bosnia Lens</h1>
        <article>
          <p>
            A free, open-source project providing structured public data about
            Bosnia and Herzegovina through a REST API and web interface.
          </p>
          <p>
            Access comprehensive information about cities, municipalities,
            postal codes, holidays, universities (and their programs), and more
            - making Bosnian public data open, searchable, and
            developer-friendly.
          </p>
        </article>
        <article>
          <h2 className="font-bold">Data we're looking to provide includes:</h2>
          <ul>
            <li>Cities and municipalities</li>
            <li>Postal codes</li> <li>Holidays and observances</li>
            <li>Universities and their programs</li>
          </ul>
        </article>
      </header>
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
      <section className="flex flex-col items-center">
        <article className="flex flex-col items-center">
          <h2 className="font-bold">Tools</h2>
          <ul>
            <li>
              <strong>Built With Express.js</strong> - The web framework for the
              REST API
            </li>
            <li>
              <strong>React</strong> - Frontend library for building the user
              interface
            </li>
            <li>
              <strong>Vite</strong> - Build tool and development server
            </li>
            <li>
              <strong>Prisma</strong> - Database ORM and migration tool
            </li>
            <li>
              <strong>PostgreSQL</strong> - Database system
            </li>
            <li>
              <strong>Tailwind CSS</strong> - CSS framework for styling
            </li>
          </ul>
        </article>
        <div className="flex">
          <article className="flex flex-col items-center">
            <h2 className="font-bold">Contributing</h2>
            <article>
              <p>
                Please read{" "}
                <a href="https://github.com/goran1010/bosnia-lens/blob/main/CONTRIBUTING.md">
                  CONTRIBUTING.md
                </a>{" "}
                for details on our code of conduct, and the process for
                submitting pull requests to us.
              </p>
              <p>
                We welcome contributions of data, code improvements,
                documentation, and bug reports.
              </p>
              <p>
                Read our Github{" "}
                <a href="https://github.com/goran1010/bosnia-lens/blob/main/README.md">
                  README.md
                </a>{" "}
                to more information about the project.
              </p>
            </article>
          </article>
          <article className="flex flex-col items-center">
            <h2 className="font-bold">Acknowledgments</h2>
            <article>
              <p>Inspired by global open data initiatives.</p>
              <p>
                Thanks to the open-source community for tools and libraries.
              </p>
              <p>
                Special recognition to contributors helping maintain accurate
                data about Bosnia and Herzegovina.
              </p>
            </article>
          </article>
        </div>
      </section>
    </>
  );
}
