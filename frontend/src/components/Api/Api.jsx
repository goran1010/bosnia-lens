import { EndpointCard } from "./EndPointCard";
import { endpoints } from "./utils/endpoints";

const BASE_URL = "https://round-leann-goran-jovic-1010-ccad2ae8.koyeb.app/api";

function Api() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl flex flex-col gap-8 py-8 dark:text-gray-100">
      <header>
        <h1 className="text-3xl font-bold mb-3">REST API</h1>
        <p>
          All public endpoints are available under the base URL below. No
          authentication is required.
        </p>
        <pre className="mt-3 bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm font-mono overflow-x-auto">
          {BASE_URL}
        </pre>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Postal code object</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-xs overflow-x-auto">{`{
  "id":   string   — unique identifier
  "code": number   — 5-digit postal code
  "city": string   — city name
  "post": "BH_POSTA" | "POSTE_SRP" | "HP_MOSTAR" | null
}`}</pre>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Endpoints</h2>
        {endpoints.map((ep) => (
          <EndpointCard key={ep.path} endpoint={ep} />
        ))}
      </section>
    </div>
  );
}

export { Api };
