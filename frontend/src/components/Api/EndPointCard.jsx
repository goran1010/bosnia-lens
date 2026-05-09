const methodColor = {
  GET: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  POST: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  PUT: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  PATCH:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  DELETE: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

function EndpointCard({ endpoint }) {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex flex-col gap-4 bg-white dark:bg-gray-800/70">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 font-mono text-xs font-bold ${
            methodColor[endpoint.method] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
          }`}
        >
          {endpoint.method}
        </span>
        <code className="font-mono text-sm break-all">{endpoint.path}</code>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {endpoint.description}
      </p>

      {endpoint.params && (
        <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-sm font-semibold mb-1">Query parameters</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="pb-1 pr-4">Name</th>
                <th className="pb-1 pr-4">Required</th>
                <th className="pb-1">Description</th>
              </tr>
            </thead>
            <tbody>
              {endpoint.params.map((p) => (
                <tr key={p.name}>
                  <td className="pt-1 pr-4 font-mono">{p.name}</td>
                  <td className="pt-1 pr-4">{p.required ? "Yes" : "No"}</td>
                  <td className="pt-1">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold mb-1">Success response</p>
        <pre className="bg-gray-100 dark:bg-gray-900/80 rounded p-3 text-xs overflow-x-auto border border-gray-200 dark:border-gray-700">
          {endpoint.successExample}
        </pre>
      </div>

      {endpoint.errorExample && (
        <div>
          <p className="text-sm font-semibold mb-1">Error responses</p>
          <pre className="bg-gray-100 dark:bg-gray-900/80 rounded p-3 text-xs overflow-x-auto border border-gray-200 dark:border-gray-700">
            {endpoint.errorExample}
          </pre>
        </div>
      )}
    </article>
  );
}

export { EndpointCard };
