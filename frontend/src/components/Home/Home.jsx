import { useState } from "react";

function Home() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex flex-col items-center gap-4 py-2 dark:text-gray-100">
      <header className="flex flex-col items-center gap-3 w-full">
        <h1 className="font-bold">Bosnia Lens</h1>
        <section className="w-full max-w-4xl text-left">
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
        </section>
        <div className="grid grid-rows-1 gap-3 md:grid-cols-2 w-full max-w-5xl">
          <section className="text-left">
            <h2 className="font-bold text-center">
              Data we're looking to provide includes:
            </h2>
            <ul>
              <li>Cities and municipalities</li>
              <li>Postal codes</li> <li>Holidays and observances</li>
              <li>Universities and their programs</li>
            </ul>
          </section>
          <section className="flex flex-col items-center text-left">
            <h2 className="font-bold">Tools</h2>
            <ul>
              <li>
                <strong>Built With Express.js</strong> - The web framework for
                the REST API
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
          </section>
        </div>
      </header>

      <section className="flex flex-col items-center gap-3 w-full">
        <div className="grid grid-rows-1 gap-3 md:grid-cols-2 w-full max-w-5xl">
          <section className="flex flex-col items-center text-left">
            <h2 className="font-bold">Contributing</h2>
            <div>
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
            </div>
          </section>
          <section className="flex flex-col items-center text-left">
            <h2 className="font-bold">Acknowledgments</h2>
            <div>
              <p>Inspired by global open data initiatives.</p>
              <p>
                Thanks to the open-source community for tools and libraries.
              </p>
              <p>
                Special recognition to contributors helping maintain accurate
                data about Bosnia and Herzegovina.
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export { Home };
