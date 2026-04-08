const methodColor = {
  GET: "text-green-600 dark:text-green-400",
};

function EndpointCard({ endpoint }) {
  return (
    <div className="border rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className={`font-mono font-bold ${methodColor[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <code className="font-mono text-sm">{endpoint.path}</code>
      </div>
      <p className="text-sm">{endpoint.description}</p>

      {endpoint.params && (
        <div>
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
        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-xs overflow-x-auto">
          {endpoint.successExample}
        </pre>
      </div>

      {endpoint.errorExample && (
        <div>
          <p className="text-sm font-semibold mb-1">Error responses</p>
          <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-xs overflow-x-auto">
            {endpoint.errorExample}
          </pre>
        </div>
      )}
    </div>
  );
}

export { EndpointCard };
